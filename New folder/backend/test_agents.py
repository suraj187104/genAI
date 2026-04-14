#!/usr/bin/env python3
"""
Test script to verify all agents are working correctly
"""

import requests
import json
import time

BASE_URL = "http://localhost:8000"

def test_health():
    """Test the health endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/api/health")
        if response.status_code == 200:
            print("✅ Health check passed")
            return True
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Health check error: {e}")
        return False

def test_agent(agent_name, endpoint, test_data):
    """Test a specific agent"""
    try:
        print(f"\n🧪 Testing {agent_name}...")
        response = requests.post(
            f"{BASE_URL}{endpoint}",
            json=test_data,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ {agent_name} passed")
            print(f"   Input: {result.get('input', 'N/A')}")
            print(f"   Output: {result.get('output', 'N/A')[:100]}...")
            return True
        else:
            print(f"❌ {agent_name} failed: {response.status_code}")
            print(f"   Error: {response.text}")
            return False
    except Exception as e:
        print(f"❌ {agent_name} error: {e}")
        return False

def main():
    print("🧪 Testing GenieDoc Backend Agents")
    print("=" * 50)
    
    # Test health first
    if not test_health():
        print("❌ Backend is not running. Please start it first.")
        return
    
    # Test data for each agent
    test_cases = [
        {
            "name": "DrStructuraAgent",
            "endpoint": "/api/agent/dr_structura",
            "data": {"raw_text": "Patient: John Doe, Age: 45, Symptoms: chest pain, BP: 140/90"}
        },
        {
            "name": "ReportGeneratorAgent", 
            "endpoint": "/api/agent/report_generator",
            "data": {"structured_json": '{"patient_name": "John Doe", "age": 45, "symptoms": ["chest pain"], "vitals": {"bp": "140/90"}}'}
        },
        {
            "name": "LaymanTranslatorAgent",
            "endpoint": "/api/agent/layman_translator", 
            "data": {"doctor_summary": "Patient presents with acute chest pain and elevated blood pressure."}
        },
        {
            "name": "RegionalTranslatorAgent",
            "endpoint": "/api/agent/regional_translator",
            "data": {"text": "Patient has chest pain and high blood pressure."}
        },
        {
            "name": "SafetyCheckerAgent",
            "endpoint": "/api/agent/safety_checker",
            "data": {"text": "Patient has chest pain and high blood pressure."}
        },
        {
            "name": "DoctorReviewAgent",
            "endpoint": "/api/agent/doctor_review",
            "data": {"text": "Patient presents with chest pain and elevated BP."}
        },
        {
            "name": "MasterAgent",
            "endpoint": "/api/agent/master_agent",
            "data": {"agent_outputs": {"DrStructuraAgent": "Structured data", "ReportGeneratorAgent": "Medical report"}}
        }
    ]
    
    passed = 0
    total = len(test_cases)
    
    for test_case in test_cases:
        if test_agent(test_case["name"], test_case["endpoint"], test_case["data"]):
            passed += 1
        time.sleep(1)  # Small delay between tests
    
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {passed}/{total} agents passed")
    
    if passed == total:
        print("🎉 All agents are working correctly!")
        print("✅ Backend is ready for frontend integration")
    else:
        print("⚠️  Some agents have issues. Check the errors above.")

if __name__ == "__main__":
    main() 