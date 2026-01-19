
import React, { useState } from 'react';

interface SqlDisplayProps {
  sql: string;
}

export const SqlDisplay: React.FC<SqlDisplayProps> = ({ sql }) => {
  const [expanded, setExpanded] = useState(false);
  const isTemplate = sql.includes('v_fact'); // Simple heuristic or we could pass as prop

  return (
    <div className="mt-4 text-xs font-mono bg-slate-900 text-slate-300 rounded-xl overflow-hidden border border-slate-700 shadow-inner">
      <div 
        className="flex justify-between items-center px-4 py-2 bg-slate-800/50 cursor-pointer hover:bg-slate-700 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${isTemplate ? 'bg-indigo-400' : 'bg-emerald-400'}`}></div>
          <span className="font-bold tracking-tight text-slate-400 uppercase text-[9px]">
            {isTemplate ? 'Validated Template Query' : 'AI Synthetic Query'}
          </span>
        </div>
        <button className="text-[10px] uppercase font-bold tracking-widest text-indigo-400 hover:text-indigo-300">
          {expanded ? 'Collapse' : 'Inspect'}
        </button>
      </div>
      {expanded && (
        <pre className="p-4 overflow-x-auto whitespace-pre-wrap leading-relaxed text-indigo-100/80 bg-slate-900/80">
          {sql}
        </pre>
      )}
    </div>
  );
};
