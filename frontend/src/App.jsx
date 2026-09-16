import React, { useState, useEffect } from 'react';
import ChatBox from './components/ChatBox';
import InputBar from './components/InputBar';
import ComplianceCheck from './components/ComplianceCheck';
import VisionScanner from './components/VisionScanner';
import ChatPDFSummaryModal from './components/ChatPDFSummaryModal';

const TRANSLATIONS = {
  en: {
    title: "BIS Mitra",
    subtitle: "Official Assistant for Indian Standards & BIS Services",
    checkBtn: "🔍 Is My Product Certified?",
    scanBtn: "📷 Vision AI Scan Mark",
    langLabel: "🌐 Language:",
    industryLabel: "⚙️ Industry Sector Filter:",
    welcomeTitle: "Welcome to BIS Mitra",
    welcomeDesc: "Ask any question about Indian Standards (IS), ISI Mark, CRS registration, Gold Hallmarking, or Quality Control Orders (QCOs).",
    footerText: "© Bureau of Indian Standards (BIS) Mitra — Quality & Compliance Portal"
  },
  hi: {
    title: "बीआईएस मित्र",
    subtitle: "भारतीय मानकों और बीआईएस सेवाओं के लिए आधिकारिक सहायक",
    checkBtn: "🔍 क्या मेरा उत्पाद प्रमाणित है?",
    scanBtn: "📷 विज़न एआई स्कैन मार्क",
    langLabel: "🌐 भाषा / Language:",
    industryLabel: "⚙️ उद्योग क्षेत्र फ़िल्टर:",
    welcomeTitle: "बीआईएस मित्र में आपका स्वागत है",
    welcomeDesc: "भारतीय मानकों (आईएस), आईएसआई मार्क, सीआरएस पंजीकरण, गोल्ड हॉलमार्किंग या गुणवत्ता नियंत्रण आदेशों (क्यूसीओ) के बारे में कोई भी प्रश्न पूछें।",
    footerText: "© भारतीय मानक ब्यूरो (बीआईएस) मित्र — गुणवत्ता एवं अनुपालन पोर्टल"
  }
};

export default function App() {
  const [lang, setLang] = useState('en');
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('bis_theme') === 'dark';
  });
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState('All');
  const [isCheckModalOpen, setIsCheckModalOpen] = useState(false);
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [isChatPDFOpen, setIsChatPDFOpen] = useState(false);
  const [chatPDFData, setChatPDFData] = useState(null);

  useEffect(() => {
    localStorage.setItem('bis_theme', darkMode ? 'dark' : 'light');
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const handleSend = async (questionText) => {
    if (!questionText || loading) return;

    setMessages((prev) => [...prev, { type: 'user', text: questionText }]);
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: questionText, category, lang })
      });

      const data = await response.json();

      if (data.success) {
        setMessages((prev) => [
          ...prev,
          {
            type: 'bot',
            text: data.answer,
            sources: data.sources || [],
            userQuestion: questionText
          }
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            type: 'bot',
            text: "Sorry, I couldn't process your query. Please try asking again.",
            sources: []
          }
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          type: 'bot',
          text: "Connection error. Please check if the backend server is running.",
          sources: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col justify-between transition-colors duration-200 relative ${
      darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'
    }`}>
      {/* Top-Right Corner Dark Mode Toggle Icon */}
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); setDarkMode(!darkMode); }}
        className={`fixed top-4 right-4 z-50 p-3 rounded-full shadow-2xl border transition-all flex items-center justify-center cursor-pointer text-xl hover:scale-110 active:scale-95 ${
          darkMode
            ? 'bg-slate-800 text-amber-300 border-slate-700 hover:bg-slate-700'
            : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100'
        }`}
        title="Toggle Dark & Light Mode"
      >
        <span>{darkMode ? '☀️' : '🌙'}</span>
      </button>

      {/* Header */}
      <header className="bg-slate-900 text-white shadow-xl border-b-4 border-emerald-500 pr-16 md:pr-4">
        <div className="max-w-6xl mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/logo.jpg" alt="BIS Mitra Logo" className="w-12 h-12 rounded-xl object-cover shadow-lg border-2 border-emerald-500 shrink-0" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
                {t.title}
              </h1>
              <p className="text-slate-300 text-sm sm:text-base font-medium">
                {t.subtitle}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); setIsScanModalOpen(true); }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-base flex items-center gap-2 transition shadow-lg border border-emerald-500 shrink-0 cursor-pointer"
            >
              <span>{t.scanBtn}</span>
            </button>

            <button
              type="button"
              onClick={(e) => { e.preventDefault(); setIsCheckModalOpen(true); }}
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-4 py-2 rounded-xl text-base flex items-center gap-2 transition shadow-lg border border-orange-500 shrink-0 cursor-pointer"
            >
              <span>{t.checkBtn}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto w-full px-4 py-6 flex-1">
        <div className={`rounded-2xl p-4 shadow-md border mb-6 flex flex-wrap items-center justify-between gap-4 ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className={`flex items-center gap-2 font-bold text-lg ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
            <span>{t.industryLabel}</span>
          </div>

          <div className="flex items-center gap-2 flex-1 max-w-xs">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`w-full border-2 rounded-xl px-4 py-2 font-semibold focus:outline-none text-lg cursor-pointer ${
                darkMode
                  ? 'bg-slate-950 border-slate-700 text-slate-100 focus:border-emerald-500'
                  : 'bg-slate-50 border-slate-300 text-slate-800 focus:border-emerald-600'
              }`}
            >
              <option value="All">All Industries</option>
              <option value="Food & Beverages">Food & Beverages</option>
              <option value="Electronics">Electronics & IT</option>
              <option value="Safety">Safety & Automotive</option>
              <option value="Consumer Goods">Consumer Goods & Toys</option>
              <option value="Steel">Steel & Construction</option>
              <option value="Precious Metals">Precious Metals & Hallmarking</option>
            </select>
          </div>
        </div>

        <ChatBox
          messages={messages}
          loading={loading}
          t={t}
          darkMode={darkMode}
          onClear={() => setMessages([])}
          onOpenChatPDF={(data) => { setChatPDFData(data); setIsChatPDFOpen(true); }}
        />
        <InputBar onSend={handleSend} loading={loading} t={t} darkMode={darkMode} />
      </main>

      <ComplianceCheck
        isOpen={isCheckModalOpen}
        onClose={() => setIsCheckModalOpen(false)}
        t={t}
        darkMode={darkMode}
      />

      <VisionScanner
        isOpen={isScanModalOpen}
        onClose={() => setIsScanModalOpen(false)}
        t={t}
        darkMode={darkMode}
      />

      <ChatPDFSummaryModal
        isOpen={isChatPDFOpen}
        onClose={() => { setIsChatPDFOpen(false); setChatPDFData(null); }}
        data={chatPDFData}
        darkMode={darkMode}
        t={t}
      />

      <footer className={`py-4 px-4 text-center border-t text-sm mt-8 ${
        darkMode ? 'bg-slate-950 text-slate-500 border-slate-900' : 'bg-slate-900 text-slate-400 border-slate-800'
      }`}>
        <p>{t.footerText}</p>
      </footer>
    </div>
  );
}
