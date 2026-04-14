import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv

router = APIRouter()

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

class DrStructuraInput(BaseModel):
    raw_text: str

@router.post("/api/agent/dr_structura")
def dr_structura_agent(input_data: DrStructuraInput):
    try:
        # Check if API key is configured
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key or api_key == "your_gemini_api_key_here":
            return {"input": input_data.raw_text, "output": "Error: Please configure GEMINI_API_KEY in .env file"}
        
        model = genai.GenerativeModel("gemini-1.5-flash")
        prompt = (
            "You are DrStructuraAgent. Parse the following messy medical input (could be OCR, PDF, or FHIR) "
            "into clean, structured JSON with fields: patient_name, age, gender, symptoms, vitals, diagnosis, lab_results, notes.\n"
            f"Input: {input_data.raw_text}"
        )
        response = model.generate_content(prompt)
        return {"input": input_data.raw_text, "output": response.text}
    except Exception as e:
        print("Gemini API error (DrStructuraAgent):", e)
        return {"input": input_data.raw_text, "output": f"Error: {str(e)}"} 