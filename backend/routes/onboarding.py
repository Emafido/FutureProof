from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, BioData, Interest, Education, Experience, Certification
from datetime import datetime

onboarding_bp = Blueprint('onboarding', __name__, url_prefix='/api/onboarding')

def get_current_user_or_404():
    """Helper to get current user or return 404"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return None
    return user

# ===================== STEP 1: BIODATA =====================

@onboarding_bp.route('/biodata', methods=['POST'])
@jwt_required()
def create_biodata():
    """
    Create or update user biodata (Step 1)
    Request body:
    {
        "first_name": "John",
        "last_name": "Doe",
        "phone": "+1234567890",
        "date_of_birth": "1990-01-15",
        "country": "United States",
        "city": "New York",
        "bio": "Software developer",
        "profile_image": "https://example.com/image.jpg"
    }
    """
    try:
        user = get_current_user_or_404()
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['first_name', 'last_name']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Check if biodata already exists
        biodata = BioData.query.filter_by(user_id=user.id).first()
        
        if biodata:
            # Update existing biodata
            biodata.first_name = data.get('first_name', biodata.first_name)
            biodata.last_name = data.get('last_name', biodata.last_name)
            biodata.phone = data.get('phone')
            biodata.country = data.get('country')
            biodata.city = data.get('city')
            biodata.bio = data.get('bio')
            biodata.profile_image = data.get('profile_image')
            
            if data.get('date_of_birth'):
                biodata.date_of_birth = datetime.strptime(data.get('date_of_birth'), '%Y-%m-%d').date()
        else:
            # Create new biodata
            biodata = BioData(
                user_id=user.id,
                first_name=data.get('first_name'),
                last_name=data.get('last_name'),
                phone=data.get('phone'),
                country=data.get('country'),
                city=data.get('city'),
                bio=data.get('bio'),
                profile_image=data.get('profile_image')
            )
            
            if data.get('date_of_birth'):
                biodata.date_of_birth = datetime.strptime(data.get('date_of_birth'), '%Y-%m-%d').date()
        
        db.session.add(biodata)
        db.session.commit()
        
        return jsonify({
            'message': 'Biodata saved successfully',
            'biodata': biodata.to_dict()
        }), 201 if not biodata.id else 200
    
    except ValueError as e:
        return jsonify({'error': f'Invalid date format: {str(e)}'}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@onboarding_bp.route('/biodata', methods=['GET'])
@jwt_required()
def get_biodata():
    """Get user biodata"""
    try:
        user = get_current_user_or_404()
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        biodata = BioData.query.filter_by(user_id=user.id).first()
        
        if not biodata:
            return jsonify({'error': 'Biodata not found'}), 404
        
        return jsonify({
            'biodata': biodata.to_dict()
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ===================== STEP 2: INTERESTS, SKILLS, CAREER PREFERENCES =====================

@onboarding_bp.route('/interests', methods=['POST'])
@jwt_required()
def add_interest():
    """
    Add interest, skill, or career preference (Step 2)
    Request body:
    {
        "category": "interest|skill|career_preference",
        "value": "Machine Learning",
        "proficiency_level": "intermediate"
    }
    """
    try:
        user = get_current_user_or_404()
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        
        # Validate input
        required_fields = ['category', 'value']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        category = data.get('category').lower()
        valid_categories = ['interest', 'skill', 'career_preference']
        
        if category not in valid_categories:
            return jsonify({'error': f'category must be one of: {", ".join(valid_categories)}'}), 400
        
        # Check for duplicates
        existing = Interest.query.filter_by(
            user_id=user.id,
            category=category,
            value=data.get('value')
        ).first()
        
        if existing:
            return jsonify({'error': 'This item already exists'}), 409
        
        interest = Interest(
            user_id=user.id,
            category=category,
            value=data.get('value'),
            proficiency_level=data.get('proficiency_level')
        )
        
        db.session.add(interest)
        db.session.commit()
        
        return jsonify({
            'message': 'Interest/skill added successfully',
            'interest': interest.to_dict()
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@onboarding_bp.route('/interests', methods=['GET'])
@jwt_required()
def get_interests():
    """Get all user interests, skills, and career preferences"""
    try:
        user = get_current_user_or_404()
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        interests = Interest.query.filter_by(user_id=user.id).all()
        
        # Group by category
        grouped = {
            'interests': [],
            'skills': [],
            'career_preferences': []
        }
        
        for interest in interests:
            if interest.category == 'interest':
                grouped['interests'].append(interest.to_dict())
            elif interest.category == 'skill':
                grouped['skills'].append(interest.to_dict())
            elif interest.category == 'career_preference':
                grouped['career_preferences'].append(interest.to_dict())
        
        return jsonify(grouped), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@onboarding_bp.route('/interests/<int:interest_id>', methods=['DELETE'])
@jwt_required()
def delete_interest(interest_id):
    """Delete an interest/skill/career preference"""
    try:
        user = get_current_user_or_404()
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        interest = Interest.query.filter_by(id=interest_id, user_id=user.id).first()
        
        if not interest:
            return jsonify({'error': 'Interest not found'}), 404
        
        db.session.delete(interest)
        db.session.commit()
        
        return jsonify({'message': 'Interest deleted successfully'}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# ===================== STEP 3: EDUCATION =====================

@onboarding_bp.route('/education', methods=['POST'])
@jwt_required()
def add_education():
    """
    Add education record (Step 3)
    Request body:
    {
        "institution": "Harvard University",
        "degree": "Bachelor",
        "field_of_study": "Computer Science",
        "start_date": "2020-01-15",
        "end_date": "2024-05-30",
        "is_current": false,
        "grade": "3.8"
    }
    """
    try:
        user = get_current_user_or_404()
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        
        # Validate input
        required_fields = ['institution', 'degree', 'start_date']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        education = Education(
            user_id=user.id,
            institution=data.get('institution'),
            degree=data.get('degree'),
            field_of_study=data.get('field_of_study'),
            grade=data.get('grade'),
            is_current=data.get('is_current', False)
        )
        
        # Parse dates
        try:
            education.start_date = datetime.strptime(data.get('start_date'), '%Y-%m-%d').date()
            if data.get('end_date'):
                education.end_date = datetime.strptime(data.get('end_date'), '%Y-%m-%d').date()
        except ValueError as e:
            return jsonify({'error': f'Invalid date format: {str(e)}'}), 400
        
        db.session.add(education)
        db.session.commit()
        
        return jsonify({
            'message': 'Education record added successfully',
            'education': education.to_dict()
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@onboarding_bp.route('/education', methods=['GET'])
@jwt_required()
def get_education():
    """Get all user education records"""
    try:
        user = get_current_user_or_404()
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        education = Education.query.filter_by(user_id=user.id).all()
        
        return jsonify({
            'education': [e.to_dict() for e in education]
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@onboarding_bp.route('/education/<int:education_id>', methods=['PUT'])
@jwt_required()
def update_education(education_id):
    """Update education record"""
    try:
        user = get_current_user_or_404()
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        education = Education.query.filter_by(id=education_id, user_id=user.id).first()
        
        if not education:
            return jsonify({'error': 'Education record not found'}), 404
        
        data = request.get_json()
        
        education.institution = data.get('institution', education.institution)
        education.degree = data.get('degree', education.degree)
        education.field_of_study = data.get('field_of_study', education.field_of_study)
        education.grade = data.get('grade', education.grade)
        education.is_current = data.get('is_current', education.is_current)
        
        if data.get('start_date'):
            education.start_date = datetime.strptime(data.get('start_date'), '%Y-%m-%d').date()
        
        if data.get('end_date'):
            education.end_date = datetime.strptime(data.get('end_date'), '%Y-%m-%d').date()
        
        db.session.commit()
        
        return jsonify({
            'message': 'Education record updated successfully',
            'education': education.to_dict()
        }), 200
    
    except ValueError as e:
        return jsonify({'error': f'Invalid date format: {str(e)}'}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@onboarding_bp.route('/education/<int:education_id>', methods=['DELETE'])
@jwt_required()
def delete_education(education_id):
    """Delete education record"""
    try:
        user = get_current_user_or_404()
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        education = Education.query.filter_by(id=education_id, user_id=user.id).first()
        
        if not education:
            return jsonify({'error': 'Education record not found'}), 404
        
        db.session.delete(education)
        db.session.commit()
        
        return jsonify({'message': 'Education record deleted successfully'}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# ===================== STEP 3: EXPERIENCE =====================

@onboarding_bp.route('/experience', methods=['POST'])
@jwt_required()
def add_experience():
    """
    Add work experience (Step 3)
    Request body:
    {
        "company": "Google",
        "position": "Software Engineer",
        "description": "Worked on backend services",
        "start_date": "2022-01-15",
        "end_date": "2024-01-30",
        "is_current": false
    }
    """
    try:
        user = get_current_user_or_404()
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        
        # Validate input
        required_fields = ['company', 'position', 'start_date']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        experience = Experience(
            user_id=user.id,
            company=data.get('company'),
            position=data.get('position'),
            description=data.get('description'),
            is_current=data.get('is_current', False)
        )
        
        # Parse dates
        try:
            experience.start_date = datetime.strptime(data.get('start_date'), '%Y-%m-%d').date()
            if data.get('end_date'):
                experience.end_date = datetime.strptime(data.get('end_date'), '%Y-%m-%d').date()
        except ValueError as e:
            return jsonify({'error': f'Invalid date format: {str(e)}'}), 400
        
        db.session.add(experience)
        db.session.commit()
        
        return jsonify({
            'message': 'Experience added successfully',
            'experience': experience.to_dict()
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@onboarding_bp.route('/experience', methods=['GET'])
@jwt_required()
def get_experience():
    """Get all user work experience"""
    try:
        user = get_current_user_or_404()
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        experience = Experience.query.filter_by(user_id=user.id).all()
        
        return jsonify({
            'experience': [e.to_dict() for e in experience]
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@onboarding_bp.route('/experience/<int:experience_id>', methods=['PUT'])
@jwt_required()
def update_experience(experience_id):
    """Update work experience"""
    try:
        user = get_current_user_or_404()
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        experience = Experience.query.filter_by(id=experience_id, user_id=user.id).first()
        
        if not experience:
            return jsonify({'error': 'Experience not found'}), 404
        
        data = request.get_json()
        
        experience.company = data.get('company', experience.company)
        experience.position = data.get('position', experience.position)
        experience.description = data.get('description', experience.description)
        experience.is_current = data.get('is_current', experience.is_current)
        
        if data.get('start_date'):
            experience.start_date = datetime.strptime(data.get('start_date'), '%Y-%m-%d').date()
        
        if data.get('end_date'):
            experience.end_date = datetime.strptime(data.get('end_date'), '%Y-%m-%d').date()
        
        db.session.commit()
        
        return jsonify({
            'message': 'Experience updated successfully',
            'experience': experience.to_dict()
        }), 200
    
    except ValueError as e:
        return jsonify({'error': f'Invalid date format: {str(e)}'}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@onboarding_bp.route('/experience/<int:experience_id>', methods=['DELETE'])
@jwt_required()
def delete_experience(experience_id):
    """Delete work experience"""
    try:
        user = get_current_user_or_404()
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        experience = Experience.query.filter_by(id=experience_id, user_id=user.id).first()
        
        if not experience:
            return jsonify({'error': 'Experience not found'}), 404
        
        db.session.delete(experience)
        db.session.commit()
        
        return jsonify({'message': 'Experience deleted successfully'}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# ===================== STEP 3: CERTIFICATIONS =====================

@onboarding_bp.route('/certifications', methods=['POST'])
@jwt_required()
def add_certification():
    """
    Add certification (Step 3)
    Request body:
    {
        "name": "AWS Solutions Architect",
        "issuer": "Amazon Web Services",
        "issue_date": "2023-06-15",
        "expiration_date": "2025-06-15",
        "credential_id": "ABC123",
        "credential_url": "https://example.com/cert"
    }
    """
    try:
        user = get_current_user_or_404()
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        
        # Validate input
        required_fields = ['name', 'issuer', 'issue_date']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        certification = Certification(
            user_id=user.id,
            name=data.get('name'),
            issuer=data.get('issuer'),
            credential_id=data.get('credential_id'),
            credential_url=data.get('credential_url')
        )
        
        # Parse dates
        try:
            certification.issue_date = datetime.strptime(data.get('issue_date'), '%Y-%m-%d').date()
            if data.get('expiration_date'):
                certification.expiration_date = datetime.strptime(data.get('expiration_date'), '%Y-%m-%d').date()
        except ValueError as e:
            return jsonify({'error': f'Invalid date format: {str(e)}'}), 400
        
        db.session.add(certification)
        db.session.commit()
        
        return jsonify({
            'message': 'Certification added successfully',
            'certification': certification.to_dict()
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@onboarding_bp.route('/certifications', methods=['GET'])
@jwt_required()
def get_certifications():
    """Get all user certifications"""
    try:
        user = get_current_user_or_404()
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        certifications = Certification.query.filter_by(user_id=user.id).all()
        
        return jsonify({
            'certifications': [c.to_dict() for c in certifications]
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@onboarding_bp.route('/certifications/<int:certification_id>', methods=['PUT'])
@jwt_required()
def update_certification(certification_id):
    """Update certification"""
    try:
        user = get_current_user_or_404()
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        certification = Certification.query.filter_by(id=certification_id, user_id=user.id).first()
        
        if not certification:
            return jsonify({'error': 'Certification not found'}), 404
        
        data = request.get_json()
        
        certification.name = data.get('name', certification.name)
        certification.issuer = data.get('issuer', certification.issuer)
        certification.credential_id = data.get('credential_id', certification.credential_id)
        certification.credential_url = data.get('credential_url', certification.credential_url)
        
        if data.get('issue_date'):
            certification.issue_date = datetime.strptime(data.get('issue_date'), '%Y-%m-%d').date()
        
        if data.get('expiration_date'):
            certification.expiration_date = datetime.strptime(data.get('expiration_date'), '%Y-%m-%d').date()
        
        db.session.commit()
        
        return jsonify({
            'message': 'Certification updated successfully',
            'certification': certification.to_dict()
        }), 200
    
    except ValueError as e:
        return jsonify({'error': f'Invalid date format: {str(e)}'}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@onboarding_bp.route('/certifications/<int:certification_id>', methods=['DELETE'])
@jwt_required()
def delete_certification(certification_id):
    """Delete certification"""
    try:
        user = get_current_user_or_404()
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        certification = Certification.query.filter_by(id=certification_id, user_id=user.id).first()
        
        if not certification:
            return jsonify({'error': 'Certification not found'}), 404
        
        db.session.delete(certification)
        db.session.commit()
        
        return jsonify({'message': 'Certification deleted successfully'}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# ===================== PROFILE SUMMARY =====================

@onboarding_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile_summary():
    """Get complete user profile with all onboarding data"""
    try:
        user = get_current_user_or_404()
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        biodata = BioData.query.filter_by(user_id=user.id).first()
        interests = Interest.query.filter_by(user_id=user.id).all()
        education = Education.query.filter_by(user_id=user.id).all()
        experience = Experience.query.filter_by(user_id=user.id).all()
        certifications = Certification.query.filter_by(user_id=user.id).all()
        
        # Group interests
        grouped_interests = {
            'interests': [],
            'skills': [],
            'career_preferences': []
        }
        
        for interest in interests:
            if interest.category == 'interest':
                grouped_interests['interests'].append(interest.to_dict())
            elif interest.category == 'skill':
                grouped_interests['skills'].append(interest.to_dict())
            elif interest.category == 'career_preference':
                grouped_interests['career_preferences'].append(interest.to_dict())
        
        profile = {
            'user': user.to_dict(),
            'biodata': biodata.to_dict() if biodata else None,
            'interests_skills': grouped_interests,
            'education': [e.to_dict() for e in education],
            'experience': [e.to_dict() for e in experience],
            'certifications': [c.to_dict() for c in certifications]
        }
        
        return jsonify(profile), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
