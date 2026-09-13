import React from 'react';
import { ExternalLink, ShieldCheck } from './icons';

export default function SourceBadge({ sources }) {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-4 pt-3 border-t border-slate-200 text-sm">
      <div className="flex items-center gap-1.5 font-bold text-slate-700 mb-2">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>Verified Sources from Official BIS Records:</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {sources.map((src, idx) => (
          <a
            key={idx}
            href={src.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 bg-slate-100 hover:bg-emerald-50 text-slate-800 hover:text-emerald-700 px-3 py-1.5 rounded-lg border border-slate-300 font-medium transition-colors text-xs sm:text-sm"
            title={src.excerpt}
          >
            <span>This came from: {src.title}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        ))}
      </div>
    </div>
  );
}
