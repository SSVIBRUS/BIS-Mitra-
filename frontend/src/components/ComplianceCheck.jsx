import React, { useState } from 'react';
import { Search, AlertTriangle, CheckCircle2, XCircle, ExternalLink, X } from './icons';

export default function ComplianceCheck({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  if (!isOpen) return null;

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`/api/compliance/check?product=${encodeURIComponent(query.trim())}`);
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({
        success: false,
        error: "Unable to check compliance right now. Please verify your internet connection."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 sm:p-8 border border-slate-200 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-2 rounded-lg hover:bg-slate-100 transition"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xl">
            🔍
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Product Compliance Lookup</h2>
            <p className="text-base text-slate-600">Check if your product requires mandatory BIS / ISI certification</p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Helmet, Packaged Water, Toys, LED Bulb..."
              className="flex-1 px-4 py-3 border-2 border-slate-300 rounded-xl focus:outline-none focus:border-orange-500 text-lg bg-slate-50"
              autoFocus
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-bold text-lg flex items-center gap-2 transition"
            >
              {loading ? 'Searching...' : 'Check'}
            </button>
          </div>
        </form>

        {/* Quick Suggestion Chips */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Popular:</span>
          {['Helmet', 'Packaged Water', 'Pressure Cooker', 'Toys', 'LED Bulb', 'Gold'].map((item) => (
            <button
              key={item}
              onClick={() => { setQuery(item); }}
              className="text-xs bg-slate-100 hover:bg-orange-50 hover:text-orange-700 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 transition font-medium"
            >
              {item}
            </button>
          ))}
        </div>

        {/* Results Display */}
        {result && (
          <div className="mt-4 p-5 rounded-xl border border-slate-200 bg-slate-50">
            {result.found ? (
              <div>
                <div className="flex items-center gap-3 mb-3">
                  {result.isMandatory ? (
                    <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg font-bold text-sm">
                      <AlertTriangle className="w-5 h-5 shrink-0" />
                      <span>MANDATORY QUALITY CONTROL ORDER (QCO) IN EFFECT</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg font-bold text-sm">
                      <CheckCircle2 className="w-5 h-5 shrink-0" />
                      <span>VOLUNTARY STANDARD</span>
                    </div>
                  )}
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-1">{result.productName}</h3>
                <p className="text-base text-slate-700 font-semibold mb-3">
                  Applicable Standard: <span className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded font-mono text-sm">{result.isCode}</span>
                </p>

                <div className="space-y-2 text-base text-slate-700 mb-4 bg-white p-3 rounded-lg border border-slate-200">
                  <p><strong>Certification Scheme:</strong> {result.scheme}</p>
                  <p><strong>Regulating Authority:</strong> {result.ministry}</p>
                  <p className="pt-2 text-slate-600 text-sm">{result.summary}</p>
                </div>

                <a
                  href={result.officialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-bold text-base hover:underline"
                >
                  <span>View Official BIS Mandatory List</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            ) : (
              <div className="text-center py-4">
                <XCircle className="w-10 h-10 text-amber-500 mx-auto mb-2" />
                <h4 className="font-bold text-slate-900 text-lg mb-1">Standard Entry Not Found</h4>
                <p className="text-slate-600 text-sm mb-3">{result.message}</p>
                <a
                  href="https://www.manakonline.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-blue-600 font-bold text-sm hover:underline"
                >
                  <span>Check Manakonline Directory</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
