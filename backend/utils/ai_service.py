import os
import google.generativeai as genai
import logging

logger = logging.getLogger(__name__)

# Configure Gemini API
api_key = 'AIzaSyB-llsqX-bk-uskIRd786AfCeY7WGbJheE'
if api_key:
    genai.configure(api_key=api_key)

def generate_job_titles(user_profile):
    """
    Generate 3 recommended job titles based on user profile using Google Gemini.
    
    Args:
        user_profile (dict): User profile data including assessment
    
    Returns:
        str: Three job titles separated by newlines
        None: If generation fails
    """
    try:
        # Build a comprehensive profile string
        profile_text = build_profile_text(user_profile)
        
        # Create prompt
        prompt = f"""Based on the following user profile, suggest exactly 3 job titles that would be suitable for this person.

User Profile:
{profile_text}

Return ONLY the 3 job titles, one per line. No numbering, no explanations, just the job titles."""
        
        # Initialize Gemini model
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        # Generate response
        response = model.generate_content(prompt)
        
        if response and response.text:
            job_titles = response.text.strip()
            logger.info(f"Generated job titles for user")
            return job_titles
        else:
            logger.error("Empty response from Gemini API")
            return None
    
    except Exception as e:
        logger.error(f"Error generating job titles with Gemini: {str(e)}")
        return None

def build_profile_text(user_profile):
    """
    Build a comprehensive text profile from user data.
    
    Args:
        user_profile (dict): Dictionary containing assessment and user data
    
    Returns:
        str: Formatted profile text
    """
    profile_lines = []
    
    # Assessment data
    assessment = user_profile.get('assessment', {})
    if assessment:
        profile_lines.append(f"Main Goal: {assessment.get('main_goal', 'N/A')}")
        profile_lines.append(f"Age: {assessment.get('age', 'N/A')}")
        profile_lines.append(f"Current Situation: {assessment.get('current_situation', 'N/A')}")
        profile_lines.append(f"Biggest Challenge: {assessment.get('biggest_challenge', 'N/A')}")
        profile_lines.append(f"Skill Level: {assessment.get('skill_level', 'N/A')}/5")
        profile_lines.append(f"Desired Career Path: {assessment.get('career_path', 'N/A')}")
        
        if assessment.get('other_career_path'):
            profile_lines.append(f"Custom Career Path: {assessment.get('other_career_path')}")
        
        profile_lines.append(f"Target Timeframe: {assessment.get('target_timeframe', 'N/A')}")
        profile_lines.append(f"Learning Style: {assessment.get('learning_style', 'N/A')}")
        profile_lines.append(f"Previous Courses: {assessment.get('previous_courses', 'N/A')}")
        profile_lines.append(f"Learning Pace: {assessment.get('learning_pace', 'N/A')} hours/week")
        
        if assessment.get('certifications'):
            profile_lines.append(f"Certifications: {assessment.get('certifications')}")
        
        if assessment.get('motivation'):
            profile_lines.append(f"Motivation: {assessment.get('motivation')}")
    
    # User data
    user = user_profile.get('user', {})
    if user:
        profile_lines.append(f"\nEmail: {user.get('email', 'N/A')}")
    
    return '\n'.join(profile_lines)
