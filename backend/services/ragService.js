const fs = require('fs');
const path = require('path');

// Load Knowledge Base Data
const standardsPath = path.join(__dirname, '../data/bis-standards.json');
const faqsPath = path.join(__dirname, '../data/bis-faqs.json');
const productsPath = path.join(__dirname, '../data/bis-products.json');

let standards = [];
let faqs = [];
let products = [];

try {
  standards = JSON.parse(fs.readFileSync(standardsPath, 'utf8'));
  faqs = JSON.parse(fs.readFileSync(faqsPath, 'utf8'));
  products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
} catch (err) {
  console.error("Error loading knowledge base JSONs:", err);
}

// Multilingual Keyword Synonym Map for Indian Languages
const MULTILINGUAL_SYNONYMS = {
  helmet: ["helmet", "हेलमेट", "हेल्मेट", "ஹெல்மெட்", "హెల్మెట్", "হেলমেট", "હેલ્મેટ", "ಹೆಲ್ಮೆಟ್", "ഹെൽമെറ്റ്", "ਹੈਲਮੈਟ"],
  water: ["water", "पानी", "जल", "தண்ணீர்", "நீர்", "నీరు", "पाणी", "জল", "પાણી", "ਨੀਰ", "પાણી", "ପାଣି"],
  cooker: ["cooker", "कुकर", "குக்கர்", "కుక్కర్", "कुकर", "কুকার", "કુકર", "ਕੂਕਰ"],
  toys: ["toys", "toy", "खिलौने", "खिलौना", "பொம்மைகள்", "బొమ్మలు", "खेळणी", "খেলনা", "રમકડાં", "ਖਿਡੌਣੇ"],
  led: ["led", "bulb", "lamp", "एलईडी", "बल्ब", "பல்ப்", "బల్బు", "બલ્બ", "বাল্ব", "ਦੀਵਾ"],
  gold: ["gold", "hallmark", "huid", "सोना", "सोने", "दुकान", "தங்கம்", "బంగారం", "सोने", "সোনা", "સોનું", "ਸੋਨਾ", "ସୁନା"],
  steel: ["steel", "tmt", "rebar", "स्टील", "सरिया", "எஃகு", "స్టీల్", "पोलाद", "ইস্পাত", "સ્ટીલ", "ਇਸਪਾਤ"],
  cement: ["cement", "सीमेंट", "சிமெண்ட்", "సిమెంట్", "सिमेंट", "સિમેન્ટ", "ਸਿਮਿੰਟ", "ସିମେଣ୍ଟ"],
  charger: ["charger", "adapter", "चार्ज", "चाजर", "சார்ஜர்", "ఛార్జర్", "ચાર્જર"]
};

// Tokenize and clean string (supporting Indian Unicode characters)
function tokenize(text) {
  if (!text) return [];
  // Keep English letters, numbers, and Indian Unicode scripts
  return text.toLowerCase()
    .replace(/[^\w\s\u0900-\u097F\u0B80-\u0BFF\u0C00-\u0C7F\u0980-\u09FF\u0A80-\u0AFF\u0C80-\u0CFF\u0D00-\u0D7F\u0A00-\u0A7F\u0B00-\u0B7F]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length >= 2);
}

// Expand tokens with English equivalents if matching Indian Language synonyms
function expandQueryTokens(tokens) {
  const expanded = new Set(tokens);
  for (const token of tokens) {
    for (const [englishKey, synonyms] of Object.entries(MULTILINGUAL_SYNONYMS)) {
      if (synonyms.some(syn => syn.toLowerCase() === token || token.includes(syn.toLowerCase()))) {
        expanded.add(englishKey);
        synonyms.forEach(s => expanded.add(s.toLowerCase()));
      }
    }
  }
  return Array.from(expanded);
}

// Score text relevance against expanded query tokens
function scoreText(queryTokens, targetText, keywords = []) {
  if (!targetText) return 0;
  const targetTokens = tokenize(targetText);
  let score = 0;

  for (const token of queryTokens) {
    if (targetTokens.includes(token)) {
      score += 3;
    }
    for (const kw of keywords) {
      if (kw.toLowerCase().includes(token) || token.includes(kw.toLowerCase())) {
        score += 4;
      }
    }
  }
  return score;
}

/**
 * Main RAG Search & Synthesis Engine
 * @param {string} userQuestion - Question asked by user
 * @param {string} categoryFilter - Optional sector filter
 * @param {string} lang - Selected language code ('en', 'hi', 'ta', 'te', 'mr', 'bn', 'gu', 'kn', 'ml', 'pa', 'or')
 */
