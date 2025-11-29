import os
import json
import google.generativeai as genai
import serpapi  # <--- FIX 1: Import the module directly (New Library)

# Configure your Gemini API key
# WARNING: Avoid hardcoding keys in production. Use os.getenv('GEMINI_API_KEY')
genai.configure(api_key='AIzaSyDAowi2PfFAka8UBPrRqN4GVKRglQ_xnwI')

def generate_market_aware_roadmap(user_profile_json: dict, target_job_title: str) -> dict:
    """
    Generates a career roadmap by combining live job market data with a user's profile.
    """
    
    # --- STEP 1: Fetch Live Job Data (SerpApi - New Library Syntax) ---
    params = {
        "engine": "google_jobs",
        "q": target_job_title,
        "location": "Lagos, Nigeria", 
        "hl": "en",
        "gl": "ng",
        # "api_key": "..."  <-- We pass this to the Client directly below
    }

    try:
        # FIX 2: Use the Client class from the new 'serpapi' library
        # I placed your key here, but consider using os.getenv("SERPAPI_KEY")
        client = serpapi.Client(api_key="3648f9d4251b0e1929b23a02c57bb9146e8af2d10c047c1964dc8e6078a50255")
        
        # Execute the search
        results = client.search(params)
        
        # The new library returns a dict directly (no .get_dict() needed)
        jobs_results = results.get("jobs_results", [])
        
        # Extract the top 5 job descriptions
        market_context_list = []
        for job in jobs_results[:5]:
            title = job.get('title', 'Unknown Role')
            desc = job.get('description', 'No description')
            market_context_list.append(f"Job: {title} | Requirements: {desc}")
            
        market_context_str = "\n".join(market_context_list)
        
        if not market_context_str:
             market_context_str = "No specific job data found. Use general industry standards."
        
    except Exception as e:
        print(f"⚠️ Search API Error: {e}")
        market_context_str = "Market data unavailable. Use general best practices."

    # --- STEP 2: Prepare the Gemini Prompt ---
    prompt = f"""
    Act as a Senior Technical Career Architect.
    
    [INPUT DATA]
    1. TARGET ROLE: {target_job_title}
    2. USER PROFILE (JSON): 
    {json.dumps(user_profile_json)}
    
    3. REAL-TIME MARKET DEMAND (Live Job Listings in Lagos):
    {market_context_str}
    
    [INSTRUCTIONS]
    - Compare the User Profile against the Market Demand.
    - Identification of Gaps: If the market wants "FastAPI" but the user only knows "Flask", prioritize learning FastAPI.
    - Structure a 6-phase roadmap to bridge the gap.
    
    [OUTPUT FORMAT]
    Return ONLY valid JSON. Do not include markdown formatting (like ```json).
    Structure:
    {{
        "roadmap_summary": "string",
        "skills_gap_analysis": ["skill1", "skill2"],
        "phases": [
            {{
                "phase_title": "string",
                "estimated_weeks": "integer",
                "topics": ["topic1", "topic2"],
                "action_item": "Build X project"
            }}
        ]
    }}
    """

    # --- STEP 3: Call Gemini LLM ---
    # FIX 3: Use the correct model name (gemini-1.5-flash)
    model = genai.GenerativeModel('gemini-2.5-flash')
    
    response = model.generate_content(
        prompt,
        generation_config={"response_mime_type": "application/json"}
    )

    # --- STEP 4: Return Parsed Data ---
    try:
        return json.loads(response.text)
    except json.JSONDecodeError:
        return {"error": "Failed to parse roadmap generation.", "raw_text": response.text}