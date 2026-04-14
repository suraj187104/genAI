import React, { useState } from 'react';

interface AgentCardProps {
  agentName: string;
  endpoint: string;
  inputLabel: string;
  inputPlaceholder: string;
  inputKey: string;
  extraFields?: React.ReactNode;
  value?: string;
  onValueChange?: (val: string) => void;
  output?: string;
  setOutput?: (val: string) => void;
}

const AgentCard: React.FC<AgentCardProps> = ({ agentName, endpoint, inputLabel, inputPlaceholder, inputKey, extraFields, value, onValueChange, output, setOutput }) => {
  const [expanded, setExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [localOutput, setLocalOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Use controlled input/output if provided
  const inputValue = value !== undefined ? value : input;
  const setInputValue = onValueChange || setInput;
  const outputValue = output !== undefined ? output : localOutput;
  const setOutputValue = setOutput || setLocalOutput;

  const handleRunAgent = async () => {
    setLoading(true);
    setError('');
    setOutputValue('');
    try {
      const body: any = {};
      body[inputKey] = inputValue;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        setOutputValue(data.output);
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
    <div className={`agent-card${expanded ? ' expanded' : ''}`} style={{ border: '1px solid #ccc', borderRadius: 8, margin: 16, padding: 16, background: '#fff', boxShadow: expanded ? '0 2px 8px #aaa' : 'none' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={() => setExpanded(e => !e)}>
        <h2>{agentName}</h2>
        <span>{expanded ? '▲' : '▼'}</span>
      </div>
      {expanded && (
        <div style={{ marginTop: 16 }}>
          <label>{inputLabel}</label>
          <input
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder={inputPlaceholder}
            style={{ width: '100%', marginBottom: 8, padding: 8 }}
          />
          {extraFields}
          <button onClick={handleRunAgent} disabled={loading} style={{ marginBottom: 8 }}>
            {loading ? 'Running...' : 'Run Agent'}
          </button>
          <div>
            <strong>Input:</strong>
            <pre style={{ background: '#f6f6f6', padding: 8 }}>{inputValue}</pre>
          </div>
          {outputValue && (
            <div>
              <strong>Output:</strong>
              <pre style={{ background: '#e6ffe6', padding: 8 }}>{outputValue}</pre>
            </div>
          )}
          {error && (
            <div style={{ color: 'red' }}>
              <strong>Error:</strong> {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AgentCard; 