async function processQuery(userQuestion, categoryFilter = "All", lang = "en") {
  const rawTokens = tokenize(userQuestion);
  const queryTokens = expandQueryTokens(rawTokens);
  let matches = [];

  // Filter standards if category selected
  let filteredStandards = standards;
  if (categoryFilter && categoryFilter !== "All") {
    filteredStandards = standards.filter(s => 
      s.category.toLowerCase().includes(categoryFilter.toLowerCase())
    );
  }

  // 1. Search Standards
  for (const std of filteredStandards) {
    const textToMatch = `${std.is_code} ${std.title} ${std.description} ${std.qco_details} ${std.application_steps.join(' ')}`;
    const score = scoreText(queryTokens, textToMatch, std.keywords);
    if (score > 0) {
      matches.push({
        type: 'standard',
        score,
        data: std,
        source: {
          title: `${std.is_code} - ${std.title}`,
          url: std.official_url,
          excerpt: std.description.substring(0, 160) + '...'
        }
      });
    }
  }

  // 2. Search FAQs
  for (const faq of faqs) {
    const textToMatch = `${faq.question} ${faq.answer}`;
    const score = scoreText(queryTokens, textToMatch, faq.keywords);
    if (score > 0) {
      matches.push({
        type: 'faq',
        score,
        data: faq,
        source: {
          title: `BIS Official Process Guide - ${faq.question}`,
          url: faq.source_url,
          excerpt: faq.answer.substring(0, 160) + '...'
        }
      });
    }
  }

  // 3. Search Products
  for (const prod of products) {
    const textToMatch = `${prod.product_name} ${prod.aliases.join(' ')} ${prod.summary} ${prod.is_code}`;
    const score = scoreText(queryTokens, textToMatch, prod.aliases);
    if (score > 0) {
      matches.push({
        type: 'product',
        score: score + 3,
        data: prod,
        source: {
          title: `BIS Compulsory Certification List: ${prod.product_name} (${prod.is_code})`,
          url: prod.official_link,
          excerpt: prod.summary
        }
      });
    }
  }

  // Sort by score descending
  matches.sort((a, b) => b.score - a.score);

  const NO_MATCH_TRANSLATIONS = {
    hi: "वर्तमान बीआईएस रिकॉर्ड में आपके इस प्रश्न का सीधा उत्तर नहीं मिला। हालांकि, बीआईएस 17 विभागों में 21,890+ भारतीय मानकों का प्रबंधन करता है। आप बीआईएस पोर्टल bis.gov.in पर अपने उत्पाद की स्थिति या मानक कोड खोज सकते हैं।",
    ta: "தற்போதைய BIS பதிவுகளில் உங்களுக்கான நேரடி பதில் கிடைக்கவில்லை. இருப்பினும், BIS 21,890+ இந்திய தரநிலைகளை நிர்வகிக்கிறது. bis.gov.in இல் உங்கள் தயாரிப்பு நிலையை சரிபார்க்கலாம்.",
    te: "ప్రస్తుత BIS రికార్డులలో మీ ప్రశ్నకు సరైన సమాధానం దొరకలేదు. అయినప్పటికీ, BIS 21,890+ భారతీయ ప్రమాణాలను పర్యవేక్షిస్తుంది. వివరాల కోసం bis.gov.in చూడండి.",
    mr: "सध्याच्या बीआयएस रेकॉर्डमध्ये तुमच्या या प्रश्नाचे थेट उत्तर आढळले नाही. बीआयएस १७ विभागांमध्ये २१,८९०+ मानकांचे व्यवस्थापन करते. तुम्ही bis.gov.in वर तुमच्या उत्पादनाची माहिती शोधू शकता.",
    bn: "বর্তমান বিআইএস রেকর্ডে আপনার প্রশ্নের সরাসরি উত্তর পাওয়া যায়নি। বিআইএস ২১,৮৯০+ ভারতীয় মান পরিচালনা করে। আপনার পণ্যের বিবরণ দেখতে bis.gov.in দেখুন।",
    gu: "વર્તમાન BIS રેકોર્ડમાં તમારા પ્રશ્નનો ઉત્તર મળ્યો નથી. BIS 21,890+ ધોરણોનું સંચાલન કરે છે. તમે bis.gov.in પર તમારી પ્રોડક્ટની સ્થિતિ ચકાસી શકો છો.",
    kn: "ಪ್ರಸ್ತುತ BIS ದಾಖಲೆಗಳಲ್ಲಿ ನಿಮ್ಮ ಪ್ರಶ್ನೆಗೆ ನೇರ ಉತ್ತರ ಕಂಡುಬಂದಿಲ್ಲ. BIS 21,890+ ಭಾರತೀಯ ಮಾನದಂಡಗಳನ್ನು ನಿರ್ವಹಿಸುತ್ತದೆ. bis.gov.in ನಲ್ಲಿ ನಿಮ್ಮ ಉತ್ಪನ್ನ ಪರಿಶೀಲಿಸಿ.",
    ml: "നിലവിലെ BIS റെക്കോർഡുകളിൽ നിങ്ങളുടെ ചോദ്യത്തിന് നേരിട്ടുള്ള ഉത്തരം ലഭ്യമല്ല. BIS 21,890+ സ്റ്റാൻഡേർഡുകൾ കൈകാര്യം ചെയ്യുന്നു. വിവരങ്ങൾക്ക് bis.gov.in കാണുക.",
    pa: "ਮੌਜੂਦਾ BIS ਰਿਕਾਰਡਾਂ ਵਿੱਚ ਤੁਹਾਡੇ ਸਵਾਲ ਦਾ ਜਵਾਬ ਨਹੀਂ ਮਿਲਿਆ। BIS 21,890+ ਭਾਰਤੀ ਮਾਪਦੰਡਾਂ ਦਾ ਪ੍ਰਬੰਧਨ ਕਰਦਾ ਹੈ। bis.gov.in 'ਤੇ ਆਪਣੇ ਉਤਪਾਦ ਦੀ ਜਾਂਚ ਕਰੋ।",
    or: "ବର୍ତ୍ତମାନର BIS ରେକର୍ଡରେ ଆପଣଙ୍କ ପ୍ରଶ୍ନର ଉତ୍ତର ମିଳିଲା ନାହିଁ। BIS ୨୧,୮୯୦+ ଭାରତୀୟ ମାନକ ପରିଚାଳନା କରେ। bis.gov.in ରେ ଆପଣଙ୍କ ଉତ୍ପାଦ ଯାଞ୍ଚ କରନ୍ତୁ।",
    en: "I couldn't find an exact match in the current BIS records for your specific question. However, BIS manages over 21,890+ Indian Standards across 17 departments. You can check your product status on the official website bis.gov.in or search for standard codes directly."
  };

  if (matches.length === 0) {
    const fallbackAnswer = NO_MATCH_TRANSLATIONS[lang] || NO_MATCH_TRANSLATIONS.en;
    return {
      success: true,
      answer: fallbackAnswer,
      sources: [
        {
          title: "Bureau of Indian Standards Official Portal",
          url: "https://www.bis.gov.in",
          excerpt: "Search 21,890+ Indian Standards and official notifications."
        }
      ],
      relatedStandards: ["IS 14543:2016 (Packaged Water)", "IS 4151:2015 (Helmets)", "IS 16102 (LED Bulbs)"],
      confidence: "low"
    };
  }

  const topMatch = matches[0];
  const topSources = matches.slice(0, 3).map(m => m.source);

  const LABELS = {
    hi: {
      category: "श्रेणी",
      scheme: "प्रमाणन योजना",
      status: "अनिवार्य स्थिति",
      mandatory: "🚨 अनिवार्य गुणवत्ता नियंत्रण आदेश (QCO) लागू",
      voluntary: "स्वैच्छिक मानक",
      desc: "विवरण",
      steps: "लाइसेंस प्राप्त करने की प्रक्रिया (चरण-दर-चरण)",
      fees: "शुल्क संरचना",
      isMandatory: "क्या बीआईएस प्रमाणन अनिवार्य है?",
      yesMandatory: "हाँ 🚨 (कानून द्वारा अनिवार्य)",
      noVoluntary: "नहीं (स्वैच्छिक)",
      std: "लागू मानक",
      ministry: "नियामक मंत्रालय",
      summary: "उत्पाद सारांश"
    },
    ta: {
      category: "வகை",
      scheme: "சான்றிதழ் திட்டம்",
      status: "கட்டாய நிலை",
      mandatory: "🚨 கட்டாய தரக் கட்டுப்பாட்டு உத்தரவு (QCO) அமலில் உள்ளது",
      voluntary: "தன்னார்வ தரநிலை",
      desc: "விளக்கம்",
      steps: "உரிமம் பெறும் முறை",
      fees: "கட்டண விவரங்கள்",
      isMandatory: "BIS சான்றிதழ் கட்டாயமா?",
      yesMandatory: "ஆம் 🚨 (சட்டப்படி கட்டாயம்)",
      noVoluntary: "இல்லை (தன்னார்வம்)",
      std: "பொருந்தக்கூடிய தரநிலை",
      ministry: "ஒழுங்குமுறை அமைச்சகம்",
      summary: "தயாரிப்பு சுருக்கம்"
    },
    te: {
      category: "వర్గం",
      scheme: "సర్టిఫికేషన్ పథకం",
      status: "నిర్బంధ స్థితి",
      mandatory: "🚨 నిర్బంధ నాణ్యతా నియంత్రణ ఉత్తర్వు (QCO) అమలులో ఉంది",
      voluntary: "స్వచ్ఛంద ప్రమాణం",
      desc: "వివరణ",
      steps: "లైసెన్స్ పొందే విధానం",
      fees: "రుసుము వివరాలు",
      isMandatory: "BIS సర్టిఫికేషన్ నిర్బంధమా?",
      yesMandatory: "అవును 🚨 (చట్టప్రకారం నిర్బంధం)",
      noVoluntary: "కాదు (స్వచ్ఛందం)",
      std: "వర్తించే ప్రమాణం",
      ministry: "నియంత్రణ మంత్రిత్వ శాఖ",
      summary: "ఉత్పత్తి సారాంశం"
    },
    mr: {
      category: "वर्ग",
      scheme: "प्रमाणपत्र योजना",
      status: "अनिवार्यता",
      mandatory: "🚨 अनिवार्य गुणवत्ता नियंत्रण आदेश (QCO) लागू",
      voluntary: "ऐच्छिक मानक",
      desc: "वर्णन",
      steps: "परवाना मिळविण्याची प्रक्रिया",
      fees: "शुल्क रचना",
      isMandatory: "BIS प्रमाणपत्र अनिवार्य आहे का?",
      yesMandatory: "होय 🚨 (कायद्याने अनिवार्य)",
      noVoluntary: "नाही (ऐच्छिक)",
      std: "लागू मानक",
      ministry: "नियामक मंत्रालय",
      summary: "उत्पाद सारांश"
    },
    bn: {
      category: "বিভাগ",
      scheme: "সার্টিফিকেশন স্কিম",
      status: "বাধ্যতামূলক অবস্থা",
      mandatory: "🚨 বাধ্যতামূলক মান নিয়ন্ত্রণ আদেশ (QCO) কার্যকর",
      voluntary: "ঐচ্ছিক মানদণ্ড",
      desc: "বিবরণ",
      steps: "লাইসেন্স প্রাপ্তির ধাপ",
      fees: "ফি কাঠামো",
      isMandatory: "BIS সার্টিফিকেশন কি বাধ্যতামূলক?",
      yesMandatory: "হ্যাঁ 🚨 (আইনত বাধ্যতামূলক)",
      noVoluntary: "না (ঐচ্ছিক)",
      std: "প্রযোজ্য মান",
      ministry: "নিয়ন্ত্রক মন্ত্রণালয়",
      summary: "পণ্য সারাংশ"
    },
    gu: {
      category: "કેટેગરી",
      scheme: "સર્ટિફિકેશન સ્કીમ",
      status: "ફરજિયાત સ્થિતિ",
      mandatory: "🚨 ફરજિયાત ક્વોલિટી કંટ્રોલ ઓર્ડર (QCO) અમલમાં છે",
      voluntary: "મરજીયાત ધોરણ",
      desc: "વર્ણન",
      steps: "લાઈસન્સ મેળવવાની પ્રક્રિયા",
      fees: "ફીનું માળખું",
      isMandatory: "શું BIS સર્ટિફિકેશન ફરજિયાત છે?",
      yesMandatory: "હા 🚨 (કાયદાકીય રીતે ફરજિયાત)",
      noVoluntary: "ના (મરજીયાત)",
      std: "લાગુ ધોરણ",
      ministry: "નિયમનકારી મંત્રાલય",
      summary: "પ્રોડક્ટ સારાંશ"
    },
    kn: {
      category: "ವರ್ಗ",
      scheme: "ಪ್ರಮಾಣೀಕರಣ ಯೋಜನೆ",
      status: "ಕಡ್ಡಾಯ ಸ್ಥಿತಿ",
      mandatory: "🚨 ಕಡ್ಡಾಯ ಗುಣಮಟ್ಟ ನಿಯಂತ್ರಣ ಆದೇಶ (QCO) ಜಾರಿಯಲ್ಲಿದೆ",
      voluntary: "ಐಚ್ಛಿಕ ಮಾನದಂಡ",
      desc: "ವಿವರಣೆ",
      steps: "ಲೈಸೆನ್ಸ್ ಪಡೆಯುವ ವಿಧಾನ",
      fees: "ಶುಲ್ಕ ವಿವರ",
      isMandatory: "BIS ಪ್ರಮಾಣೀಕರಣ ಕಡ್ಡಾಯವೇ?",
      yesMandatory: "ಹೌದು 🚨 (ಕಾನೂನುಬದ್ಧವಾಗಿ ಕಡ್ಡಾಯ)",
      noVoluntary: "ಇಲ್ಲ (ಐಚ್ಛಿಕ)",
      std: "ಅನ್ವಯವಾಗುವ ಮಾನದಂಡ",
      ministry: "ನಿಯಂತ್ರಣ ಸಚಿವಾಲಯ",
      summary: "ಉತ್ಪನ್ನ ಸಾರಾಂಶ"
    },
    ml: {
      category: "വിഭാഗം",
      scheme: "സർട്ടിഫിക്കേഷൻ സ്കീം",
      status: "നിർബന്ധിത പദവി",
      mandatory: "🚨 നിർബന്ധിത ക്വാളിറ്റി കൺട്രോൾ ഓർഡർ (QCO) നിലവിലുണ്ട്",
      voluntary: "ഐച്ഛിക സ്റ്റാൻഡേർഡ്",
      desc: "വിവരണം",
      steps: "ലൈസൻസ് ലഭിക്കുന്നതിനുള്ള നടപടികൾ",
      fees: "ഫീസ് ഘടന",
      isMandatory: "BIS സർട്ടിഫിക്കേഷൻ നിർബന്ധമാണോ?",
      yesMandatory: "അതെ 🚨 (നിയമപരമായി നിർബന്ധം)",
      noVoluntary: "അല്ല (ഐച്ഛികം)",
      std: "ബാധകമായ സ്റ്റാൻഡേർഡ്",
      ministry: "റെഗുലേറ്ററി മന്ത്രാലയം",
      summary: "ഉൽപ്പന്ന ചുരുക്കം"
    },
    pa: {
      category: "ਸ਼੍ਰੇਣੀ",
      scheme: "ਪ੍ਰਮਾਣੀਕਰਣ ਸਕੀਮ",
      status: "ਲਾਜ਼ਮੀ ਸਥਿਤੀ",
      mandatory: "🚨 ਲਾਜ਼ਮੀ ਗੁਣਵੱਤਾ ਨਿਯੰਤਰਣ ਆਦੇਸ਼ (QCO) ਲਾਗੂ",
      voluntary: "ਮਰਜ਼ੀ ਵਾਲਾ ਮਾਪਦੰਡ",
      desc: "ਵੇਰਵਾ",
      steps: "ਲਾਇਸੈਂਸ ਪ੍ਰਾਪਤ ਕਰਨ ਦੀ ਪ੍ਰਕਿਰਿਆ",
      fees: "ਫੀਸ ਢਾਂਚਾ",
      isMandatory: "ਕੀ BIS ਪ੍ਰਮਾਣੀਕਰਣ ਲਾਜ਼ਮੀ ਹੈ?",
      yesMandatory: "ਹਾਂ 🚨 (ਕਾਨੂੰਨਨ ਲਾਜ਼ਮੀ)",
      noVoluntary: "ਨਹੀਂ (ਮਰਜ਼ੀ ਵਾਲਾ)",
      std: "ਲਾਗੂ ਮਾਪਦੰਡ",
      ministry: "ਨਿਯਮਕ ਮੰਤਰਾਲਾ",
      summary: "ਉਤਪਾਦ ਸੰਖੇਪ"
    },
    or: {
      category: "ବର୍ଗ",
      scheme: "ପ୍ରମାଣପତ୍ର ଯୋଜନା",
      status: "ବାଧ୍ୟତାମୂଳକ ସ୍ଥିତି",
      mandatory: "🚨 ବାଧ୍ୟତାମୂଳକ ଗୁଣବତ୍ତା ନିୟନ୍ତ୍ରଣ ଆଦେଶ (QCO) ଲାଗୁ",
      voluntary: "ଇଚ୍ଛାଧୀନ ମାନକ",
      desc: "ବିବରଣୀ",
      steps: "ଲାଇସେନ୍ସ ପାଇବାର ପ୍ରକ୍ରିୟା",
      fees: "ଫିସ ଢାଞ୍ଚା",
      isMandatory: "BIS ପ୍ରମାଣପତ୍ର ବାଧ୍ୟତାମୂଳକ କି?",
      yesMandatory: "ହଁ 🚨 (ଆଇନଗତ ଭାବେ ବାଧ୍ୟତାମୂଳକ)",
      noVoluntary: "ନାହିଁ (ଇଚ୍ଛାଧୀନ)",
      std: "ଲାଗୁ ହେଉଥିବା ମାନକ",
      ministry: "ନିୟାମକ ମନ୍ତ୍ରଣାଳୟ",
      summary: "ଉତ୍ପାଦ ସାରାଂଶ"
    },
    en: {
      category: "Category",
      scheme: "Certification Scheme",
      status: "Mandatory Status",
      mandatory: "🚨 Mandatory (Quality Control Order in Effect)",
      voluntary: "Voluntary Standard",
      desc: "Description",
      steps: "How to Get License (Step-by-Step)",
      fees: "Fees Structure",
      isMandatory: "Is BIS Certification Mandatory?",
      yesMandatory: "YES 🚨 (Compulsory by Law)",
      noVoluntary: "No (Voluntary)",
      std: "Applicable Standard",
      ministry: "Regulating Ministry",
      summary: "Summary"
    }
  };

  const FAQ_TRANSLATIONS = {
    "What is the difference between ISI Mark (Scheme-I) and CRS (Scheme-II)?": {
      hi: "आईएसआई मार्क (स्कीम-I) हेलमेट, पैकेज्ड पानी, स्टील, प्रेशर कुकर और सीमेंट जैसे भौतिक उत्पादों पर लागू होता है। इसके लिए बीआईएस अधिकारियों द्वारा अनिवार्य कारखाने के निरीक्षण और इन-हाउस प्रयोगशाला परीक्षण की आवश्यकता होती है। सीआरएस (स्कीम-II) मुख्य रूप से इलेक्ट्रॉनिक और आईटी उत्पादों (एलईडी बल्ब, लैपटॉप, चार्जर) को कवर करता है। सीआरएस के तहत पंजीकरण से पहले किसी कारखाने के निरीक्षण की आवश्यकता नहीं होती; निर्माता बीआईएस मान्यता प्राप्त लैब में परीक्षण करवाते हैं और ऑनलाइन आर-नंबर प्राप्त करते हैं।",
      ta: "ISI முத்திரை (ஸ்கீம்-I) ஹெல்மெட், பாட்டில் தண்ணீர், எஃகு, பிரஷர் குக்கர் போன்ற பொருட்களுக்குப் பொருந்தும். இதற்கு BIS அதிகாரிகளின் தொழிற்சாலை ஆய்வு தேவை. CRS (ஸ்கீம்-II) முக்கியமாக எலக்ட்ரானிக்ஸ் மற்றும் IT தயாரிப்புகளை (LED பல்புகள், மடிக்கணினிகள்) உள்ளடக்கியது. இதற்கு முன்பதிவு ஆய்வு தேவையில்லை, ஆன்லைனில் R-Number பெறலாம்.",
      te: "ISI మార్క్ (స్కీమ్-I) హెల్మెట్లు, ప్యాక్ చేసిన నీరు, స్టీల్, ప్రెజర్ కుక్కర్లు మరియు సిమెంట్ వంటి భౌతిక ఉత్పత్తులకు వర్తిస్తుంది. దీనికి BIS అధికారుల ఫ్యాక్టరీ తనిఖీ అవసరం. CRS (స్కీమ్-II) ప్రధానంగా ఎలక్ట్రానిక్స్ మరియు IT ఉత్పత్తులను కవర్ చేస్తుంది.",
      mr: "आयएसआय मार्क (स्कीम-I) हेल्मेट, पॅकेज केलेले पाणी, स्टील, प्रेशर कुकर आणि सिमेंट यांसारख्या भौतिक उत्पादनांना लागू होतो. यासाठी बीआयएस अधिकाऱ्यांद्वारे अनिवार्य कारखान्याची पाहणी आवश्यक असते. सीआरएस (स्कीम-II) प्रामुखाने इलेक्ट्रॉनिक आणि आयटी उत्पादने कव्हर करते.",
      bn: "আইএসআই মার্ক (স্কিম-I) হেলমেট, প্যাকেটজাত জল, ইস্পাত, প্রেসার কুকার এবং সিমেন্টের মতো পণ্যের ক্ষেত্রে প্রযোজ্য। এর জন্য বিআইএস আধিকারিকদের কারখানা পরিদর্শন প্রয়োজন। সিআরএস (স্কিম-II) মূলত ইলেকট্রনিক্স এবং আইটি পণ্য কভার করে।",
      gu: "ISI માર્ક (સ્કીમ-I) હેલ્મેટ, પેકેજ્ડ પાણી, સ્ટીલ, પ્રેશર કુકર અને સિમેન્ટ જેવી પ્રોડક્ટ્સ માટે લાગુ પડે છે. આ માટે BIS અધિકારીઓ દ્વારા ફેક્ટરી નિરીક્ષણ જરૂરી છે. CRS (સ્કીમ-II) મુખ્યત્વે ઈલેક્ટ્રોનિક્સ અને IT પ્રોડક્ટ્સને આવરી લે છે.",
      kn: "ISI ಮಾರ್ಕ್ (స్కీಮ್-I) ಹೆಲ್ಮೆಟ್‌ಗಳು, ಪ್ಯಾಕ್ ಮಾಡಿದ ನೀರು, ಉಕ್ಕು, ಪ್ರೆಷರ್ ಕುಕ್ಕರ್‌ಗಳು ಮುಂತಾದ ಉತ್ಪನ್ನಗಳಿಗೆ ಅನ್ವಯಿಸುತ್ತದೆ. దీనికి BIS అధికారుల ఫ్యాಕ್ಟರೀ ಪರಿಶೀಲನೆ ಅಗತ್ಯ. CRS (స్కీಮ್-II) ಮುಖ್ಯವಾಗಿ ಎಲೆಕ್ಟ್ರಾನಿಕ್ಸ್ ಮತ್ತು IT ಉತ್ಪನ್ನಗಳನ್ನು ಒಳಗೊಂಡಿದೆ.",
      ml: "ISI മാർക്ക് (സ്കീം-I) ഹെൽമെറ്റുകൾ, കുടിവെള്ളം, സ്റ്റീൽ, പ്രഷർ കുക്കറുകൾ എന്നിവയ്ക്ക് ബാധകമാണ്. ഇതിന് BIS ഉദ്യോഗസ്ഥരുടെ ഫാക്ടറി പരിശോധന ആവശ്യമാണ്. CRS (സ്കീം-II) പ്രധാനമായും ഇലക്ട്രോണിക്സ്, ഐടി ഉൽപ്പന്നങ്ങളെ ഉൾക്കൊള്ളുന്നു.",
      pa: "ISI ਮਾਰਕ (ਸਕੀਮ-I) ਹੈਲਮੇਟ, ਪੈਕ ਕੀਤਾ ਪਾਣੀ, ਸਟੀਲ, ਪ੍ਰੈਸ਼ਰ ਕੁੱਕਰ ਅਤੇ ਸੀਮੈਂਟ ਵਰਗੇ ਉਤਪਾਦਾਂ 'ਤੇ ਲਾਗੂ ਹੁੰਦਾ ਹੈ। ਇਸ ਲਈ BIS ਅਧਿਕਾਰੀ ਦੁਆਰਾ ਫੈਕਟਰੀ ਨਿਰੀਖਣ ਦੀ ਲੋੜ ਹੁੰਦੀ ਹੈ। CRS (ਸਕੀਮ-II) ਮੁੱਖ ਤੌਰ 'ਤੇ ਇਲੈਕਟ੍ਰੌਨਿਕਸ ਅਤੇ IT ਉਤਪਾਦਾਂ ਨੂੰ ਕਵਰ ਕਰਦਾ ਹੈ।",
      or: "ISI ମାର୍କ (ସ୍କିମ୍-I) ହେଲମେଟ, ପ୍ୟାକେଜ୍ ହୋଇଥିବା ପାଣି, ଷ୍ଟିଲ୍, ପ୍ରେସର କୁକର ଏବଂ ସିମେଣ୍ଟ ପାଇଁ ଲାଗୁ ହୁଏ। ଏଥିପାଇଁ BIS ଅଧିକାରୀଙ୍କ ଫ୍ୟାକ୍ଟ୍ରି ଯାଞ୍ଚ ଆବଶ୍ୟକ। CRS (ସ୍କିମ୍-II) ମୁଖ୍ୟତଃ ଇଲେକ୍ଟ୍ରୋନିକ୍ସ ଏବଂ IT ଉତ୍ପାଦକୁ କଭର କରେ।"
    },
    "How can an MSME or Startup get discount on BIS certification fees?": {
      hi: "बीआईएस की एमएसएमई प्रोत्साहन नीति के तहत: 1) सूक्ष्म उद्यमों को मार्किंग शुल्क पर 80% की छूट मिलती है। 2) लघु उद्यमों को 50% की छूट मिलती है। 3) डीपीआईआईटी पंजीकृत स्टार्ट-अप को 50% की छूट मिलती है। महिला उद्यमियों को विशेष छूट दी जाती है। दावों के लिए मानकऑनलाइन पर उद्यम पंजीकरण प्रमाण पत्र अपलोड करें।",
      ta: "BIS இன் MSME கொள்கையின் கீழ்: 1) நுண் நிறுவனங்களுக்கு 80% கட்டணக் கழிவு உண்டு. 2) சிறு நிறுவனங்களுக்கு 50% கழிவு உண்டு. 3) DPIIT பதிவு செய்த ஸ்டார்ட்அப்களுக்கு 50% கழிவு உண்டு.",
      te: "BIS యొక్క MSME పాలసీ ప్రకారం: 1) మైక్రో పరిశ్రమలకు 80% రుసుము మినహాయింపు లభిస్తుంది. 2) చిన్న పరిశ్రమలకు 50% మినహాయింపు లభిస్తుంది. 3) DPIIT స్టార్టప్‌లకు 50% మినహాయింపు లభిస్తుంది.",
      mr: "बीआयएस च्या एमएसएमई धोरणांतर्गत: 1) सूक्ष्म उद्योगांना मार्किंग शुल्कात 80% सवलत मिळते. 2) लघु उद्योगांना 50% सवलत मिळते. 3) डीपीआयआयटी नोंदणीकृत स्टार्टअप्सना 50% सवलत मिळते.",
      bn: "বিআইএস-এর এমএসএমই নীতির অধীনে: ১) ক্ষুদ্র শিল্প ৮০% ফি ছাড় পায়। ২) ছোট শিল্প ৫০% ফি ছাড় পায়। ৩) ডিপিআইআইটি নিবন্ধিত স্টার্টআপ ৫০% ফি ছাড় পায়।",
      gu: "BIS ની MSME નીતિ હેઠળ: 1) માઇક્રો સાહસોને 80% ફી મુક્તિ મળે છે. 2) નાના સાહસોને 50% ફી મુક્તિ મળે છે. 3) DPIIT સ્ટાર્ટઅપ્સને 50% ફી મુક્તિ મળે છે.",
      kn: "BIS ನ MSME ನೀತಿಯಡಿ: 1) ಮೈಕ್ರೋ ಉದ್ಯಮಗಳಿಗೆ 80% ರಿಯಾಯಿತಿ ಸಿಗುತ್ತದೆ. 2) ಸಣ್ಣ ಉದ್ಯಮಗಳಿಗೆ 50% ರಿಯಾಯಿತಿ ಸಿಗುತ್ತದೆ. 3) DPIIT ಸ್ಟಾರ್ಟ್‌ಅಪ್‌ಗಳಿಗೆ 50% ರಿಯಾಯಿತಿ ಸಿಗುತ್ತದೆ.",
      ml: "BIS-ന്റെ MSME നയത്തിന് കീഴിൽ: 1) മൈക്രോ സംരംഭങ്ങൾക്ക് മാർക്കിംഗ് ഫീസിൽ 80% ഇളവ് ലഭിക്കും. 2) ചെറുകിട സംരംഭങ്ങൾക്ക് 50% ഇളവ് ലഭിക്കും. 3) DPIIT സ്റ്റാർട്ടപ്പുകൾക്ക് 50% ഇളവ് ലഭിക്കും.",
      pa: "BIS ਦੀ MSME ਨੀਤੀ ਦੇ ਤਹਿਤ: 1) ਮਾਈਕ੍ਰੋ ਉਦਯੋਗਾਂ ਨੂੰ 80% ਛੋਟ ਮਿਲਦੀ ਹੈ। 2) ਛੋਟੇ ਉਦਯੋਗਾਂ ਨੂੰ 50% ਛੋਟ ਮਿਲਦੀ ਹੈ। 3) DPIIT ਸਟਾਰਟਅੱਪਸ ਨੂੰ 50% ਛੋਟ ਮਿਲਦੀ ਹੈ।",
      or: "BIS ର MSME ନୀତି ଅଧୀନରେ: ୧) କ୍ଷୁଦ୍ର ଶିଳ୍ପକୁ ୮୦% ଫିସ ଛାଡ଼ ମିଳେ। ୨) ଛୋଟ ଶିଳ୍ପକୁ ୫୦% ଛାଡ଼ ମିଳେ। ୩) DPIIT ଷ୍ଟାର୍ଟଅପକୁ ୫୦% ଛାଡ଼ ମିଳେ।"
    },
    "What happens if a company sells a product under mandatory QCO without an ISI mark?": {
      hi: "अनिवार्य गुणवत्ता नियंत्रण आदेश (QCO) के तहत बिना बीआईएस लाइसेंस या आईएसआई मार्क के सामान बेचना बीआईएस अधिनियम, 2016 की धारा 29 के तहत गंभीर अपराध है। सजा: 1) 2 साल तक की जेल। 2) कम से कम ₹2 लाख का जुर्माना या जब्त माल के मूल्य का 10 गुना। 3) बाजार से बिना लाइसेंस वाले माल को जब्त करना।",
      ta: "கட்டாய QCO தயாரிப்புகளை செல்லுபடியாகும் BIS உரிமம் இன்றி விற்பனை செய்வது குற்றமாகும். தண்டனை: 2 ஆண்டுகள் வரை சிறை, ₹2 லட்சம் குறைந்தபட்ச அபராதம் மற்றும் பொருட்களைப் பறிமுதல் செய்தல்.",
      te: "నిర్బంధ QCO ఉత్పత్తులను BIS లైసెన్స్ లేకుండా విక్రయించడం తీవ్రమైన నేరం. శిక్షలు: 2 సంవత్సరాల వరకు జైలు శిక్ష, కనీసం ₹2 లక్షల జరిమానా మరియు సరుకుల జప్తు.",
      mr: "अनिवार्य क्यूसीओ अंतर्गत बीआयएस परवान्याशिवाय विक्री करणे हा गंभीर गुन्हा आहे. शिक्षा: २ वर्षांपर्यंत तुरुंगवास, किमान ₹२ लाखांचा दंड आणि माल जप्त करणे.",
      bn: "বাধ্যতামূলক QCO-এর অধীনে বৈধ বিআইএস লাইসেন্স ছাড়া বিক্রি করা অপরাধ। শাস্তি: ২ বছর পর্যন্ত জেল, সর্বনিম্ন ২ লক্ষ টাকা জরিমানা এবং পণ্য বাজেয়াপ্ত করা।",
      gu: "ફરજિયાત QCO હેઠળ BIS લાયસન્સ વગર વેચાણ કરવું એ ગંભીર ગુનો છે. સજા: 2 વર્ષ સુધીની જેલ, ઓછામાં ઓછો ₹2 લાખનો દંડ અને સ્ટોક જપ્ત કરવો.",
      kn: "ಕಡ್ಡಾಯ QCO ಅಡಿಯಲ್ಲಿ BIS ಲೈಸೆನ್ಸ್ ಇಲ್ಲದೆ ಮಾರಾಟ ಮಾಡುವುದು ಅಪರಾಧ. ಶಿಕ್ಷೆ: 2 ವರ್ಷಗಳವರೆಗೆ ಜೈಲು ಶಿಕ್ಷೆ, ಕನಿಷ್ಠ ₹2 ಲಕ್ಷ ದಂಡ ಮತ್ತು ಸರಕುಗಳ ವಶಪಡಿಸಿಕೊಳ್ಳುವಿಕೆ.",
      ml: "നിർബന്ധിത QCO ഉൽപ്പന്നങ്ങൾ BIS ലൈസൻസില്ലാതെ വിൽക്കുന്നത് കുറ്റകരമാണ്. ശിക്ഷ: 2 വർഷം വരെ തടവ്, കുറഞ്ഞത് ₹2 ലക്ഷം പിഴ, സാധനങ്ങൾ പിടിച്ചെടുക്കൽ.",
      pa: "ਲਾਜ਼ਮੀ QCO ਦੇ ਤਹਿਤ ਬਿਨਾਂ BIS ਲਾਇਸੈਂਸ ਦੇ ਵੇਚਣਾ ਗੰਭੀਰ ਅਪਰਾਧ ਹੈ। ਸਜ਼ਾ: 2 ਸਾਲ ਤੱਕ ਦੀ ਜੇਲ੍ਹ, ਘੱਟੋ-ਘੱਟ ₹2 ਲੱਖ ਜੁਰਮਾਨਾ ਅਤੇ ਮਾਲ ਜ਼ਬਤ ਕਰਨਾ।",
      or: "ବାଧ୍ୟତାମୂଳକ QCO ଅଧୀନରେ BIS ଲାଇସେନ୍ସ ବିନା ବିକ୍ରି କରିବା ଅପରାଧ। ଦଣ୍ଡ: ୨ ବର୍ଷ ଜେଲ୍, ସର୍ବନିମ୍ନ ୨ ଲକ୍ଷ ଟଙ୍କା ଜୋରିମାନା ଏବଂ ସାମଗ୍ରୀ ଜବତ।"
    },
    "How to verify if a gold jewellery hallmark HUID is genuine?": {
      hi: "सोने के हॉलमार्क 6-अंकीय HUID (जैसे AB1234) की पुष्टि करने के लिए: 1) बीआईएस केयर ऐप डाउनलोड करें। 2) 'Verify HUID' पर टैप करें। 3) 6-अंकीय कोड दर्ज करें। ऐप ज्वेलर्स का नाम, हॉलमार्किंग केंद्र, तिथि और शुद्धता (उदा. 22K916) दिखाएगा।",
      ta: "தங்கத்தின் 6-இலக்க HUID குறியீட்டை சரிபார்க்க: 1) BIS Care செயலியைப் பதிவிறக்கவும். 2) 'Verify HUID' என்பதைத் தட்டவும். 3) 6-இலக்க குறியீட்டை உள்ளிடவும்.",
      te: "బంగారు ఆభరణాల 6-అంకెల HUIDని తనిఖీ చేయడానికి: 1) BIS Care యాప్‌ని డౌన్‌లోడ్ చేయండి. 2) 'Verify HUID' నొక్కండి. 3) 6-అంకెల కోడ్‌ను నమోదు చేయండి.",
      mr: "सोन्याच्या 6-अंकी HUID कोडची खात्री करण्यासाठी: 1) BIS Care ॲप डाउनलोड करा. 2) 'Verify HUID' वर क्लिक करा. 3) 6-अंकी कोड टाका.",
      bn: "সোনা হলমার্কের ৬-সংখ্যার HUID কোড যাচাই করতে: ১) BIS Care অ্যাপ ডাউনলোড করুন। ২) 'Verify HUID' এ ট্যাপ করুন। ৩) ৬-সংখ্যার কোডটি লিখুন।",
      gu: "સોનાના 6-અંકના HUID કોડની ચકાસણી કરવા માટે: 1) BIS Care એપ ડાઉનલોડ કરો. 2) 'Verify HUID' પર ટેપ કરો. 3) 6-અંકનો કોਡ દાખલ કરો.",
      kn: "ಚಿನ್ನದ 6-ಅಂಕಿಯ HUID ಪರಿಶೀಲಿಸಲು: 1) BIS Care ಆಪ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ. 2) 'Verify HUID' ಒತ್ತಿ. 3) 6-ಅಂಕಿಯ ಕೋಡ್ నమోదు ಮಾಡಿ.",
      ml: "സ്വർണ്ണത്തിന്റെ 6-അക്ക HUID പരിശോധിക്കാൻ: 1) BIS Care ആപ്പ് ഡൗൺലോഡ് ചെയ്യുക. 2) 'Verify HUID' ടാപ്പ് ചെയ്യുക. 3) 6-അക്ക കോഡ് നൽകുക.",
      pa: "ਸੋਨੇ ਦੇ 6-ਅੰਕਾਂ ਵਾਲੇ HUID ਦੀ ਜਾਂਚ ਲਈ: 1) BIS Care ਐਪ ਡਾਊਨਲੋਡ ਕਰੋ। 2) 'Verify HUID' 'ਤੇ ਟੈਪ ਕਰੋ। 3) 6-ਅੰਕਾਂ ਦਾ ਕੋਡ ਦਰਜ ਕਰੋ।",
      or: "ସୁନାର ୬-ଅଙ୍କ ବିଶିଷ୍ଟ HUID ଯାଞ୍ଚ ପାଇଁ: ୧) BIS Care ଆପ୍ ଡାଉନଲୋଡ୍ କରନ୍ତୁ। ୨) 'Verify HUID' ରେ ଟାପ୍ କରନ୍ତୁ। ୩) ୬-ଅଙ୍କ କୋଡ୍ ଦିଅନ୍ତୁ।"
    },
    "How can foreign manufacturers export certified goods to India (FMCS)?": {
      hi: "विदेशी निर्माताओं को एफएमसीएस (FMCS) योजना के तहत आवेदन करना होगा: 1) भारत में निवासी अधिकृत भारतीय प्रतिनिधि (AIR) नियुक्त करें। 2) मानकऑनलाइन पर आवेदन जमा करें। 3) बीआईएस अधिकारी विदेशी कारखाने का भौतिक ऑडिट करने विदेश यात्रा करते हैं। 4) बीआईएस प्रयोगशालाओं में परीक्षण के बाद लाइसेंस जारी किया जाता है।",
      ta: "வெளிநாட்டு உற்பத்தியாளர்கள் FMCS திட்டத்தின் கீழ் விண்ணப்பிக்க வேண்டும்: 1) இந்தியாவில் உள்ள இந்திய பிரதிநிதியை (AIR) நியமிக்கவும். 2) Manakonline இல் விண்ணப்பிக்கவும். 3) BIS அதிகாரிகள் தொழிற்சாலை ஆய்வு செய்வார்கள்.",
      te: "విదేశీ తయారీదారులు FMCS పథకం కింద దరఖాస్తు చేసుకోవాలి: 1) భారతదేశంలో AIR ప్రతినిధిని నియమించాలి. 2) Manakonline లో దరఖాస్తు చేయాలి. 3) BIS అధికారులు ఫ్యాక్టరీ ఆడిట్ చేస్తారు.",
      mr: "परदेशी उत्पादकांनी एफएमसीएस (FMCS) योजनेअंतर्गत अर्ज करावा: 1) भारतात अधिकृत भारतीय प्रतिनिधी (AIR) नियुक्त करा. 2) Manakonline वर अर्ज करा. 3) बीआयएस अधिकारी परदेशी कारखान्याची पाहणी करतात.",
      bn: "বিদেশী প্রস্তুতকারকদের এফএমসিএস (FMCS) স্কিমের অধীনে আবেদন করতে হবে: ১) ভারতে একজন ভারতীয় প্রতিনিধি (AIR) নিয়োগ করুন। ২) Manakonline-এ আবেদন করুন। ৩) বিআইএস আধিকারিকরা কারখানা পরিদর্শন করবেন।",
      gu: "વિદેશી ઉત્પાદકોએ FMCS યોજના હેઠળ અરજી કરવી આવશ્યક છે: 1) ભારતમાં માન્ય ભારતીય પ્રતિનિધિ (AIR) ની નિમણૂક કરો. 2) Manakonline પર અરજી સબમિટ કરો. 3) BIS અધિકારીઓ ફેક્ટરી ઓડિટ કરશે.",
      kn: "ವಿದೇಶಿ ತಯಾರಕರು FMCS ಯೋಜನೆಯಡಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಬೇಕು: 1) ಭಾರತದಲ್ಲಿ ಭಾರತೀಯ ಪ್ರತಿನಿಧಿಯನ್ನು (AIR) ನೇಮಿಸಿ. 2) Manakonline ನಲ್ಲಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ. 3) BIS ಅಧಿಕಾರಿಗಳು ಫ್ಯಾಕ್ಟರಿ ಆಡಿಟ್ ಮಾಡುತ್ತಾರ.",
      ml: "വിദേശ നിർമ്മാതാക്കൾ FMCS സ്കീമിന് കീഴിൽ അപേക്ഷിക്കണം: 1) ഇന്ത്യയിൽ ഒരു പ്രതിനിധിയെ (AIR) നിയമിക്കുക. 2) Manakonline ൽ അപേക്ഷിക്കുക. 3) BIS ഉദ്യോഗസ്ഥർ ഫാക്ടറി പരിശോധന നടത്തും.",
      pa: "ਵਿਦੇਸ਼ੀ ਨਿਰਮਾਤਾਵਾਂ ਨੂੰ FMCS ਸਕੀਮ ਦੇ ਤਹਿਤ ਅਰਜ਼ੀ ਦੇਣੀ ਪਵੇਗੀ: 1) ਭਾਰਤ ਵਿੱਚ AIR ਨੁਮਾਇੰਦਾ ਨਿਯੁਕਤ ਕਰੋ। 2) Manakonline 'ਤੇ ਅਰਜ਼ੀ ਦਿਓ। 3) BIS ਅਧਿਕਾਰੀ ਫੈਕਟਰੀ ਆਡਿਟ ਕਰਨਗੇ।",
      or: "ବିଦେଶୀ ନିର୍ମାତା FMCS ଯୋଜନା ଅଧୀନରେ ଆବେଦନ କରିବେ: ୧) ଭାରତରେ ଜଣେ ପ୍ରତିନିଧି (AIR) ନିଯୁକ୍ତ କରନ୍ତୁ। ୨) Manakonline ରେ ଆବେଦନ କରନ୍ତୁ। ୩) BIS ଅଧିକାରୀ ଫ୍ୟାକ୍ଟ୍ରି ଅଡିଟ୍ କରିବେ।"
    }
  };

  const lbl = LABELS[lang] || LABELS.en;
  let synthesizedAnswer = "";

  if (topMatch.type === 'standard') {
    const std = topMatch.data;
    synthesizedAnswer = `📌 **${std.is_code}: ${std.title}**\n\n` +
      `• **${lbl.category}:** ${std.category}\n` +
      `• **${lbl.scheme}:** ${std.certification_scheme}\n` +
      `• **${lbl.status}:** ${std.mandatory_qco ? lbl.mandatory : lbl.voluntary}\n\n` +
      `**${lbl.desc}:**\n${std.description}\n\n` +
      `**${lbl.steps}:**\n${std.application_steps.join('\n')}\n\n` +
      `**${lbl.fees}:**\n${std.fees_structure}`;
  } else if (topMatch.type === 'faq') {
    const faq = topMatch.data;
    const answerText = (FAQ_TRANSLATIONS[faq.question] && FAQ_TRANSLATIONS[faq.question][lang])
      ? FAQ_TRANSLATIONS[faq.question][lang]
      : faq.answer;
    synthesizedAnswer = `💡 **${lbl.answerTitle || 'उत्तर'}:**\n${answerText}`;
  } else if (topMatch.type === 'product') {
    const prod = topMatch.data;
    synthesizedAnswer = `🔍 **${prod.product_name}**\n\n` +
      `• **${lbl.isMandatory}** ${prod.is_certified_mandatory ? lbl.yesMandatory : lbl.noVoluntary}\n` +
      `• **${lbl.std}:** ${prod.is_code}\n` +
      `• **${lbl.scheme}:** ${prod.scheme}\n` +
      `• **${lbl.ministry}:** ${prod.ministry}\n\n` +
      `**${lbl.summary}:**\n${prod.summary}`;
  }

  return {
    success: true,
    answer: synthesizedAnswer,
    sources: topSources,
    matchedType: topMatch.type,
    confidence: topMatch.score > 4 ? "high" : "medium"
  };
}

