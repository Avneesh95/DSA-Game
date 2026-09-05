import { Code2 } from 'lucide-react';

const LANGUAGES = [
  { value: 'java', label: 'Java' },
  { value: 'python', label: 'Python' },
  { value: 'cpp', label: 'C++' },
  { value: 'c', label: 'C' },
];

export default function LanguageSelector({ value, onChange }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-slate-400">
      <Code2 size={13} />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-dungeon-800 border border-dungeon-600 rounded-md px-2 py-1 text-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-glow-purple cursor-pointer hover:border-glow-purple/60 transition-colors"
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.value} value={lang.value}>
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
}
