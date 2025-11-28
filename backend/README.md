# FutureProof Backend API

User onboarding and authentication system using Flask, SQLAlchemy, and JWT.

## Setup & Installation

### Prerequisites
- Python 3.8+
- pip

### Installation

1. Clone the repository and navigate to backend folder:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create `.env` file (already provided with default values)

5. Run the application:
```bash
python app.py
```

The API will be available at `http://localhost:5000`

## API Endpoints

### Authentication Endpoints

#### 1. Signup
- **POST** `/api/auth/signup`
- Request body:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
- Response: User object with access and refresh tokens

#### 2. Login
- **POST** `/api/auth/login`
- Request body:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
- Response: User object with access token

#### 3. Get Current User
- **GET** `/api/auth/me`
- Headers: `Authorization: Bearer <access_token>`
- Response: Current user information

---

### Onboarding Endpoints

All onboarding endpoints require authentication header: `Authorization: Bearer <access_token>`

#### STEP 1: Biodata

##### Create/Update Biodata
- **POST** `/api/onboarding/biodata`
- Request body:
```json
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
```

##### Get Biodata
- **GET** `/api/onboarding/biodata`
- Response: User's biodata

---

#### STEP 2: Interests, Skills & Career Preferences

##### Add Interest/Skill/Career Preference
- **POST** `/api/onboarding/interests`
- Request body:
```json
{
  "category": "skill",
  "value": "Python",
  "proficiency_level": "advanced"
}
```
- Categories: `interest`, `skill`, `career_preference`
- Proficiency levels: `beginner`, `intermediate`, `advanced`, `expert`

##### Get All Interests/Skills
- **GET** `/api/onboarding/interests`
- Response: Grouped by category (interests, skills, career_preferences)

##### Delete Interest/Skill
- **DELETE** `/api/onboarding/interests/<id>`

---

#### STEP 3: Education

##### Add Education Record
- **POST** `/api/onboarding/education`
- Request body:
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

##### Get Education Records
- **GET** `/api/onboarding/education`

##### Update Education Record
- **PUT** `/api/onboarding/education/<id>`

##### Delete Education Record
- **DELETE** `/api/onboarding/education/<id>`

---

#### STEP 3: Work Experience

##### Add Work Experience
- **POST** `/api/onboarding/experience`
- Request body:
```json
{
  "company": "Google",
  "position": "Software Engineer",
  "description": "Worked on backend services",
  "start_date": "2022-01-15",
  "end_date": "2024-01-30",
  "is_current": false
}
```

##### Get Work Experience
- **GET** `/api/onboarding/experience`

##### Update Work Experience
- **PUT** `/api/onboarding/experience/<id>`

##### Delete Work Experience
- **DELETE** `/api/onboarding/experience/<id>`

---

#### STEP 3: Certifications

##### Add Certification
- **POST** `/api/onboarding/certifications`
- Request body:
```json
{
  "name": "AWS Solutions Architect",
  "issuer": "Amazon Web Services",
  "issue_date": "2023-06-15",
  "expiration_date": "2025-06-15",
  "credential_id": "ABC123",
  "credential_url": "https://example.com/cert"
}
```

##### Get Certifications
- **GET** `/api/onboarding/certifications`

##### Update Certification
- **PUT** `/api/onboarding/certifications/<id>`

##### Delete Certification
- **DELETE** `/api/onboarding/certifications/<id>`

---

#### Complete Profile Summary

##### Get Full Profile
- **GET** `/api/onboarding/profile`
- Response: All user information including biodata, interests, education, experience, and certifications

---

## Database Schema

### Users Table
- id (Primary Key)
- email (Unique)
- password_hash
- created_at
- updated_at

### BioData Table
- id (Primary Key)
- user_id (Foreign Key)
- first_name
- last_name
- phone
- date_of_birth
- country
- city
- bio
- profile_image

### Interests Table
- id (Primary Key)
- user_id (Foreign Key)
- category (interest, skill, career_preference)
- value
- proficiency_level

### Education Table
- id (Primary Key)
- user_id (Foreign Key)
- institution
- degree
- field_of_study
- start_date
- end_date
- is_current
- grade

### Experience Table
- id (Primary Key)
- user_id (Foreign Key)
- company
- position
- description
- start_date
- end_date
- is_current

### Certifications Table
- id (Primary Key)
- user_id (Foreign Key)
- name
- issuer
- issue_date
- expiration_date
- credential_id
- credential_url

## Security Best Practices Implemented

1. **Password Security**: Passwords are hashed using werkzeug.security
2. **JWT Authentication**: Secure token-based authentication with access and refresh tokens
3. **CORS**: Configured to prevent unauthorized cross-origin requests
4. **Input Validation**: All endpoints validate required fields and data formats
5. **Error Handling**: Proper HTTP status codes and error messages
6. **Database Indexing**: Indexed email field for faster lookups

## Environment Variables

- `FLASK_ENV`: Flask environment (development/production/testing)
- `DATABASE_URL`: SQLite database path (default: sqlite:///futureproof.db)
- `JWT_SECRET_KEY`: Secret key for JWT signing (change in production)

## Error Responses

All endpoints return proper HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation error)
- `401`: Unauthorized
- `404`: Not Found
- `409`: Conflict (duplicate entry)
- `500`: Internal Server Error

## Testing the API

### Using curl:

```bash
# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Add biodata (replace TOKEN with actual access token)
curl -X POST http://localhost:5000/api/onboarding/biodata \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"first_name":"John","last_name":"Doe"}'
```

### Using Postman:
1. Create a signup request and save the access_token
2. Use the token in Authorization header (Bearer token) for subsequent requests
3. Follow the endpoint documentation for request/response formats

## Project Structure

```
backend/
├── app.py                 # Application factory
├── config.py             # Configuration settings
├── models.py             # Database models
├── requirements.txt      # Python dependencies
├── .env                  # Environment variables
├── .gitignore           # Git ignore rules
└── routes/
    ├── auth.py          # Authentication endpoints
    └── onboarding.py    # Onboarding endpoints
```

## License

MIT
