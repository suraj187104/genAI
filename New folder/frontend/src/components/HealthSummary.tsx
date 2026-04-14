import React from 'react';

interface HealthSummaryProps {
  heart: string;
  lungs: string;
  sugar?: string;
  bp?: string;
  action?: string;
}

const getColor = (status: string) => {
  if (/critical/i.test(status)) return '#ff4d4f';
  if (/mild|follow-up/i.test(status)) return '#faad14';
  if (/normal|ok|stable/i.test(status)) return '#52c41a';
  return '#d9d9d9';
};

const HealthSummary: React.FC<HealthSummaryProps> = ({ heart, lungs, sugar, bp, action }) => (
  <div style={{ display: 'flex', gap: 24, margin: '16px 0' }}>
    <div style={{ background: getColor(heart), padding: 16, borderRadius: 8, minWidth: 120 }}>
      <span role="img" aria-label="heart">❤️</span> Heart: {heart}
    </div>
    <div style={{ background: getColor(lungs), padding: 16, borderRadius: 8, minWidth: 120 }}>
      <span role="img" aria-label="lungs">🫁</span> Lungs: {lungs}
    </div>
    {sugar && (
      <div style={{ background: getColor(sugar), padding: 16, borderRadius: 8, minWidth: 120 }}>
        <span role="img" aria-label="sugar">🍬</span> Sugar: {sugar}
      </div>
    )}
    {bp && (
      <div style={{ background: getColor(bp), padding: 16, borderRadius: 8, minWidth: 120 }}>
        <span role="img" aria-label="bp">📊</span> BP: {bp}
      </div>
    )}
    {action && (
      <div style={{ background: '#e6f7ff', padding: 16, borderRadius: 8, minWidth: 180 }}>
        <span role="img" aria-label="action">💡</span> {action}
      </div>
    )}
  </div>
);

export default HealthSummary; 