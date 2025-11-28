from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, OnboardingAssessment
from datetime import datetime

onboarding_bp = Blueprint('onboarding', __name__, url_prefix='/api/onboarding')

def get_current_user_or_404():
    """Helper to get current user or return 404"""
    user_id = get_jwt_identity()
    user = User.query.get(int(user_id))
    if not user:
        return None
    return user

# ===================== UNIFIED ONBOARDING ASSESSMENT =====================

@onboarding_bp.route('/assessment', methods=['POST'])
@jwt_required()
def submit_assessment():
    """
    Submit/Update onboarding assessment questionnaire.
    This is the primary onboarding endpoint that captures all user assessment data.
    
    Request body can be any of the assessment questionnaire formats.
    """
    try:
        user = get_current_user_or_404()
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['mainGoal', 'age', 'currentSituation', 'biggestChallenge', 
                          'learningPace', 'skillLevel', 'careerPath', 'targetTimeframe', 
                          'learningStyle', 'understanding', 'hearAbout']
        
        missing_fields = [field for field in required_fields if not data.get(field)]
        if missing_fields:
            return jsonify({'error': f'Missing required fields: {", ".join(missing_fields)}'}), 400
        
        # Parse CV file if present
        cv_filename = None
        cv_file_size = None
        cv_file_type = None
        
        if data.get('cvFile') and isinstance(data.get('cvFile'), dict):
            cv_data = data.get('cvFile')
            cv_filename = cv_data.get('name')
            cv_file_size = cv_data.get('size')
            cv_file_type = cv_data.get('type')
        
        # Check if assessment already exists
        assessment = OnboardingAssessment.query.filter_by(user_id=user.id).first()
        
        if assessment:
            # Update existing assessment
            assessment.main_goal = data.get('mainGoal')
            assessment.age = data.get('age')
            assessment.current_situation = data.get('currentSituation')
            assessment.biggest_challenge = data.get('biggestChallenge')
            assessment.learning_pace = data.get('learningPace')
            assessment.cv_filename = cv_filename
            assessment.cv_file_size = cv_file_size
            assessment.cv_file_type = cv_file_type
            assessment.skill_level = data.get('skillLevel')
            assessment.career_path = data.get('careerPath')
            assessment.other_career_path = data.get('otherCareerPath')
            assessment.target_timeframe = data.get('targetTimeframe')
            assessment.learning_style = data.get('learningStyle')
            assessment.previous_courses = data.get('previousCourses')
            assessment.certifications = data.get('certifications')
            assessment.understanding = data.get('understanding')
            assessment.motivation = data.get('motivation')
            assessment.hear_about = data.get('hearAbout')
        else:
            # Create new assessment
            assessment = OnboardingAssessment(
                user_id=user.id,
                main_goal=data.get('mainGoal'),
                age=data.get('age'),
                current_situation=data.get('currentSituation'),
                biggest_challenge=data.get('biggestChallenge'),
                learning_pace=data.get('learningPace'),
                cv_filename=cv_filename,
                cv_file_size=cv_file_size,
                cv_file_type=cv_file_type,
                skill_level=data.get('skillLevel'),
                career_path=data.get('careerPath'),
                other_career_path=data.get('otherCareerPath'),
                target_timeframe=data.get('targetTimeframe'),
                learning_style=data.get('learningStyle'),
                previous_courses=data.get('previousCourses'),
                certifications=data.get('certifications'),
                understanding=data.get('understanding'),
                motivation=data.get('motivation'),
                hear_about=data.get('hearAbout')
            )
        
        db.session.add(assessment)
        db.session.commit()
        
        return jsonify({
            'message': 'Assessment submitted successfully',
            'assessment': assessment.to_dict()
        }), 201 if not assessment.id else 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@onboarding_bp.route('/assessment', methods=['GET'])
@jwt_required()
def get_assessment():
    """Get user's onboarding assessment"""
    try:
        user = get_current_user_or_404()
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        assessment = OnboardingAssessment.query.filter_by(user_id=user.id).first()
        
        if not assessment:
            return jsonify({'error': 'Assessment not found'}), 404
        
        return jsonify({
            'assessment': assessment.to_dict()
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ===================== AI-GENERATED RECOMMENDED JOB TITLES =====================

@onboarding_bp.route('/recommended-jobs', methods=['POST'])
@jwt_required()
def generate_recommended_jobs():
    """
    Generate 3 recommended job titles based on user profile using OpenAI.
    Calls OpenAI API to generate personalized job title suggestions.
    
    Prerequisites:
    - User must have completed the onboarding assessment
    - OpenAI API key must be configured in .env
    """
    try:
        from utils.ai_service import generate_job_titles
        
        user = get_current_user_or_404()
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get user's assessment
        assessment = OnboardingAssessment.query.filter_by(user_id=user.id).first()
        
        if not assessment:
            return jsonify({'error': 'Please complete the onboarding assessment first'}), 400
        
        # Build profile dictionary
        profile = {
            'assessment': assessment.to_dict(),
            'user': {
                'email': user.email
            }
        }
        
        # Generate job titles using OpenAI
        job_titles = generate_job_titles(profile)
        
        if not job_titles:
            return jsonify({'error': 'Failed to generate job titles'}), 500
        
        # Save job titles to assessment
        assessment.recommended_job_titles = job_titles
        db.session.commit()
        
        return jsonify({
            'message': 'Job titles generated successfully',
            'recommended_job_titles': job_titles
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@onboarding_bp.route('/recommended-jobs', methods=['GET'])
@jwt_required()
def get_recommended_jobs():
    """
    Retrieve previously generated recommended job titles.
    """
    try:
        user = get_current_user_or_404()
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        assessment = OnboardingAssessment.query.filter_by(user_id=user.id).first()
        
        if not assessment:
            return jsonify({'error': 'Assessment not found'}), 404
        
        if not assessment.recommended_job_titles:
            return jsonify({'error': 'No job titles generated yet'}), 404
        
        return jsonify({
            'recommended_job_titles': assessment.recommended_job_titles
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
