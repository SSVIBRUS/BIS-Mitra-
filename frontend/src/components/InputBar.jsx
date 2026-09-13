import React, { useState, useEffect } from 'react';
import { Send, Mic, MicOff } from './icons';

export default function InputBar({ onSend, loading }) {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    // Initialize Web Speech API if supported by browser
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-IN'; // Default to Indian English context

      rec.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      rec.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      setRecognition(rec);
    }
  }, []);

  const handleVoiceInput = () => {
    if (!recognition) {
      alert('Speech recognition is not supported in this browser. Please use Google Chrome or Edge.');
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setInput('');
      setIsListening(true);
      try {
        recognition.start();
      } catch (err) {
        setIsListening(false);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    onSend(input.trim());
    setInput('');
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto">
      <div className="relative flex items-center bg-white rounded-2xl shadow-lg border-2 border-slate-300 focus-within:border-emerald-600 transition p-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isListening ? "Listening... Speak your question now" : "Ask your question about Indian Standards or BIS services..."}
          disabled={loading}
          className="flex-1 px-4 py-3 text-lg md:text-xl text-slate-900 bg-transparent focus:outline-none placeholder-slate-400 min-h-[54px]"
        />

        <div className="flex items-center gap-2 pr-1">
          {/* Speech-to-Text Voice Button */}
          <button
            type="button"
            onClick={handleVoiceInput}
            title={isListening ? "Stop Listening" : "Speak your question (Voice Input)"}
            className={`p-3 rounded-xl transition flex items-center justify-center ${
              isListening
                ? 'bg-red-500 text-white animate-pulse'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>

          {/* Send Button ("Ask") */}
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-xl text-lg flex items-center gap-2 transition shrink-0 min-h-[54px]"
          >
            <span>Ask</span>
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </form>
  );
}
