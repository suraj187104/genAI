import React, { useState, useRef } from 'react';
import './App.css';
import AgentCard from './components/AgentCard';
import FinalReport from './components/FinalReport';
import LanguageSelector from './components/LanguageSelector';

const API_BASE = '/api/agent';

const agentList = [
  { name: '🩺 DrStructuraAgent', desc: 'Parses raw medical inputs into structured JSON', endpoint: `${API_BASE}/dr_structura`, key: 'raw_text' },
  { name: '🧾 ReportGeneratorAgent', desc: 'Generates professional medical reports', endpoint: `${API_BASE}/report_generator`, key: 'structured_json' },
  { name: '💬 LaymanTranslatorAgent', desc: 'Simplifies medical jargon for patients', endpoint: `${API_BASE}/layman_translator`, key: 'doctor_summary' },
  { name: '🌐 RegionalTranslatorAgent', desc: 'Translates to regional languages', endpoint: `${API_BASE}/regional_translator`, key: 'text' },
  { name: '⚠️ SafetyCheckerAgent', desc: 'Checks for safety and critical alerts', endpoint: `${API_BASE}/safety_checker`, key: 'text' },
  { name: '👨‍⚕️ DoctorReviewAgent', desc: 'Doctor reviews and approves the report', endpoint: `${API_BASE}/doctor_review`, key: 'text' },
  { name: '🧠 GenieDocOrchestrator', desc: 'Orchestrates the entire pipeline', endpoint: `${API_BASE}/master_agent`, key: 'agent_outputs' },
];

function App() {
  // File and text state
  const [fileName, setFileName] = useState('');
  const [rawInput, setRawInput] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tab state
  const [activeTab, setActiveTab] = useState<'original' | 'simplified' | 'summary'>('original');

  // Agent outputs
  const [agentOutputs, setAgentOutputs] = useState<any>({});
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  // Handle file drop or select
  const handleFile = async (file: File) => {
    setFileName(file.name);
    setUploadError('');
    setUploading(true);
    let text = '';
    try {
      if (file.type === 'text/plain') {
        text = await file.text();
      } else if (file.type === 'application/pdf') {
        // Use pdf.js for PDF extraction (in-browser)
        setUploadError('PDF extraction coming soon! For now, use TXT or image.');
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        setUploadError('DOCX extraction coming soon! For now, use TXT or image.');
      } else if (file.type.startsWith('image/')) {
        // Send to backend for OCR
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/ocr_extract', { method: 'POST', body: formData });
        const data = await res.json();
        if (data.text) text = data.text;
        else setUploadError(data.error || 'Could not extract text from image');
      } else {
        setUploadError('Unsupported file type. Please upload TXT or image.');
      }
      setRawInput(text);
    } catch (e: any) {
      setUploadError(e.message);
    } finally {
      setUploading(false);
    }
  };

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  };
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) handleFile(e.target.files[0]);
  };

  // Run pipeline (simulate progress)
  const runPipeline = async () => {
    setProcessing(true);
    setProgress(0);
    let outputs: any = {};
    let input = rawInput;
    for (let i = 0; i < agentList.length; i++) {
      setProgress(Math.round(((i + 1) / agentList.length) * 100));
      const agent = agentList[i];
      let body: any = {};
      if (i === 0) body[agent.key] = input;
      else if (agent.key === 'agent_outputs') body[agent.key] = outputs;
      else body[agent.key] = outputs[agentList[i - 1].name] || '';
      try {
        const res = await fetch(agent.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        outputs[agent.name] = data.output || '';
      } catch {
        outputs[agent.name] = '[Error]';
      }
      await new Promise(r => setTimeout(r, 400)); // Staggered animation
    }
    setAgentOutputs(outputs);
    setProcessing(false);
    setProgress(100);
  };

  return (
    <div className="app-container">
      <div className="header">
        <h1>🧞‍♂️ GenieDoc</h1>
        <p>Multi-Agent GenAI System for Medical Report Simplification</p>
      </div>
      <div className="upload-section">
        <div
          className={`upload-area${dragActive ? ' dragover' : ''}`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <h3>📁 Upload Medical Report</h3>
          <p>Drag and drop your medical report here, or click to browse</p>
          <input
            type="file"
            ref={fileInputRef}
            accept=".txt,image/*,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            style={{ display: 'none' }}
            onChange={handleFileInput}
          />
          {fileName && <div style={{ marginTop: 8, color: '#4a5568' }}>Selected: {fileName}</div>}
        </div>
        {uploadError && <div className="error-message">{uploadError}</div>}
        <textarea
          rows={6}
          style={{ width: '100%', marginTop: 12, padding: 8 }}
          placeholder="Paste raw medical text here (or upload above)"
          value={rawInput}
          onChange={e => setRawInput(e.target.value)}
        />
        <button className="btn" onClick={runPipeline} disabled={!rawInput || uploading || processing}>
          🚀 Process Report
        </button>
        {processing && (
          <div className="loading">
            <div className="spinner"></div>
            <div style={{ marginTop: 12 }}>Processing your medical report... ({progress}%)</div>
          </div>
        )}
      </div>
      {Object.keys(agentOutputs).length > 0 && (
        <div className="results-section">
          <h2>Processing Results</h2>
          <div className="agent-grid">
            {agentList.map((agent, idx) => (
              <div className="agent-card" key={agent.name} style={{ transitionDelay: `${idx * 0.2}s` }}>
                <h3>{agent.name}</h3>
                <div style={{ color: '#718096', marginBottom: 8 }}>{agent.desc}</div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: agentOutputs[agent.name] ? '100%' : '0%' }}
                  ></div>
                </div>
                <div className={`status-indicator ${agentOutputs[agent.name] ? 'completed' : 'processing'}`}>
                  {agentOutputs[agent.name] ? 'Completed' : 'Processing'}
                </div>
                <div style={{ marginTop: 12, fontSize: 13, color: '#333', wordBreak: 'break-word' }}>
                  {agentOutputs[agent.name] || '...'}
                </div>
              </div>
            ))}
          </div>
          <div className="result-tabs">
            <div className={`tab${activeTab === 'original' ? ' active' : ''}`} onClick={() => setActiveTab('original')}>Original Report</div>
            <div className={`tab${activeTab === 'simplified' ? ' active' : ''}`} onClick={() => setActiveTab('simplified')}>Simplified Version</div>
            <div className={`tab${activeTab === 'summary' ? ' active' : ''}`} onClick={() => setActiveTab('summary')}>Summary</div>
          </div>
          <div className={`tab-content${activeTab === 'original' ? ' active' : ''}`}>
            <div className="content-box">{rawInput}</div>
          </div>
          <div className={`tab-content${activeTab === 'simplified' ? ' active' : ''}`}>
            <div className="content-box">{agentOutputs['💬 LaymanTranslatorAgent'] || '...'}</div>
          </div>
          <div className={`tab-content${activeTab === 'summary' ? ' active' : ''}`}>
            <div className="content-box">{agentOutputs['🧠 GenieDocOrchestrator'] || '...'}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
