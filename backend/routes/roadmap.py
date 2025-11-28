from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, CareerRoadmap, OnboardingAssessment
from datetime import datetime
from utils.roadmap_service import generate_market_aware_roadmap

roadmap_bp = Blueprint('roadmap', __name__, url_prefix='/api/roadmap')

def get_current_user_or_404():
    """Helper to get current user or return 404"""
    user_id = get_jwt_identity()
    user = User.query.get(int(user_id))
    if not user:
        return None
    return user

@roadmap_bp.route('', methods=['GET'])
@jwt_required()
def get_user_roadmap():
    """
    Retrieve user's saved career roadmap.
    Uses JWT to identify the user and returns their personalized roadmap.
    
    Headers Required:
        Authorization: Bearer <access_token>
    
    Response:
        - 200: Returns the saved roadmap with all details
        - 404: Roadmap not generated yet for this user
        - 401: Unauthorized (invalid or missing token)
    
    Example Response (200):
    {
        "roadmap": {
            "id": 1,
            "user_id": 5,
            "assessment_id": 3,
            "title": "Full Stack Web Developer Roadmap",
            "description": "A comprehensive 6-month roadmap...",
            "roadmap": {
                "phases": [
                    {
                        "phase": 1,
                        "title": "Foundation",
                        "duration": "4 weeks",
                        "skills": ["HTML", "CSS", "JavaScript basics"],
                        "resources": [...],
                        "milestones": [...]
                    },
                    ...
                ]
            },
            "total_duration_months": 6,
            "difficulty_level": "intermediate",
            "created_at": "2024-11-28T10:30:00",
            "updated_at": "2024-11-28T10:30:00"
        }
    }
    """
    try:
        user = get_current_user_or_404()
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Query roadmap for current user
        roadmap = CareerRoadmap.query.filter_by(user_id=user.id).first()
        
        if not roadmap:
            return jsonify({'error': 'No roadmap generated yet. Please complete your assessment first.'}), 404
        
        return jsonify({
            'roadmap': roadmap.to_dict()
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@roadmap_bp.route('', methods=['POST'])
@jwt_required()
def generate_user_roadmap():
    """
    Generate a new personalized career roadmap for the user.
    Uses JWT to identify the user and their assessment data.
    
    Prerequisites:
        - User must have completed the onboarding assessment
        - Assessment must exist in database
    
    Headers Required:
        Authorization: Bearer <access_token>
    
    Response:
        - 200: Roadmap generated/updated successfully
        - 400: Assessment not completed yet
        - 401: Unauthorized (invalid or missing token)
        - 500: Failed to generate roadmap (API error)
    
    Example Request:
        POST /api/roadmap
        Headers: Authorization: Bearer <token>
    
    Example Response (200):
    {
        "message": "Roadmap generated successfully",
        "roadmap": {
            "id": 1,
            "user_id": 5,
            "assessment_id": 3,
            "title": "Full Stack Web Developer Roadmap",
            "description": "...",
            "roadmap": {...},
            "total_duration_months": 6,
            "difficulty_level": "intermediate",
            "created_at": "2024-11-28T10:30:00",
            "updated_at": "2024-11-28T10:30:00"
        }
    }
    """
    try:
        user = get_current_user_or_404()
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get user's assessment
        assessment = OnboardingAssessment.query.filter_by(user_id=user.id).first()
        
        if not assessment:
            return jsonify({'error': 'Please complete the onboarding assessment first'}), 400
        
        try:
            from utils.ai_service import generate_career_roadmap
        except ImportError:
            return jsonify({'error': 'AI service not configured'}), 500
        
        # Build profile for AI
        profile = {
            'assessment': assessment.to_dict(),
            'user': {
                'email': user.email,
                'full_name': user.full_name
            }
        }
        
        # Generate roadmap using AI
        roadmap_data = generate_career_roadmap(profile)
        
        if not roadmap_data:
            return jsonify({'error': 'Failed to generate roadmap'}), 500
        
        # Check if roadmap already exists for user
        roadmap = CareerRoadmap.query.filter_by(user_id=user.id).first()
        
        if roadmap:
            # Update existing roadmap
            roadmap.assessment_id = assessment.id
            roadmap.title = roadmap_data.get('title')
            roadmap.description = roadmap_data.get('description')
            roadmap.roadmap_json = roadmap_data.get('roadmap')
            roadmap.total_duration_months = roadmap_data.get('total_duration_months')
            roadmap.difficulty_level = roadmap_data.get('difficulty_level')
            roadmap.updated_at = datetime.utcnow()
        else:
            # Create new roadmap
            roadmap = CareerRoadmap(
                user_id=user.id,
                assessment_id=assessment.id,
                title=roadmap_data.get('title'),
                description=roadmap_data.get('description'),
                roadmap_json=roadmap_data.get('roadmap'),
                total_duration_months=roadmap_data.get('total_duration_months'),
                difficulty_level=roadmap_data.get('difficulty_level')
            )
        
        db.session.add(roadmap)
        db.session.commit()
        
        return jsonify({
            'message': 'Roadmap generated successfully',
            'roadmap': roadmap.to_dict()
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@roadmap_bp.route('/status', methods=['GET'])
@jwt_required()
def get_roadmap_status():
    """
    Check if user has a saved roadmap and get basic info.
    Uses JWT to identify the user.
    
    Headers Required:
        Authorization: Bearer <access_token>
    
    Response:
        - 200: Returns status information
        - 401: Unauthorized (invalid or missing token)
    
    Example Response (200 - Has Roadmap):
    {
        "has_roadmap": true,
        "roadmap_id": 1,
        "title": "Full Stack Web Developer Roadmap",
        "created_at": "2024-11-28T10:30:00",
        "last_updated": "2024-11-28T10:30:00",
        "total_duration_months": 6
    }
    
    Example Response (200 - No Roadmap):
    {
        "has_roadmap": false,
        "message": "No roadmap generated yet. Complete your assessment to get started."
    }
    """
    try:
        user = get_current_user_or_404()
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        roadmap = CareerRoadmap.query.filter_by(user_id=user.id).first()
        
        if roadmap:
            return jsonify({
                'has_roadmap': True,
                'roadmap_id': roadmap.id,
                'title': roadmap.title,
                'created_at': roadmap.created_at.isoformat(),
                'last_updated': roadmap.updated_at.isoformat(),
                'total_duration_months': roadmap.total_duration_months
            }), 200
        else:
            return jsonify({
                'has_roadmap': False,
                'message': 'No roadmap generated yet. Complete your assessment to get started.'
            }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@roadmap_bp.route('/generate', methods=['POST'])
@jwt_required()
def generate_roadmap():
    """
    Generate a career roadmap based on user profile and target job title.
    
    Request body:
    {
        "targetJobTitle": "Backend Developer"
    }
    
    Returns:
        JSON: Generated career roadmap
    """
    try:
        user_id = get_jwt_identity()
        user = User.query.get(int(user_id))
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        target_job_title = data.get('targetJobTitle')
        
        if not target_job_title:
            return jsonify({'error': 'Target job title is required'}), 400
        
        # Get user's onboarding assessment
        assessment = OnboardingAssessment.query.filter_by(user_id=user.id).first()
        
        # Build user profile JSON from assessment or user model
        user_profile_json = {
            "email": user.email,
            "full_name": getattr(user, 'full_name', ''),
            "current_skills": getattr(user, 'skills', '').split(',') if getattr(user, 'skills', '') else [],
            "level": getattr(user, 'level', 'beginner'),
            "experience_years": getattr(user, 'experience_years', 0)
        }
        
        # Add assessment data if available
        if assessment:
            user_profile_json.update({
                "skill_level": assessment.skill_level,
                "career_path": assessment.career_path,
                "learning_style": assessment.learning_style,
                "target_timeframe": assessment.target_timeframe,
                "main_goal": assessment.main_goal
            })
        
        # Generate roadmap using the service
        roadmap = generate_market_aware_roadmap(user_profile_json, target_job_title)
        
        return jsonify({'roadmap': roadmap}), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500