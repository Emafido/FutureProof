# API Testing Guide

This document provides comprehensive instructions for testing all endpoints in the FutureProof backend API.

## Table of Contents

1. [Setup & Prerequisites](#setup--prerequisites)
2. [Base URL](#base-url)
3. [Authentication](#authentication)
4. [Testing Methods](#testing-methods)
5. [Auth Endpoints](#auth-endpoints)
6. [Onboarding Endpoints](#onboarding-endpoints)
7. [Health Check](#health-check)
8. [Common Issues & Troubleshooting](#common-issues--troubleshooting)

---

## Setup & Prerequisites

### Required Tools
- **cURL** (command-line tool, pre-installed on most systems)
- **Postman** (GUI alternative)
- **Thunder Client** (VS Code extension)
- **Python requests library** (for script-based testing)
- **API client of choice** (Insomnia, Hoppscotch, etc.)

### Installation (if needed)
```bash
# Install cURL (usually pre-installed)
# macOS
brew install curl

# Ubuntu/Debian
sudo apt-get install curl

# Install Python requests (for Python-based tests)
pip install requests
```

---

## Base URL

```
http://localhost:5000/api
```

When running locally, all endpoints are accessible at `http://localhost:5000/api/{endpoint}`.

---

## Authentication

Most endpoints (except signup/login) require JWT authentication.

### Token Storage
After successful signup or login, you'll receive:
- `access_token`: Used for protected endpoints
- `refresh_token`: Used to get a new access token

### Using the Access Token
Include the token in the `Authorization` header:
```
Authorization: Bearer <access_token>
```

---

## Testing Methods

### Method 1: cURL (Command Line)

Basic syntax:
```bash
curl -X METHOD \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"key": "value"}' \
  http://localhost:5000/api/endpoint
```

### Method 2: Postman

1. Open Postman
2. Create a new request
3. Select HTTP method (GET, POST, etc.)
4. Enter the full URL
5. Go to "Headers" tab and add:
   - Key: `Authorization`
   - Value: `Bearer <your_access_token>`
6. Go to "Body" tab, select "raw" and "JSON"
7. Enter your JSON data
8. Click "Send"

### Method 3: Python Script

```python
import requests
import json

# Base URL
BASE_URL = "http://localhost:5000/api"

# Headers with authorization
def get_headers(token=None):
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    return headers

# Example: Signup
response = requests.post(
    f"{BASE_URL}/auth/signup",
    json={"email": "user@example.com", "password": "Password123"},
    headers=get_headers()
)
print(response.json())
```

### Method 4: Thunder Client (VS Code Extension)

1. Install Thunder Client extension
2. Click Thunder Client icon in VS Code
3. Create a new request
4. Select method and enter URL
5. Add headers and body as needed
6. Click "Send"

---

## Auth Endpoints

### 1. User Signup

**Endpoint:** `POST /auth/signup`

**Description:** Create a new user account with optional onboarding assessment questionnaire

**Request Body (Auth Only):**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Request Body (With Assessment - Option 1):**
```json
{
  "email": "alex@example.com",
  "password": "SecurePass123",
  "mainGoal": "switch-career",
  "age": "27-30",
  "currentSituation": "working-non-related",
  "biggestChallenge": "no-experience",
  "learningPace": "5-10",
  "cvFile": {
    "name": "Alex_Jones_Resume.pdf",
    "size": 524288,
    "type": "application/pdf"
  },
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
```

**Request Body (With Assessment - Option 2):**
```json
{
  "email": "student@example.com",
  "password": "SecurePass123",
  "mainGoal": "first-job",
  "age": "18-22",
  "currentSituation": "university",
  "biggestChallenge": "limited-time",
  "learningPace": "2-4",
  "cvFile": null,
  "skillLevel": 2,
  "careerPath": "other-input",
  "otherCareerPath": "E-commerce Logistics Management",
  "targetTimeframe": "12-months",
  "learningStyle": "reading",
  "previousCourses": "no",
  "certifications": "",
  "understanding": "maybe",
  "motivation": "Need a job before I graduate next year.",
  "hearAbout": "friend"
}
```

**Requirements:**
- Email must be valid format
- Password must be at least 8 characters
- Email must be unique
- Assessment fields (if provided) must all be present

**Assessment Field Descriptions:**
- `mainGoal`: `switch-career`, `first-job`, `build-skills`, `explore`
- `age`: `15-17`, `18-22`, `23-26`, `27-30`, `31+`
- `currentSituation`: `secondary`, `university`, `working-non-related`, `unemployed`
- `biggestChallenge`: `no-experience`, `no-guidance`, `limited-time`, `dont-know`
- `learningPace`: `2-4`, `5-10`, `11-20`, `20+`
- `skillLevel`: Integer 1-5
- `careerPath`: `web-dev`, `data-analysis`, `mobile-dev`, `cloud-engineering`, `other-input`, `explore`
- `targetTimeframe`: `3-months`, `6-months`, `12-months`, `explore`
- `learningStyle`: `visual`, `reading`, `kinesthetic`, `social`
- `previousCourses`: `no`, `incomplete`, `building`
- `understanding`: `yes`, `maybe`, `curious`, `no`
- `hearAbout`: `social`, `friend`, `youtube`, `community`, `other`

**cURL Example (Auth Only):**
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com", "password": "SecurePass123"}' \
  http://localhost:5000/api/auth/signup
```

**cURL Example (With Assessment):**
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alex@example.com",
    "password": "SecurePass123",
    "mainGoal": "switch-career",
    "age": "27-30",
    "currentSituation": "working-non-related",
    "biggestChallenge": "no-experience",
    "learningPace": "5-10",
    "cvFile": {
      "name": "Resume.pdf",
      "size": 524288,
      "type": "application/pdf"
    },
    "skillLevel": 4,
    "careerPath": "web-dev",
    "otherCareerPath": "",
    "targetTimeframe": "6-months",
    "learningStyle": "visual",
    "previousCourses": "building",
    "certifications": "CS50, Coursera",
    "understanding": "yes",
    "motivation": "Career advancement",
    "hearAbout": "social"
  }' \
  http://localhost:5000/api/auth/signup
```

**Expected Response (201 - Auth Only):**
```json
{
  "message": "User created successfully",
  "user": {
    "id": 1,
    "email": "john@example.com",
    "created_at": "2024-11-28T10:30:00"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Expected Response (201 - With Assessment):**
```json
{
  "message": "User created successfully",
  "user": {
    "id": 1,
    "email": "alex@example.com",
    "created_at": "2024-11-28T10:30:00"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "assessment": {
    "id": 1,
    "user_id": 1,
    "main_goal": "switch-career",
    "age": "27-30",
    "current_situation": "working-non-related",
    "biggest_challenge": "no-experience",
    "learning_pace": "5-10",
    "cv_filename": "Alex_Jones_Resume.pdf",
    "cv_file_size": 524288,
    "cv_file_type": "application/pdf",
    "skill_level": 4,
    "career_path": "web-dev",
    "other_career_path": "",
    "target_timeframe": "6-months",
    "learning_style": "visual",
    "previous_courses": "building",
    "certifications": "CS50, Coursera Web Development Bootcamp",
    "understanding": "yes",
    "motivation": "I want to earn more income to support my parents.",
    "hear_about": "social",
    "created_at": "2024-11-28T10:30:00"
  }
}
```

**Common Errors:**
- 400: Invalid email format, password too short, or missing assessment fields
- 409: Email already registered

---

### 2. User Login

**Endpoint:** `POST /auth/login`

**Description:** Login to existing account

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**cURL Example:**
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com", "password": "SecurePass123"}' \
  http://localhost:5000/api/auth/login
```

**Expected Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "john@example.com"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Common Errors:**
- 401: Invalid email or password

---

### 3. Refresh Token

**Endpoint:** `POST /auth/refresh`

**Description:** Get a new access token using refresh token

**Headers Required:**
```
Authorization: Bearer <refresh_token>
```

**cURL Example:**
```bash
curl -X POST \
  -H "Authorization: Bearer <refresh_token>" \
  http://localhost:5000/api/auth/refresh
```

**Expected Response (200):**
```json
{
  "access_token": "new_token_value..."
}
```

---

### 4. Get Current User

**Endpoint:** `GET /auth/me`

**Description:** Get logged-in user information

**Headers Required:**
```
Authorization: Bearer <access_token>
```

**cURL Example:**
```bash
curl -X GET \
  -H "Authorization: Bearer <access_token>" \
  http://localhost:5000/api/auth/me
```

**Expected Response (200):**
```json
{
  "user": {
    "id": 1,
    "email": "john@example.com",
    "created_at": "2024-11-28T10:30:00"
  }
}
```

---

## Onboarding Endpoints

All onboarding endpoints require authentication header: `Authorization: Bearer <access_token>`

---

### Submit/Update Assessment Questionnaire

**Endpoint:** `POST /onboarding/assessment`

**Description:** Submit or update user's onboarding assessment questionnaire. This is the primary onboarding endpoint.

**Request Body (Example 1 - Switch Career):**
```json
{
  "mainGoal": "switch-career",
  "age": "27-30",
  "currentSituation": "working-non-related",
  "biggestChallenge": "no-experience",
  "learningPace": "5-10",
  "cvFile": {
    "name": "Alex_Jones_Resume.pdf",
    "size": 524288,
    "type": "application/pdf"
  },
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
```

**Request Body (Example 2 - First Job):**
```json
{
  "mainGoal": "first-job",
  "age": "18-22",
  "currentSituation": "university",
  "biggestChallenge": "limited-time",
  "learningPace": "2-4",
  "cvFile": null,
  "skillLevel": 2,
  "careerPath": "other-input",
  "otherCareerPath": "E-commerce Logistics Management",
  "targetTimeframe": "12-months",
  "learningStyle": "reading",
  "previousCourses": "no",
  "certifications": "",
  "understanding": "maybe",
  "motivation": "Need a job before I graduate next year.",
  "hearAbout": "friend"
}
```

**Request Body (Example 3 - Explore):**
```json
{
  "mainGoal": "explore",
  "age": "31+",
  "currentSituation": "unemployed",
  "biggestChallenge": "dont-know",
  "learningPace": "20+",
  "cvFile": {
    "name": "Mary_CV.docx",
    "size": 25000,
    "type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  },
  "skillLevel": 1,
  "careerPath": "explore",
  "otherCareerPath": "",
  "targetTimeframe": "explore",
  "learningStyle": "social",
  "previousCourses": "incomplete",
  "certifications": "Salesforce Admin Fundamentals, introductory Python course",
  "understanding": "curious",
  "motivation": "I'm looking for a complete career overhaul.",
  "hearAbout": "youtube"
}
```

**Request Body (Example 4 - Build Skills):**
```json
{
  "mainGoal": "build-skills",
  "age": "15-17",
  "currentSituation": "secondary",
  "biggestChallenge": "no-guidance",
  "learningPace": "11-20",
  "cvFile": null,
  "skillLevel": 3,
  "careerPath": "data-analysis",
  "otherCareerPath": "",
  "targetTimeframe": "3-months",
  "learningStyle": "kinesthetic",
  "previousCourses": "no",
  "certifications": "",
  "understanding": "yes",
  "motivation": "",
  "hearAbout": "community"
}
```

**Required Fields:**
- `mainGoal`: `switch-career`, `first-job`, `build-skills`, `explore`
- `age`: `15-17`, `18-22`, `23-26`, `27-30`, `31+`
- `currentSituation`: `secondary`, `university`, `working-non-related`, `unemployed`
- `biggestChallenge`: `no-experience`, `no-guidance`, `limited-time`, `dont-know`
- `learningPace`: `2-4`, `5-10`, `11-20`, `20+`
- `skillLevel`: Integer 1-5
- `careerPath`: `web-dev`, `data-analysis`, `mobile-dev`, `cloud-engineering`, `other-input`, `explore`
- `targetTimeframe`: `3-months`, `6-months`, `12-months`, `explore`
- `learningStyle`: `visual`, `reading`, `kinesthetic`, `social`
- `understanding`: `yes`, `maybe`, `curious`, `no`
- `hearAbout`: `social`, `friend`, `youtube`, `community`, `other`

**Optional Fields:**
- `cvFile`: File metadata object with name, size, type (null if not provided)
- `otherCareerPath`: Custom career path if careerPath is `other-input`
- `previousCourses`: `no`, `incomplete`, `building`
- `motivation`: User's motivation text
- `certifications`: Existing certifications

**cURL Example:**
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{
    "mainGoal": "switch-career",
    "age": "27-30",
    "currentSituation": "working-non-related",
    "biggestChallenge": "no-experience",
    "learningPace": "5-10",
    "cvFile": {
      "name": "Resume.pdf",
      "size": 524288,
      "type": "application/pdf"
    },
    "skillLevel": 4,
    "careerPath": "web-dev",
    "otherCareerPath": "",
    "targetTimeframe": "6-months",
    "learningStyle": "visual",
    "previousCourses": "building",
    "certifications": "CS50, Coursera",
    "understanding": "yes",
    "motivation": "Career advancement",
    "hearAbout": "social"
  }' \
  http://localhost:5000/api/onboarding/assessment
```

**Expected Response (201 for new, 200 for update):**
```json
{
  "message": "Assessment submitted successfully",
  "assessment": {
    "id": 1,
    "user_id": 1,
    "main_goal": "switch-career",
    "age": "27-30",
    "current_situation": "working-non-related",
    "biggest_challenge": "no-experience",
    "learning_pace": "5-10",
    "cv_filename": "Alex_Jones_Resume.pdf",
    "cv_file_size": 524288,
    "cv_file_type": "application/pdf",
    "skill_level": 4,
    "career_path": "web-dev",
    "other_career_path": "",
    "target_timeframe": "6-months",
    "learning_style": "visual",
    "previous_courses": "building",
    "certifications": "CS50, Coursera Web Development Bootcamp",
    "understanding": "yes",
    "motivation": "I want to earn more income to support my parents.",
    "hear_about": "social",
    "recommended_job_titles": null,
    "created_at": "2024-11-28T10:30:00",
    "updated_at": "2024-11-28T10:30:00"
  }
}
```

---

### Get Assessment

**Endpoint:** `GET /onboarding/assessment`

**Description:** Retrieve user's assessment data

**cURL Example:**
```bash
curl -X GET \
  -H "Authorization: Bearer <access_token>" \
  http://localhost:5000/api/onboarding/assessment
```

**Expected Response (200):**
```json
{
  "assessment": {
    "id": 1,
    "user_id": 1,
    "main_goal": "switch-career",
    "age": "27-30",
    "current_situation": "working-non-related",
    "biggest_challenge": "no-experience",
    "learning_pace": "5-10",
    "cv_filename": "Alex_Jones_Resume.pdf",
    "cv_file_size": 524288,
    "cv_file_type": "application/pdf",
    "skill_level": 4,
    "career_path": "web-dev",
    "other_career_path": "",
    "target_timeframe": "6-months",
    "learning_style": "visual",
    "previous_courses": "building",
    "certifications": "CS50, Coursera Web Development Bootcamp",
    "understanding": "yes",
    "motivation": "I want to earn more income to support my parents.",
    "hear_about": "social",
    "recommended_job_titles": null,
    "created_at": "2024-11-28T10:30:00",
    "updated_at": "2024-11-28T10:30:00"
  }
}
```

---

## AI-Generated Recommended Job Titles

### Generate Job Titles

**Endpoint:** `POST /onboarding/recommended-jobs`

**Description:** Generate 3 personalized job title recommendations using Google Gemini AI based on user's assessment profile

**Prerequisites:**
- User must have completed onboarding assessment via `POST /onboarding/assessment`
- Google Gemini API key must be set in `.env` file (`GEMINI_API_KEY`)

**Headers Required:**
```
Authorization: Bearer <access_token>
```

**cURL Example:**
```bash
curl -X POST \
  -H "Authorization: Bearer <access_token>" \
  http://localhost:5000/api/onboarding/recommended-jobs
```

**Expected Response (200):**
```json
{
  "message": "Job titles generated successfully",
  "recommended_job_titles": "Full Stack Web Developer\nFrontend Engineer\nUI/UX Developer"
}
```

**Error Responses:**
- `400`: Assessment not completed yet
- `500`: Failed to generate job titles (API error)

---

### Get Previously Generated Job Titles

**Endpoint:** `GET /onboarding/recommended-jobs`

**Description:** Retrieve previously generated job title recommendations

**Headers Required:**
```
Authorization: Bearer <access_token>
```

**cURL Example:**
```bash
curl -X GET \
  -H "Authorization: Bearer <access_token>" \
  http://localhost:5000/api/onboarding/recommended-jobs
```

**Expected Response (200):**
```json
{
  "recommended_job_titles": "Full Stack Web Developer\nFrontend Engineer\nUI/UX Developer"
}
```

**Error Responses:**
- `404`: Assessment not found or no job titles generated yet

---

## Health Check

### Health Status Endpoint

**Endpoint:** `GET /api/health`

**Description:** Check if the API is running

**cURL Example:**
```bash
curl http://localhost:5000/api/health
```

**Expected Response (200):**
```json
{
  "status": "healthy"
}
```

---

## Complete Testing Workflow Example

Here's a complete workflow testing the entire onboarding process:

### Step 1: Signup
```bash
# Save the response and extract the access_token
TOKEN=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -d '{"email": "newuser@example.com", "password": "TestPass123"}' \
  http://localhost:5000/api/auth/signup | jq -r '.access_token')

echo "Access Token: $TOKEN"
```

### Step 2: Add Biodata
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "first_name": "Jane",
    "last_name": "Smith",
    "date_of_birth": "1995-05-20",
    "country": "Canada",
    "city": "Toronto"
  }' \
  http://localhost:5000/api/onboarding/biodata
```

### Step 3: Add Skills
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "category": "skill",
    "value": "JavaScript",
    "proficiency_level": "advanced"
  }' \
  http://localhost:5000/api/onboarding/interests

curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "category": "skill",
    "value": "React",
    "proficiency_level": "intermediate"
  }' \
  http://localhost:5000/api/onboarding/interests
```

### Step 4: Add Education
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "institution": "University of Toronto",
    "degree": "Bachelor",
    "field_of_study": "Computer Science",
    "start_date": "2019-09-01",
    "end_date": "2023-05-31",
    "is_current": false,
    "grade": "3.7"
  }' \
  http://localhost:5000/api/onboarding/education
```

### Step 5: Get Complete Profile
```bash
curl -X GET \
  -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/onboarding/profile
```

---

## Common Issues & Troubleshooting

### Issue 1: Invalid/Expired Token

**Error:**
```json
{
  "error": "Unauthorized"
}
```

**Solution:**
1. Generate a new token via `/auth/login` or `/auth/signup`
2. Use `/auth/refresh` with your refresh token
3. Make sure token is in correct format: `Authorization: Bearer <token>`

### Issue 2: Missing Required Fields

**Error:**
```json
{
  "error": "email is required"
}
```

**Solution:**
- Check the request body has all required fields
- Refer to endpoint documentation for required vs optional fields

### Issue 3: Invalid Date Format

**Error:**
```json
{
  "error": "Invalid date format: ..."
}
```

**Solution:**
- All dates must be in `YYYY-MM-DD` format
- Example: `2024-11-28` for November 28, 2024

### Issue 4: Email Already Registered

**Error:**
```json
{
  "error": "User with this email already exists"
}
```

**Solution:**
- Use a different email for signup
- Or login with existing credentials

### Issue 5: Invalid Email Format

**Error:**
```json
{
  "error": "Invalid email format"
}
```

**Solution:**
- Ensure email is valid (e.g., `user@example.com`)
- Must contain @ symbol and domain

### Issue 6: Password Too Short

**Error:**
```json
{
  "error": "Password must be at least 8 characters long"
}
```

**Solution:**
- Use a password with at least 8 characters

### Issue 7: Invalid Category

**Error:**
```json
{
  "error": "category must be one of: interest, skill, career_preference"
}
```

**Solution:**
- Only use these three categories for interests
- Check spelling (lowercase)

### Issue 8: Resource Not Found

**Error:**
```json
{
  "error": "Education record not found"
}
```

**Solution:**
- Verify the ID exists
- Make sure you're using the correct ID from the response
- Confirm the resource belongs to the current user

### Issue 9: CORS Error

**Error:**
```
Access to XMLHttpRequest at 'http://localhost:5000/api/...' from origin 'http://localhost:3000' 
has been blocked by CORS policy
```

**Solution:**
- CORS is already enabled in the Flask app
- If using frontend, ensure backend is running
- Check that frontend is accessing correct base URL

---

## Tips for Efficient Testing

1. **Use environment variables in Postman/Thunder Client** to store tokens and avoid retyping
2. **Create test collections** for repeated testing workflows
3. **Use the Profile endpoint** to verify all data was saved correctly
4. **Test error cases** with invalid data to understand error messages
5. **Keep track of IDs** when testing update/delete operations
6. **Use pretty-print JSON** for better readability of responses
7. **Test in order** (signup → biodata → interests → education, etc.)

---

## Additional Resources

- Flask Documentation: https://flask.palletsprojects.com/
- Flask-JWT-Extended: https://flask-jwt-extended.readthedocs.io/
- cURL Tutorial: https://curl.se/docs/manpage.html
- Postman Learning Center: https://learning.postman.com/
- HTTP Status Codes: https://httpwg.org/specs/rfc7231.html#status.codes

