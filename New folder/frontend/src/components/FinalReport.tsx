import React, { useState } from 'react';

interface FinalReportProps {
  agentOutputs: Record<string, any>;
}

const FinalReport: React.FC<FinalReportProps> = ({ agentOutputs }) => {
  const [report, setReport] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateReport = async () => {
    setLoading(true);
    setError('');
    setReport('');
    try {
      const res = await fetch('/api/agent/master_agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent_outputs: agentOutputs }),
      });
      const data = await res.json();
      if (res.ok) {
        setReport(data.output);
      } else {
        setError(data.detail || 'Error');
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ border: '2px solid #007bff', borderRadius: 12, margin: 24, padding: 24, background: '#f0f8ff' }}>
      <h2>🧠 Your Full Health Report</h2>
      <button onClick={handleGenerateReport} disabled={loading} style={{ marginBottom: 16 }}>
        {loading ? 'Generating...' : 'Generate Final Report'}
      </button>
      {report && (
        <div>
          <strong>Report Output:</strong>
          <pre style={{ background: '#e6ffe6', padding: 12 }}>{report}</pre>
        </div>
      )}
      {error && (
        <div style={{ color: 'red' }}>
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
};

export default FinalReport; 