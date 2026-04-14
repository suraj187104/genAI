import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv

router = APIRouter()

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

class RegionalTranslatorInput(BaseModel):
    text: str

@router.post("/api/agent/regional_translator")
def regional_translator_agent(input_data: RegionalTranslatorInput):
    try:
        # Check if API key is configured
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key or api_key == "your_gemini_api_key_here":
            return {"input": input_data.text, "output": "Error: Please configure GEMINI_API_KEY in .env file"}
        
        model = genai.GenerativeModel("gemini-1.5-flash")
        prompt = (
            f"Translate the following text into simple, clear language that a patient can understand.\nText: {input_data.text}"
        )
        response = model.generate_content(prompt)
        return {"input": input_data.text, "output": response.text}
    except Exception as e:
        print("Gemini API error (RegionalTranslatorAgent):", e)
        return {"input": input_data.text, "output": f"Error: {str(e)}"} 