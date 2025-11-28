from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import db, User, OnboardingAssessment

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

def validate_email(email):
    """Simple email validation"""
    import re
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_password(password):
    """Validate password strength"""
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    return True, "Password is valid"

@auth_bp.route('/signup', methods=['POST'])
def signup():
    """
    User signup endpoint with optional onboarding assessment
    Request body:
    {
        "email": "user@example.com",
        "password": "password123",
        "mainGoal": "switch-career",
        "age": "27-30",
        "currentSituation": "working-non-related",
        "biggestChallenge": "no-experience",
        "learningPace": "5-10",
        "cvFile": { "name": "...", "size": ..., "type": "..." },
        "skillLevel": 4,
        "careerPath": "web-dev",
        "otherCareerPath": "",
        "targetTimeframe": "6-months",
        "learningStyle": "visual",
        "previousCourses": "building",
        "certifications": "CS50, Coursera Web Development Bootcamp",
        "understanding": "yes",
        "motivation": "I want to earn more income to support my parents.",
        "hearAbout": "social"
    }
    """
    try:
        data = request.get_json()
        
        # Validate required auth fields
        if not data or not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email and password are required'}), 400
        
        email = data.get('email').strip().lower()
        fullName = data.get('fullName').strip()
        role = data.get('role').strip()
        password = data.get('password')
        
        # Validate email format
        if not validate_email(email):
            return jsonify({'error': 'Invalid email format'}), 400
        
        # Validate password strength
        is_valid, message = validate_password(password)
        if not is_valid:
            return jsonify({'error': message}), 400
        
        # Check if user already exists
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({'error': 'User with this email already exists'}), 409
        
        # Create new user
        user = User(email=email, full_name=fullName, role=role, has_taken_onboarding=False)
        user.set_password(password)
        
        db.session.add(user)
        db.session.flush()  # Get user ID without committing
        
        # Create onboarding assessment if data is provided
        assessment = None
        if data.get('mainGoal'):
            # Validate required assessment fields
            required_assessment_fields = ['mainGoal', 'age', 'currentSituation', 'biggestChallenge',
                                         'learningPace', 'skillLevel', 'careerPath', 'targetTimeframe',
                                         'learningStyle', 'understanding', 'hearAbout']
            
            # Check if all required fields are present
            missing_fields = [field for field in required_assessment_fields if not data.get(field)]
            if missing_fields:
                db.session.rollback()
                return jsonify({'error': f'Assessment fields required: {", ".join(missing_fields)}'}), 400
            
            # Parse CV file if present
            cv_filename = None
            cv_file_size = None
            cv_file_type = None
            
            if data.get('cvFile') and isinstance(data.get('cvFile'), dict):
                cv_data = data.get('cvFile')
                cv_filename = cv_data.get('name')
                cv_file_size = cv_data.get('size')
                cv_file_type = cv_data.get('type')
            
            # Create assessment
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
        
        # Commit all changes
        db.session.commit()
        
        # Generate token
        access_token = create_access_token(identity=str(user.id))
        
        response = {
            'message': 'User created successfully',
            'user': user.to_dict(),
            'access_token': access_token
        }
        
        # Include assessment if it was created
        if assessment:
            response['assessment'] = assessment.to_dict()
        
        return jsonify(response), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """
    User login endpoint
    Request body:
    {
        "email": "user@example.com",
        "password": "password123"
    }
    """
    try:
        data = request.get_json()
        
        if not data or not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email and password are required'}), 400
        
        email = data.get('email').strip().lower()
        password = data.get('password')
        
        user = User.query.filter_by(email=email).first()
        
        if not user or not user.check_password(password):
            return jsonify({'error': 'Invalid email or password'}), 401
        
        access_token = create_access_token(identity=str(user.id))
        
        return jsonify({
            'message': 'Login successful',
            'user': user.to_dict(),
            'access_token': access_token
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@auth_bp.route('/api/onboarding/submit', methods=['POST'])
@jwt_required() # Protect the route, assuming you use Flask-JWT-Extended
def submit_onboarding_assessment():
    """
    Handles the submission of the Onboarding Assessment form data, including file upload.
    This route expects a multipart/form-data request.
    """
    
    # 1. Get the current authenticated User ID
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404

    # 2. Get form data from request.form (for non-file fields)
    data = request.form

    # 3. Basic Validation (Mirroring Step 1 & 2 requirements from frontend)
    required_fields = ['mainGoal', 'age', 'currentSituation', 'biggestChallenge', 
                       'learningPace', 'careerPath', 'targetTimeframe', 'learningStyle', 
                       'previousCourses', 'understanding', 'hearAbout']
    
    for field in required_fields:
        if not data.get(field):
            return jsonify({"msg": f"Missing required field: {field}"}), 400

    # Conditional validation for 'other' career path
    career_path = data.get('careerPath')
    other_career_path = data.get('otherCareerPath')
    if career_path == 'other-input' and not other_career_path:
        return jsonify({"msg": "Please specify your career path"}), 400
        
    # Conditional validation for certifications if relevant option is selected
    previous_courses = data.get('previousCourses')
    certifications = data.get('certifications', '')
    if previous_courses in ['incomplete', 'no-work', 'building'] and not certifications.strip():
        return jsonify({"msg": "Please list your previous courses/certifications"}), 400

    # 4. Handle CV File Upload (Optional but handled if present)
    # cv_filename = None
    # cv_file_size = None
    # cv_file_type = None
    
    # if 'cvFile' in request.files:
    #     file = request.files['cvFile']
    #     if file and allowed_file(file.filename):
    #         if file.content_length > MAX_FILE_SIZE:
    #             return jsonify({"msg": f"File size exceeds the limit of {MAX_FILE_SIZE_MB}MB"}), 400
                
    #         filename = secure_filename(f"{user_id}_{file.filename}") # Prefix with user ID for uniqueness
    #         file_path = os.path.join(UPLOAD_FOLDER, filename)
    #         file.save(file_path)

    #         cv_filename = filename
    #         cv_file_size = file.content_length
    #         cv_file_type = file.content_type
    #     elif file.filename != '':
    #          return jsonify({"msg": "Invalid file type or format. Allowed: PDF, DOCX"}), 400

    # 5. Create or Update OnboardingAssessment record
    assessment = OnboardingAssessment.query.filter_by(user_id=user_id).first()
    if not assessment:
        assessment = OnboardingAssessment(user_id=user_id)

    try:
        # Map form data to model fields
        assessment.main_goal = data['mainGoal']
        assessment.age = data['age']
        assessment.current_situation = data['currentSituation']
        assessment.biggest_challenge = data['biggestChallenge']
        assessment.learning_pace = data['learningPace']
        assessment.skill_level = int(data.get('skillLevel', 1)) # Default to 1 if not provided
        assessment.career_path = career_path
        assessment.other_career_path = other_career_path
        assessment.target_timeframe = data['targetTimeframe']
        assessment.learning_style = data['learningStyle']
        assessment.previous_courses = previous_courses
        assessment.certifications = certifications
        assessment.understanding = data['understanding']
        assessment.motivation = data.get('motivation', '')
        assessment.hear_about = data['hearAbout']
        
        # File data
        # assessment.cv_filename = cv_filename
        # assessment.cv_file_size = cv_file_size
        # assessment.cv_file_type = cv_file_type
        
        # Mark User as having completed onboarding
        user.has_taken_onboarding = True

        db.session.add(assessment)
        db.session.commit()

        return jsonify({
            "msg": "Onboarding successfully submitted!",
            "assessment_id": assessment.id,
            "user_id": user.id,
        }), 201

    except Exception as e:
        db.session.rollback()
        print(f"Database error: {e}")
        return jsonify({"msg": "An internal server error occurred during submission."}), 500

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """
    Get current logged-in user information
    Headers: Authorization: Bearer <access_token>
    """
    try:
        user_id = get_jwt_identity()
        user = User.query.get(int(user_id))
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({
            'user': user.to_dict()
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
