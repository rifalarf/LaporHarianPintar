import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface ResultCardProps {
  title: string;
  content: string;
  color: 'blue' | 'green' | 'amber';
}

export const ResultCard: React.FC<ResultCardProps> = ({ title, content, color }) => {
  const [copied, setCopied] = useState(false);

  // Helper to estimate word count
  const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;

  const colorClasses = {
    blue: 'border-l-blue-500 bg-blue-50',
    green: 'border-l-green-500 bg-green-50',
    amber: 'border-l-amber-500 bg-amber-50',
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`relative p-5 rounded-r-lg border-l-4 shadow-sm bg-white ${colorClasses[color]} bg-opacity-30 mb-6 transition-all duration-300 hover:shadow-md`}>
      <div className="flex justify-between items-start mb-3">
        <div>
            <h3 className="font-bold text-slate-800 text-lg">{title}</h3>
            <span className="text-xs font-medium text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200 mt-1 inline-block">
                {wordCount} Kata
            </span>
        </div>
        <button
          onClick={handleCopy}
          className="p-2 text-slate-500 hover:text-blue-600 hover:bg-white rounded-full transition-colors"
          title="Salin teks"
        >
          {copied ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
        </button>
      </div>
      <p className="text-slate-700 leading-relaxed text-justify whitespace-pre-wrap">
        {content}
      </p>
    </div>
  );
};
