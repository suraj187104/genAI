# 🧞‍♂️ GenieDoc - Multi-Agent GenAI Medical Report System

A comprehensive medical report processing system that uses multiple AI agents to parse, analyze, and simplify medical reports for patients.

## 🚀 Features

- **Multi-Agent Pipeline**: 7 specialized AI agents working together
- **OCR Support**: Extract text from images and PDFs
- **Medical Report Processing**: Parse structured medical data
- **Patient-Friendly Translation**: Convert medical jargon to simple language
- **Safety Checking**: Identify potential risks and inconsistencies
- **Doctor Review**: Simulate medical professional oversight
- **Modern Web Interface**: React-based frontend with real-time processing

## 🏗️ Architecture

### Backend Agents
1. **🩺 DrStructuraAgent** - Parses raw medical inputs into structured JSON
2. **🧾 ReportGeneratorAgent** - Generates professional medical reports
3. **💬 LaymanTranslatorAgent** - Simplifies medical jargon for patients
4. **🌐 RegionalTranslatorAgent** - Translates to patient-friendly language
5. **⚠️ SafetyCheckerAgent** - Checks for safety and critical alerts
6. **👨‍⚕️ DoctorReviewAgent** - Doctor reviews and approves the report
7. **🧠 GenieDocOrchestrator** - Orchestrates the entire pipeline

### Frontend
- React TypeScript application
- Real-time file upload and processing
- Progress tracking and result visualization
- Tabbed interface for different report views

## 🛠️ Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 16+
- Tesseract OCR
- Gemini API Key

### Backend Setup

1. **Install Python dependencies**:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Run setup script**:
   ```bash
   python setup.py
   ```

3. **Configure API Key**:
   - Get your Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Edit `backend/.env` file and replace `your_gemini_api_key_here` with your actual API key

4. **Install Tesseract OCR**:
   - **Windows**: Download from [UB-Mannheim](https://github.com/UB-Mannheim/tesseract/wiki)
   - **macOS**: `brew install tesseract`
   - **Ubuntu**: `sudo apt-get install tesseract-ocr`

5. **Start the backend**:
   ```bash
   python run_backend.py
   ```
   The backend will run on `http://localhost:8000`

### Frontend Setup

1. **Install Node.js dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Start the frontend**:
   ```bash
   npm start
   ```
   The frontend will run on `http://localhost:3000`

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the `backend` directory:

```env
# Required: Get from https://makersuite.google.com/app/apikey
GEMINI_API_KEY=your_actual_api_key_here

# Optional
DEBUG=True
```

### API Endpoints
- `GET /api/health` - Health check
- `POST /api/ocr_extract` - Extract text from images/PDFs
- `POST /api/agent/dr_structura` - Parse medical data
- `POST /api/agent/report_generator` - Generate reports
- `POST /api/agent/layman_translator` - Simplify language
- `POST /api/agent/regional_translator` - Patient-friendly translation
- `POST /api/agent/safety_checker` - Safety analysis
- `POST /api/agent/doctor_review` - Medical review
- `POST /api/agent/master_agent` - Orchestrate pipeline

## 🐛 Troubleshooting

### Common Issues

1. **"Please configure GEMINI_API_KEY"**
   - Make sure you have a valid Gemini API key in `backend/.env`
   - Get your key from [Google AI Studio](https://makersuite.google.com/app/apikey)

2. **"Tesseract not found"**
   - Install Tesseract OCR for your operating system
   - Make sure it's in your system PATH

3. **"Module not found" errors**
   - Run `pip install -r requirements.txt` in the backend directory
   - Make sure you're using Python 3.8+

4. **Frontend can't connect to backend**
   - Ensure backend is running on port 8000
   - Check that proxy is configured in `frontend/package.json`
   - Verify CORS settings in `backend/main.py`

5. **OCR extraction fails**
   - Check file format (supports: .txt, .pdf, .jpg, .jpeg, .png, .bmp, .tiff)
   - Ensure Tesseract is properly installed
   - Check file size (large files may timeout)

### Debug Mode
Set `DEBUG=True` in your `.env` file to see detailed error messages.

## 📁 Project Structure

```
google comm/
├── backend/
│   ├── agents/           # AI agent modules
│   ├── main.py          # FastAPI application
│   ├── requirements.txt # Python dependencies
│   ├── setup.py         # Setup script
│   └── .env            # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   └── App.tsx     # Main application
│   ├── package.json    # Node.js dependencies
│   └── tsconfig.json   # TypeScript config
└── run_backend.py      # Backend launcher
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## ⚠️ Disclaimer

This is a demonstration system and should not be used for actual medical diagnosis or treatment. Always consult with qualified healthcare professionals for medical advice. 

# genAI