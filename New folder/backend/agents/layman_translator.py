import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv

router = APIRouter()

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

class LaymanTranslatorInput(BaseModel):
    doctor_summary: str

@router.post("/api/agent/layman_translator")
def layman_translator_agent(input_data: LaymanTranslatorInput):
    try:
        # Check if API key is configured
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key or api_key == "your_gemini_api_key_here":
            return {"input": input_data.doctor_summary, "output": "Error: Please configure GEMINI_API_KEY in .env file"}
        
        model = genai.GenerativeModel("gemini-1.5-flash")
        prompt = (
            "You are LaymanTranslatorAgent. Simplify this doctor-style summary for a patient with no medical background.\n"
            f"Input: {input_data.doctor_summary}"
        )
        response = model.generate_content(prompt)
        return {"input": input_data.doctor_summary, "output": response.text}
    except Exception as e:
        print("Gemini API error (LaymanTranslatorAgent):", e)
        return {"input": input_data.doctor_summary, "output": f"Error: {str(e)}"} 