/**
 * Quick product compliance status check
 */
function checkCompliance(productQuery) {
  if (!productQuery) return { success: false, error: "Please provide a product name" };
  const rawTokens = tokenize(productQuery);
  const queryTokens = expandQueryTokens(rawTokens);

  let bestMatch = null;
  let highestScore = 0;

  for (const prod of products) {
    let score = scoreText(queryTokens, `${prod.product_name} ${prod.aliases.join(' ')} ${prod.is_code}`, prod.aliases);
    if (score > highestScore) {
      highestScore = score;
      bestMatch = prod;
    }
  }

  if (!bestMatch || highestScore === 0) {
    return {
      success: true,
      found: false,
      productName: productQuery,
      message: `No exact Quality Control Order (QCO) entry found for "${productQuery}". It might be under voluntary standards or a non-listed category. You can search directly on manakonline.in.`
    };
  }

  return {
    success: true,
    found: true,
    productName: bestMatch.product_name,
    isMandatory: bestMatch.is_certified_mandatory,
    isCode: bestMatch.is_code,
    scheme: bestMatch.scheme,
    ministry: bestMatch.ministry,
    summary: bestMatch.summary,
    officialLink: bestMatch.official_link
  };
}

module.exports = {
  processQuery,
  checkCompliance,
  standards,
  faqs,
  products
};
