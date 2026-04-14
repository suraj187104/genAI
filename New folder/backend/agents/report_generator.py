import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv

router = APIRouter()

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

class ReportGeneratorInput(BaseModel):
    structured_json: str  # JSON as string

@router.post("/api/agent/report_generator")
def report_generator_agent(input_data: ReportGeneratorInput):
    try:
        # Check if API key is configured
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key or api_key == "your_gemini_api_key_here":
            return {"input": input_data.structured_json, "output": "Error: Please configure GEMINI_API_KEY in .env file"}
        
        model = genai.GenerativeModel("gemini-1.5-flash")
        prompt = (
            "You are ReportGeneratorAgent. Given this structured medical data as JSON, write a doctor-style diagnosis summary.\n"
            f"Input: {input_data.structured_json}"
        )
        response = model.generate_content(prompt)
        return {"input": input_data.structured_json, "output": response.text}
    except Exception as e:
        print("Gemini API error (ReportGeneratorAgent):", e)
        return {"input": input_data.structured_json, "output": f"Error: {str(e)}"} 