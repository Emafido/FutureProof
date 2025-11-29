import os
import json
import google.generativeai as genai
import serpapi
import dotenv
from google.api_core import retry # specialized retry for Gemini

# Load environment variables
dotenv.load_dotenv()

# Configure APIs
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))

def generate_market_aware_roadmap(user_profile_json: dict, target_job_title: str) -> dict:
    """
    Generates a career roadmap by combining live job market data with a user's profile.
    """
    
    # --- STEP 1: Fetch Live Job Data (SerpApi) ---
    params = {
        "engine": "google_jobs",
        "q": target_job_title,
        "location": "Lagos, Nigeria", 
        "hl": "en",
        "gl": "ng",
    }

    print(f"🔍 Searching for jobs: {target_job_title}...")
    
    try:
        # Initialize Client
        client = serpapi.Client(api_key=os.getenv("SERPAPI_KEY"))
        
        # Execute search
        results = client.search(params)
        jobs_results = results.get("jobs_results", [])
        
        # Extract top 5
        market_context_list = []
        for job in jobs_results[:5]:
            title = job.get('title', 'Unknown Role')
            desc = job.get('description', 'No description available')[:500] # Limit char count to save tokens
            market_context_list.append(f"Job: {title} | Brief: {desc}")
            
        market_context_str = "\n".join(market_context_list)
        
        if not market_context_str:
             market_context_str = "No specific job data found. Use general industry standards."
             print("⚠️ No jobs found via API, using fallback.")
        else:
            print("✅ Market data retrieved successfully.")

    except Exception as e:
        print(f"⚠️ Search API Error: {e}")
        # FALLBACK: If API fails (like the WinError), allow script to continue with generic data
        market_context_str = "Market data unavailable due to network error. Use general best practices for this role."

    # --- STEP 2: Prepare the Gemini Prompt ---
    prompt = f"""
    Act as a Senior Technical Career Architect.
    
    [INPUT DATA]
    1. TARGET ROLE: {target_job_title}
    2. USER PROFILE: {json.dumps(user_profile_json)}
    3. REAL-TIME MARKET CONTEXT:
    {market_context_str}
    
    [INSTRUCTIONS]
    - Compare the User Profile against the Market Context.
    - Identification of Gaps: If the market lists skills the user lacks, prioritize them.
    - Structure a 6-phase roadmap.
    
    [OUTPUT FORMAT]
    Return ONLY valid JSON.
    {{
        "roadmap_summary": "string",
        "skills_gap_analysis": ["skill1", "skill2"],
        "phases": [
            {{
                "phase_title": "string",
                "estimated_weeks": "integer",
                "topics": ["topic1", "topic2"],
                "action_item": "string"
            }}
        ]
    }}
    """

    # --- STEP 3: Call Gemini LLM ---
    # FIX: Correct model name is 1.5-flash or 1.5-pro
    model = genai.GenerativeModel('gemini-2.5-flash')
    
    try:
        print("🤖 Asking Gemini to generate roadmap...")
        response = model.generate_content(
            prompt,
            # FIX: Correct syntax for JSON mode
            generation_config={"response_mime_type": "application/json"}
        )
        
        return json.loads(response.text)
        
    except Exception as e:
        return {"error": f"Gemini API failed: {str(e)}"}

# --- TEST BLOCK ---
if __name__ == "__main__":
    # Dummy profile for testing
    test_profile = {"skills": ["Python", "Flask"], "experience": "2 years"}
    result = generate_market_aware_roadmap(test_profile, "Backend Developer")
    print(json.dumps(result, indent=2))