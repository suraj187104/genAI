import React from 'react';

interface LanguageSelectorProps {
  value: string;
  onChange: (lang: string) => void;
}

const languages = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
  { code: 'hi', label: 'Hindi' },
  { code: 'zh', label: 'Chinese' },
  { code: 'ar', label: 'Arabic' },
  { code: 'ru', label: 'Russian' },
  { code: 'de', label: 'German' },
  { code: 'ja', label: 'Japanese' },
];

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ value, onChange }) => (
  <div style={{ marginBottom: 8 }}>
    <label style={{ marginRight: 8 }}>Language:</label>
    <select value={value} onChange={e => onChange(e.target.value)}>
      {languages.map(lang => (
        <option key={lang.code} value={lang.code}>{lang.label}</option>
      ))}
    </select>
  </div>
);

export default LanguageSelector; 