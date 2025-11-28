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

**Description:** Create a new user account

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Requirements:**
- Email must be valid format
- Password must be at least 8 characters
- Email must be unique

**cURL Example:**
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com", "password": "SecurePass123"}' \
  http://localhost:5000/api/auth/signup
```

**Expected Response (201):**
```json
{
  "message": "User created successfully",
  "user": {
    "id": 1,
    "email": "john@example.com",
    "created_at": "2024-11-28T10:30:00"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Common Errors:**
- 400: Invalid email format or password too short
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

### Prerequisites for Onboarding Tests
1. Complete signup/login to get an access token
2. All onboarding endpoints require the `Authorization: Bearer <access_token>` header

---

### 1. Create/Update Biodata (Step 1)

**Endpoint:** `POST /onboarding/biodata`

**Description:** Create or update user's basic information

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+1234567890",
  "date_of_birth": "1990-01-15",
  "country": "United States",
  "city": "New York",
  "bio": "Software developer passionate about AI",
  "profile_image": "https://example.com/image.jpg"
}
```

**Required Fields:**
- `first_name`
- `last_name`

**Optional Fields:**
- `phone`
- `date_of_birth` (format: YYYY-MM-DD)
- `country`
- `city`
- `bio`
- `profile_image`

**cURL Example:**
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "phone": "+1234567890",
    "date_of_birth": "1990-01-15",
    "country": "United States",
    "city": "New York",
    "bio": "Software developer",
    "profile_image": "https://example.com/image.jpg"
  }' \
  http://localhost:5000/api/onboarding/biodata
```

**Expected Response (201 for new, 200 for update):**
```json
{
  "message": "Biodata saved successfully",
  "biodata": {
    "id": 1,
    "user_id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "phone": "+1234567890",
    "date_of_birth": "1990-01-15",
    "country": "United States",
    "city": "New York",
    "bio": "Software developer",
    "profile_image": "https://example.com/image.jpg",
    "created_at": "2024-11-28T10:30:00"
  }
}
```

---

### 2. Get Biodata

**Endpoint:** `GET /onboarding/biodata`

**Description:** Retrieve user's biodata

**cURL Example:**
```bash
curl -X GET \
  -H "Authorization: Bearer <access_token>" \
  http://localhost:5000/api/onboarding/biodata
```

**Expected Response (200):**
```json
{
  "biodata": {
    "id": 1,
    "user_id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "phone": "+1234567890",
    "date_of_birth": "1990-01-15",
    "country": "United States",
    "city": "New York",
    "bio": "Software developer",
    "profile_image": "https://example.com/image.jpg",
    "created_at": "2024-11-28T10:30:00"
  }
}
```

---

### 3. Add Interest/Skill/Career Preference (Step 2)

**Endpoint:** `POST /onboarding/interests`

**Description:** Add interests, skills, or career preferences

**Request Body:**
```json
{
  "category": "skill",
  "value": "Python",
  "proficiency_level": "advanced"
}
```

**Valid Categories:**
- `interest`
- `skill`
- `career_preference`

**cURL Example - Add Skill:**
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{
    "category": "skill",
    "value": "Python",
    "proficiency_level": "advanced"
  }' \
  http://localhost:5000/api/onboarding/interests
```

**cURL Example - Add Interest:**
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{
    "category": "interest",
    "value": "Machine Learning"
  }' \
  http://localhost:5000/api/onboarding/interests
```

**cURL Example - Add Career Preference:**
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{
    "category": "career_preference",
    "value": "Remote Work"
  }' \
  http://localhost:5000/api/onboarding/interests
```

**Expected Response (201):**
```json
{
  "message": "Interest/skill added successfully",
  "interest": {
    "id": 1,
    "user_id": 1,
    "category": "skill",
    "value": "Python",
    "proficiency_level": "advanced",
    "created_at": "2024-11-28T10:30:00"
  }
}
```

---

### 4. Get All Interests/Skills/Career Preferences

**Endpoint:** `GET /onboarding/interests`

**Description:** Retrieve all user interests, skills, and career preferences grouped by category

**cURL Example:**
```bash
curl -X GET \
  -H "Authorization: Bearer <access_token>" \
  http://localhost:5000/api/onboarding/interests
```

**Expected Response (200):**
```json
{
  "interests": [
    {
      "id": 1,
      "category": "interest",
      "value": "Machine Learning",
      "proficiency_level": null
    }
  ],
  "skills": [
    {
      "id": 2,
      "category": "skill",
      "value": "Python",
      "proficiency_level": "advanced"
    }
  ],
  "career_preferences": [
    {
      "id": 3,
      "category": "career_preference",
      "value": "Remote Work",
      "proficiency_level": null
    }
  ]
}
```

---

### 5. Delete Interest/Skill/Career Preference

**Endpoint:** `DELETE /onboarding/interests/<interest_id>`

**Description:** Delete a specific interest/skill/career preference

**cURL Example:**
```bash
curl -X DELETE \
  -H "Authorization: Bearer <access_token>" \
  http://localhost:5000/api/onboarding/interests/1
```

**Expected Response (200):**
```json
{
  "message": "Interest deleted successfully"
}
```

---

### 6. Add Education (Step 3)

**Endpoint:** `POST /onboarding/education`

**Description:** Add education record

**Request Body:**
```json
{
  "institution": "Harvard University",
  "degree": "Bachelor",
  "field_of_study": "Computer Science",
  "start_date": "2020-01-15",
  "end_date": "2024-05-30",
  "is_current": false,
  "grade": "3.8"
}
```

**Required Fields:**
- `institution`
- `degree`
- `start_date` (format: YYYY-MM-DD)

**Optional Fields:**
- `field_of_study`
- `end_date` (format: YYYY-MM-DD)
- `is_current` (boolean)
- `grade`

**cURL Example:**
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{
    "institution": "Harvard University",
    "degree": "Bachelor",
    "field_of_study": "Computer Science",
    "start_date": "2020-01-15",
    "end_date": "2024-05-30",
    "is_current": false,
    "grade": "3.8"
  }' \
  http://localhost:5000/api/onboarding/education
```

**Expected Response (201):**
```json
{
  "message": "Education record added successfully",
  "education": {
    "id": 1,
    "user_id": 1,
    "institution": "Harvard University",
    "degree": "Bachelor",
    "field_of_study": "Computer Science",
    "start_date": "2020-01-15",
    "end_date": "2024-05-30",
    "is_current": false,
    "grade": "3.8",
    "created_at": "2024-11-28T10:30:00"
  }
}
```

---

### 7. Get All Education Records

**Endpoint:** `GET /onboarding/education`

**cURL Example:**
```bash
curl -X GET \
  -H "Authorization: Bearer <access_token>" \
  http://localhost:5000/api/onboarding/education
```

**Expected Response (200):**
```json
{
  "education": [
    {
      "id": 1,
      "institution": "Harvard University",
      "degree": "Bachelor",
      "field_of_study": "Computer Science",
      "start_date": "2020-01-15",
      "end_date": "2024-05-30",
      "is_current": false,
      "grade": "3.8",
      "created_at": "2024-11-28T10:30:00"
    }
  ]
}
```

---

### 8. Update Education Record

**Endpoint:** `PUT /onboarding/education/<education_id>`

**Description:** Update a specific education record

**Request Body:** (same as POST, all fields optional)

**cURL Example:**
```bash
curl -X PUT \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{
    "grade": "3.9"
  }' \
  http://localhost:5000/api/onboarding/education/1
```

**Expected Response (200):**
```json
{
  "message": "Education record updated successfully",
  "education": {
    "id": 1,
    "institution": "Harvard University",
    "degree": "Bachelor",
    "field_of_study": "Computer Science",
    "start_date": "2020-01-15",
    "end_date": "2024-05-30",
    "is_current": false,
    "grade": "3.9",
    "created_at": "2024-11-28T10:30:00"
  }
}
```

---

### 9. Delete Education Record

**Endpoint:** `DELETE /onboarding/education/<education_id>`

**cURL Example:**
```bash
curl -X DELETE \
  -H "Authorization: Bearer <access_token>" \
  http://localhost:5000/api/onboarding/education/1
```

**Expected Response (200):**
```json
{
  "message": "Education record deleted successfully"
}
```

---

### 10. Add Work Experience

**Endpoint:** `POST /onboarding/experience`

**Description:** Add work experience record

**Request Body:**
```json
{
  "company": "Google",
  "position": "Software Engineer",
  "description": "Worked on backend microservices",
  "start_date": "2022-01-15",
  "end_date": "2024-01-30",
  "is_current": false
}
```

**Required Fields:**
- `company`
- `position`
- `start_date` (format: YYYY-MM-DD)

**Optional Fields:**
- `description`
- `end_date` (format: YYYY-MM-DD)
- `is_current` (boolean)

**cURL Example:**
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{
    "company": "Google",
    "position": "Software Engineer",
    "description": "Worked on backend microservices",
    "start_date": "2022-01-15",
    "end_date": "2024-01-30",
    "is_current": false
  }' \
  http://localhost:5000/api/onboarding/experience
```

**Expected Response (201):**
```json
{
  "message": "Experience added successfully",
  "experience": {
    "id": 1,
    "user_id": 1,
    "company": "Google",
    "position": "Software Engineer",
    "description": "Worked on backend microservices",
    "start_date": "2022-01-15",
    "end_date": "2024-01-30",
    "is_current": false,
    "created_at": "2024-11-28T10:30:00"
  }
}
```

---

### 11. Get All Work Experience

**Endpoint:** `GET /onboarding/experience`

**cURL Example:**
```bash
curl -X GET \
  -H "Authorization: Bearer <access_token>" \
  http://localhost:5000/api/onboarding/experience
```

**Expected Response (200):**
```json
{
  "experience": [
    {
      "id": 1,
      "company": "Google",
      "position": "Software Engineer",
      "description": "Worked on backend microservices",
      "start_date": "2022-01-15",
      "end_date": "2024-01-30",
      "is_current": false,
      "created_at": "2024-11-28T10:30:00"
    }
  ]
}
```

---

### 12. Update Work Experience

**Endpoint:** `PUT /onboarding/experience/<experience_id>`

**cURL Example:**
```bash
curl -X PUT \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{
    "is_current": true
  }' \
  http://localhost:5000/api/onboarding/experience/1
```

**Expected Response (200):**
```json
{
  "message": "Experience updated successfully",
  "experience": {
    "id": 1,
    "company": "Google",
    "position": "Software Engineer",
    "description": "Worked on backend microservices",
    "start_date": "2022-01-15",
    "end_date": "2024-01-30",
    "is_current": true,
    "created_at": "2024-11-28T10:30:00"
  }
}
```

---

### 13. Delete Work Experience

**Endpoint:** `DELETE /onboarding/experience/<experience_id>`

**cURL Example:**
```bash
curl -X DELETE \
  -H "Authorization: Bearer <access_token>" \
  http://localhost:5000/api/onboarding/experience/1
```

**Expected Response (200):**
```json
{
  "message": "Experience deleted successfully"
}
```

---

### 14. Add Certification

**Endpoint:** `POST /onboarding/certifications`

**Description:** Add professional certification

**Request Body:**
```json
{
  "name": "AWS Solutions Architect",
  "issuer": "Amazon Web Services",
  "issue_date": "2023-06-15",
  "expiration_date": "2025-06-15",
  "credential_id": "ABC123XYZ",
  "credential_url": "https://example.com/verify/cert"
}
```

**Required Fields:**
- `name`
- `issuer`
- `issue_date` (format: YYYY-MM-DD)

**Optional Fields:**
- `expiration_date` (format: YYYY-MM-DD)
- `credential_id`
- `credential_url`

**cURL Example:**
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{
    "name": "AWS Solutions Architect",
    "issuer": "Amazon Web Services",
    "issue_date": "2023-06-15",
    "expiration_date": "2025-06-15",
    "credential_id": "ABC123XYZ",
    "credential_url": "https://example.com/verify/cert"
  }' \
  http://localhost:5000/api/onboarding/certifications
```

**Expected Response (201):**
```json
{
  "message": "Certification added successfully",
  "certification": {
    "id": 1,
    "user_id": 1,
    "name": "AWS Solutions Architect",
    "issuer": "Amazon Web Services",
    "issue_date": "2023-06-15",
    "expiration_date": "2025-06-15",
    "credential_id": "ABC123XYZ",
    "credential_url": "https://example.com/verify/cert",
    "created_at": "2024-11-28T10:30:00"
  }
}
```

---

### 15. Get All Certifications

**Endpoint:** `GET /onboarding/certifications`

**cURL Example:**
```bash
curl -X GET \
  -H "Authorization: Bearer <access_token>" \
  http://localhost:5000/api/onboarding/certifications
```

**Expected Response (200):**
```json
{
  "certifications": [
    {
      "id": 1,
      "name": "AWS Solutions Architect",
      "issuer": "Amazon Web Services",
      "issue_date": "2023-06-15",
      "expiration_date": "2025-06-15",
      "credential_id": "ABC123XYZ",
      "credential_url": "https://example.com/verify/cert",
      "created_at": "2024-11-28T10:30:00"
    }
  ]
}
```

---

### 16. Update Certification

**Endpoint:** `PUT /onboarding/certifications/<certification_id>`

**cURL Example:**
```bash
curl -X PUT \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{
    "expiration_date": "2026-06-15"
  }' \
  http://localhost:5000/api/onboarding/certifications/1
```

**Expected Response (200):**
```json
{
  "message": "Certification updated successfully",
  "certification": {
    "id": 1,
    "name": "AWS Solutions Architect",
    "issuer": "Amazon Web Services",
    "issue_date": "2023-06-15",
    "expiration_date": "2026-06-15",
    "credential_id": "ABC123XYZ",
    "credential_url": "https://example.com/verify/cert",
    "created_at": "2024-11-28T10:30:00"
  }
}
```

---

### 17. Delete Certification

**Endpoint:** `DELETE /onboarding/certifications/<certification_id>`

**cURL Example:**
```bash
curl -X DELETE \
  -H "Authorization: Bearer <access_token>" \
  http://localhost:5000/api/onboarding/certifications/1
```

**Expected Response (200):**
```json
{
  "message": "Certification deleted successfully"
}
```

---

### 18. Get Complete Profile Summary

**Endpoint:** `GET /onboarding/profile`

**Description:** Get all user information (biodata, interests, skills, education, experience, certifications)

**cURL Example:**
```bash
curl -X GET \
  -H "Authorization: Bearer <access_token>" \
  http://localhost:5000/api/onboarding/profile
```

**Expected Response (200):**
```json
{
  "user": {
    "id": 1,
    "email": "john@example.com",
    "created_at": "2024-11-28T10:30:00"
  },
  "biodata": {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "phone": "+1234567890",
    "date_of_birth": "1990-01-15",
    "country": "United States",
    "city": "New York",
    "bio": "Software developer",
    "profile_image": "https://example.com/image.jpg",
    "created_at": "2024-11-28T10:30:00"
  },
  "interests_skills": {
    "interests": [
      {
        "id": 1,
        "value": "Machine Learning",
        "proficiency_level": null
      }
    ],
    "skills": [
      {
        "id": 2,
        "value": "Python",
        "proficiency_level": "advanced"
      }
    ],
    "career_preferences": [
      {
        "id": 3,
        "value": "Remote Work",
        "proficiency_level": null
      }
    ]
  },
  "education": [
    {
      "id": 1,
      "institution": "Harvard University",
      "degree": "Bachelor",
      "field_of_study": "Computer Science",
      "start_date": "2020-01-15",
      "end_date": "2024-05-30",
      "is_current": false,
      "grade": "3.8",
      "created_at": "2024-11-28T10:30:00"
    }
  ],
  "experience": [
    {
      "id": 1,
      "company": "Google",
      "position": "Software Engineer",
      "description": "Worked on backend microservices",
      "start_date": "2022-01-15",
      "end_date": "2024-01-30",
      "is_current": false,
      "created_at": "2024-11-28T10:30:00"
    }
  ],
  "certifications": [
    {
      "id": 1,
      "name": "AWS Solutions Architect",
      "issuer": "Amazon Web Services",
      "issue_date": "2023-06-15",
      "expiration_date": "2025-06-15",
      "credential_id": "ABC123XYZ",
      "credential_url": "https://example.com/verify/cert",
      "created_at": "2024-11-28T10:30:00"
    }
  ]
}
```

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

