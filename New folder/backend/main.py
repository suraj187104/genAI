import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from agents.dr_structura import router as dr_structura_router
from agents.report_generator import router as report_generator_router
from agents.layman_translator import router as layman_translator_router
from agents.regional_translator import router as regional_translator_router
from agents.safety_checker import router as safety_checker_router
from agents.doctor_review import router as doctor_review_router
from agents.master_agent import router as master_agent_router
from fastapi import File, UploadFile
from PIL import Image
import pytesseract
import io
from pdf2image import convert_from_bytes

load_dotenv()

app = FastAPI()

# Allow all origins for development; restrict in production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(dr_structura_router)
app.include_router(report_generator_router)
app.include_router(layman_translator_router)
app.include_router(regional_translator_router)
app.include_router(safety_checker_router)
app.include_router(doctor_review_router)
app.include_router(master_agent_router)

@app.get("/api/health")
def health_check():
    return {"status": "ok"}

@app.post("/api/ocr_extract")
def ocr_extract(file: UploadFile = File(...)):
    try:
        if not file:
            return {"error": "No file provided"}
        
        filename = file.filename.lower()
        file_bytes = file.file.read()
        
        if filename.endswith('.pdf'):
            # Convert PDF pages to images
            images = convert_from_bytes(file_bytes)
            text = ''
            for img in images:
                text += pytesseract.image_to_string(img) + '\n'
            return {"text": text.strip()}
        elif any(filename.endswith(ext) for ext in ['.jpg', '.jpeg', '.png', '.bmp', '.tiff']):
            # Handle images
            image = Image.open(io.BytesIO(file_bytes))
            text = pytesseract.image_to_string(image)
            return {"text": text}
        else:
            return {"error": "Unsupported file type. Please upload PDF or image files."}
    except Exception as e:
        print(f"OCR Error: {e}")
        return {"error": f"OCR processing failed: {str(e)}"} 