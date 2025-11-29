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

#### Assessment Questionnaire

##### Submit/Update Assessment
- **POST** `/api/onboarding/assessment`
- Description: Submit or update user's onboarding assessment questionnaire
- Request body: Assessment data (see TESTING.md for examples)
- Response: Assessment object with all fields

##### Get Assessment
- **GET** `/api/onboarding/assessment`
- Response: User's assessment data

#### AI-Generated Job Titles

##### Generate Recommended Job Titles
- **POST** `/api/onboarding/recommended-jobs`
- Prerequisites: Assessment must be completed
- Response: 3 recommended job titles

##### Get Recommended Job Titles
- **GET** `/api/onboarding/recommended-jobs`
- Response: Previously generated job titles

---

### Roadmap Endpoints

All roadmap endpoints require authentication header: `Authorization: Bearer <access_token>`

#### Get User's Saved Roadmap
- **GET** `/api/roadmap`
- Description: Retrieve the user's personalized career roadmap
- Prerequisites: Roadmap must be generated first via POST endpoint
- Response: Complete roadmap object with phases, skills, resources, and timeline

#### Generate/Regenerate Roadmap
- **POST** `/api/roadmap`
- Description: Generate a new personalized roadmap based on assessment
- Prerequisites: User must have completed onboarding assessment
- Response: Generated roadmap with all details

#### Check Roadmap Status
- **GET** `/api/roadmap/status`
- Description: Quick check if user has a saved roadmap
- Response: Status information (has_roadmap boolean + metadata)

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
- `GEMINI_API_KEY`: Google Gemini API key for job title generation

## Setup Instructions

### Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the API key
4. Add to `.env` file: `GEMINI_API_KEY=your-key-here`

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
