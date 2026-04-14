import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import google.generativeai as genai
from typing import Dict, Any
from dotenv import load_dotenv

router = APIRouter()

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

class MasterAgentInput(BaseModel):
    agent_outputs: Dict[str, Any]

@router.post("/api/agent/master_agent")
def master_agent(input_data: MasterAgentInput):
    try:
        # Check if API key is configured
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key or api_key == "your_gemini_api_key_here":
            return {"input": input_data.agent_outputs, "output": "Error: Please configure GEMINI_API_KEY in .env file"}
        
        model = genai.GenerativeModel("gemini-1.5-flash")
        prompt = (
            "You are MasterAgent. Combine the following agent outputs into a final structured health report for a patient dashboard. "
            "Include: Patient Overview, Doctor Summary, Patient Explanation, Health Breakdown Cards, Safety Alert Panel. Use JSON structure.\n"
            f"Agent Outputs: {input_data.agent_outputs}"
        )
        response = model.generate_content(prompt)
        return {"input": input_data.agent_outputs, "output": response.text}
    except Exception as e:
        print("Gemini API error (MasterAgent):", e)
        return {"input": input_data.agent_outputs, "output": f"Error: {str(e)}"} 