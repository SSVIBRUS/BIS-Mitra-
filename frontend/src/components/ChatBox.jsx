import React, { useEffect, useRef } from 'react';
import SourceBadge from './SourceBadge';
import { User, Bot, Loader2 } from './icons';

export default function ChatBox({ messages, loading, onClear, onOpenChatPDF }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Format simple markdown bold and bullet points
  const formatText = (text) => {
    if (!text) return '';
    
    // Convert **bold** to strong
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Split into lines
    const lines = formatted.split('\n');

    return lines.map((line, i) => {
      if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
        return (
          <li key={i} className="ml-4 list-disc text-slate-800 my-1" dangerouslySetInnerHTML={{ __html: line.replace(/^[\•\-]\s*/, '') }} />
        );
      }
      return (
        <p key={i} className="mb-2 text-slate-800 leading-relaxed text-lg" dangerouslySetInnerHTML={{ __html: line }} />
      );
    });
  };

  return (
    <div className="bg-[#f8fafc] rounded-2xl shadow-md border border-slate-200 p-4 sm:p-6 mb-6 flex flex-col h-[520px] relative overflow-hidden">
      {messages.length > 0 && (
        <div className="flex justify-end mb-2 shrink-0">
          <button
            type="button"
            onClick={() => { if (onClear) onClear(); }}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border transition flex items-center gap-1.5 cursor-pointer bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 border-slate-200 hover:border-red-300 shadow-xs"
            title="Clear all chat messages"
          >
            <span>🗑️</span>
            <span>Clear Chat</span>
          </button>
        </div>
      )}
      <div className="flex-1 overflow-y-auto pr-2 space-y-6 relative z-10">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-600">Welcome To BIS Mitra</h2>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 sm:gap-4 ${
                msg.type === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {/* Bot Avatar */}
              {msg.type === 'bot' && (
                <div className="w-10 h-10 rounded-xl bg-slate-800 text-emerald-400 flex items-center justify-center shrink-0 font-bold shadow-sm mt-1 border border-slate-700">
                  <Bot className="w-6 h-6" />
                </div>
              )}

              {/* Message Content Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 sm:p-5 shadow-sm border text-lg ${
                  msg.type === 'user'
                    ? 'bg-slate-800 text-slate-50 border-slate-700 rounded-tr-none font-medium'
                    : 'bg-white text-slate-900 border-slate-200 rounded-tl-none shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="font-bold text-xs uppercase tracking-wider opacity-70">
                    {msg.type === 'user' ? 'You Asked:' : 'BIS Official Assistant:'}
                  </div>

                  {msg.type === 'bot' && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        const prevUserMsg = messages.slice(0, idx).reverse().find(m => m.type === 'user');
                        const userQ = msg.userQuestion || (prevUserMsg ? prevUserMsg.text : 'User Question');
                        if (onOpenChatPDF) {
                          onOpenChatPDF({ question: userQ, answer: msg.text, sources: msg.sources || [] });
                        }
                      }}
                      className="text-xs font-bold px-2 py-1 rounded-lg border transition flex items-center gap-1 cursor-pointer bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300"
                      title="Generate & Save PDF Summary"
                    >
                      <span>📄</span>
                      <span>PDF Summary</span>
                    </button>
                  )}
                </div>

                {msg.type === 'user' ? (
                  <p className="text-xl font-medium leading-normal">{msg.text}</p>
                ) : (
                  <div>
                    <div className="prose max-w-none text-slate-800">
                      {formatText(msg.text)}
                    </div>
                    {/* Source citations */}
                    <SourceBadge sources={msg.sources} />
                  </div>
                )}
              </div>

              {/* User Avatar */}
              {msg.type === 'user' && (
                <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center shrink-0 font-bold shadow-md mt-1">
                  <User className="w-6 h-6" />
                </div>
              )}
            </div>
          ))
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex gap-4 items-center bg-slate-50 border border-slate-200 p-4 rounded-2xl text-slate-700 text-lg">
            <Loader2 className="w-6 h-6 text-emerald-600 animate-spin shrink-0" />
            <span className="font-medium">Searching verified BIS records on bis.gov.in...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
