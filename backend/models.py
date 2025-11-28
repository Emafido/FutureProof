from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    """User model for authentication"""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    full_name = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(50), nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    biodata = db.relationship('BioData', uselist=False, backref='user', cascade='all, delete-orphan')
    interests = db.relationship('Interest', backref='user', cascade='all, delete-orphan')
    education = db.relationship('Education', backref='user', cascade='all, delete-orphan')
    experience = db.relationship('Experience', backref='user', cascade='all, delete-orphan')
    certification = db.relationship('Certification', backref='user', cascade='all, delete-orphan')
    onboarding_assessment = db.relationship('OnboardingAssessment', uselist=False, backref='user', cascade='all, delete-orphan')
    
    def set_password(self, password):
        """Hash and set password"""
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        """Verify password"""
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        """Convert user to dictionary"""
        return {
            'id': self.id,
            'full_name': self.full_name,
            'role': self.role,
            'email': self.email,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class BioData(db.Model):
    """User biodata - Step 1 of onboarding"""
    __tablename__ = 'biodatas'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, unique=True)
    phone = db.Column(db.String(20))
    date_of_birth = db.Column(db.Date)
    country = db.Column(db.String(100))
    city = db.Column(db.String(100))
    bio = db.Column(db.Text)
    profile_image = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'phone': self.phone,
            'date_of_birth': self.date_of_birth.isoformat() if self.date_of_birth else None,
            'country': self.country,
            'city': self.city,
            'bio': self.bio,
            'profile_image': self.profile_image,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class Interest(db.Model):
    """User interests and skills - Step 2 of onboarding"""
    __tablename__ = 'interests'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    category = db.Column(db.String(50), nullable=False)  # 'interest', 'skill', 'career_preference'
    value = db.Column(db.String(200), nullable=False)
    proficiency_level = db.Column(db.String(50))  # 'beginner', 'intermediate', 'advanced', 'expert'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    db.UniqueConstraint('user_id', 'category', 'value', name='uix_user_interest_value')
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'category': self.category,
            'value': self.value,
            'proficiency_level': self.proficiency_level,
            'created_at': self.created_at.isoformat()
        }

class Education(db.Model):
    """User education history - Step 3 of onboarding"""
    __tablename__ = 'education'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    institution = db.Column(db.String(200), nullable=False)
    degree = db.Column(db.String(100), nullable=False)
    field_of_study = db.Column(db.String(100))
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date)
    is_current = db.Column(db.Boolean, default=False)
    grade = db.Column(db.String(10))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'institution': self.institution,
            'degree': self.degree,
            'field_of_study': self.field_of_study,
            'start_date': self.start_date.isoformat(),
            'end_date': self.end_date.isoformat() if self.end_date else None,
            'is_current': self.is_current,
            'grade': self.grade,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class Experience(db.Model):
    """User work experience - Step 3 of onboarding"""
    __tablename__ = 'experiences'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    company = db.Column(db.String(200), nullable=False)
    position = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date)
    is_current = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'company': self.company,
            'position': self.position,
            'description': self.description,
            'start_date': self.start_date.isoformat(),
            'end_date': self.end_date.isoformat() if self.end_date else None,
            'is_current': self.is_current,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class Certification(db.Model):
    """User certifications - Step 3 of onboarding"""
    __tablename__ = 'certifications'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.String(200), nullable=False)
    issuer = db.Column(db.String(200), nullable=False)
    issue_date = db.Column(db.Date, nullable=False)
    expiration_date = db.Column(db.Date)
    credential_id = db.Column(db.String(200))
    credential_url = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'name': self.name,
            'issuer': self.issuer,
            'issue_date': self.issue_date.isoformat(),
            'expiration_date': self.expiration_date.isoformat() if self.expiration_date else None,
            'credential_id': self.credential_id,
            'credential_url': self.credential_url,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class OnboardingAssessment(db.Model):
    """User onboarding assessment questionnaire responses"""
    __tablename__ = 'onboarding_assessments'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, unique=True)
    
    # Main questions
    main_goal = db.Column(db.String(50), nullable=False)  # switch-career, first-job, build-skills, explore
    age = db.Column(db.String(20), nullable=False)  # 15-17, 18-22, 23-26, 27-30, 31+
    current_situation = db.Column(db.String(50), nullable=False)  # secondary, university, working-non-related, unemployed
    biggest_challenge = db.Column(db.String(50), nullable=False)  # no-experience, no-guidance, limited-time, dont-know
    learning_pace = db.Column(db.String(20), nullable=False)  # 2-4, 5-10, 11-20, 20+
    
    # File upload
    cv_filename = db.Column(db.String(255))
    cv_file_size = db.Column(db.Integer)
    cv_file_type = db.Column(db.String(100))
    
    # Skills and career
    skill_level = db.Column(db.Integer, nullable=False)  # 1-5 scale
    career_path = db.Column(db.String(100), nullable=False)  # web-dev, data-analysis, other-input, explore
    other_career_path = db.Column(db.String(255))  # if career_path is other-input
    
    # Timeline and learning
    target_timeframe = db.Column(db.String(50), nullable=False)  # 3-months, 6-months, 12-months, explore
    learning_style = db.Column(db.String(50), nullable=False)  # visual, reading, kinesthetic, social
    
    # Experience
    previous_courses = db.Column(db.String(50))  # no, incomplete, building
    certifications = db.Column(db.Text)  # comma-separated or full text
    
    # Understanding and motivation
    understanding = db.Column(db.String(50))  # yes, maybe, curious, no
    motivation = db.Column(db.Text)
    hear_about = db.Column(db.String(50), nullable=False)  # social, friend, youtube, community, other
    
    # AI-generated recommendations
    recommended_job_titles = db.Column(db.Text)  # Comma-separated or newline-separated job titles
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'main_goal': self.main_goal,
            'age': self.age,
            'current_situation': self.current_situation,
            'biggest_challenge': self.biggest_challenge,
            'learning_pace': self.learning_pace,
            'cv_filename': self.cv_filename,
            'cv_file_size': self.cv_file_size,
            'cv_file_type': self.cv_file_type,
            'skill_level': self.skill_level,
            'career_path': self.career_path,
            'other_career_path': self.other_career_path,
            'target_timeframe': self.target_timeframe,
            'learning_style': self.learning_style,
            'previous_courses': self.previous_courses,
            'certifications': self.certifications,
            'understanding': self.understanding,
            'motivation': self.motivation,
            'hear_about': self.hear_about,
            'recommended_job_titles': self.recommended_job_titles,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
