#!/usr/bin/env python3
"""
Setup script for GenieDoc Backend
This script helps configure the environment and check for missing dependencies.
"""

import os
import sys
import subprocess

def check_dependencies():
    """Check if all required dependencies are installed"""
    required_packages = [
        'fastapi',
        'uvicorn', 
        'python-dotenv',
        'google-generativeai',
        'httpx',
        'pytesseract',
        'pillow',
        'pdf2image'
    ]
    
    missing_packages = []
    for package in required_packages:
        try:
            __import__(package.replace('-', '_'))
        except ImportError:
            missing_packages.append(package)
    
    if missing_packages:
        print(f"❌ Missing packages: {', '.join(missing_packages)}")
        print("Run: pip install -r requirements.txt")
        return False
    else:
        print("✅ All dependencies are installed")
        return True

def create_env_file():
    """Create .env file if it doesn't exist"""
    env_path = os.path.join(os.path.dirname(__file__), '.env')
    
    if os.path.exists(env_path):
        print("✅ .env file already exists")
        return True
    
    env_content = """# Gemini API Key - Get from https://makersuite.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Other configuration
DEBUG=True
"""
    
    try:
        with open(env_path, 'w') as f:
            f.write(env_content)
        print("✅ Created .env file")
        print("⚠️  Please edit .env file and add your Gemini API key")
        return True
    except Exception as e:
        print(f"❌ Failed to create .env file: {e}")
        return False

def check_tesseract():
    """Check if tesseract is installed"""
    try:
        result = subprocess.run(['tesseract', '--version'], 
                              capture_output=True, text=True)
        if result.returncode == 0:
            print("✅ Tesseract OCR is installed")
            return True
        else:
            print("❌ Tesseract OCR is not working properly")
            return False
    except FileNotFoundError:
        print("❌ Tesseract OCR is not installed")
        print("Install instructions:")
        print("  Windows: Download from https://github.com/UB-Mannheim/tesseract/wiki")
        print("  macOS: brew install tesseract")
        print("  Ubuntu: sudo apt-get install tesseract-ocr")
        return False

def main():
    print("🔧 GenieDoc Backend Setup")
    print("=" * 40)
    
    # Check dependencies
    print("\n1. Checking dependencies...")
    deps_ok = check_dependencies()
    
    # Create .env file
    print("\n2. Setting up environment...")
    env_ok = create_env_file()
    
    # Check tesseract
    print("\n3. Checking OCR dependencies...")
    ocr_ok = check_tesseract()
    
    print("\n" + "=" * 40)
    if deps_ok and env_ok and ocr_ok:
        print("✅ Setup complete! You can now run the backend.")
        print("📝 Don't forget to:")
        print("   1. Add your Gemini API key to .env file")
        print("   2. Run: python run_backend.py")
    else:
        print("❌ Setup incomplete. Please fix the issues above.")
        sys.exit(1)

if __name__ == "__main__":
    main() 