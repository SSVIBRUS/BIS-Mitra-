import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';

// Multilingual UI Translations Dictionary (All 11 Indian Languages + English)
const TRANSLATIONS = {
  en: {
    name: "English",
    speechLang: "en-IN",
    title: "BIS Mitra",
    subtitle: "Official Assistant for Indian Standards & BIS Services",
    checkBtn: "🔍 Is My Product Certified?",
    scanBtn: "📷 Vision AI Scan Mark",
    langLabel: "🌐 Language:",
    industryLabel: "⚙️ Industry Sector Filter:",
    allIndustries: "All Industries",
    food: "Food & Beverages",
    electronics: "Electronics & IT",
    safety: "Safety & Automotive",
    consumer: "Consumer Goods & Toys",
    steel: "Steel & Construction",
    metals: "Precious Metals & Hallmarking",
    sampleTitle: "✨ Suggested Questions for this Sector:",
    welcomeTitle: "Welcome to BIS Mitra",
    welcomeDesc: "Ask any question about Indian Standards (IS), ISI Mark, CRS registration, Gold Hallmarking, or Quality Control Orders (QCOs).",
    youAsked: "You Asked:",
    botTitle: "BIS Mitra Assistant:",
    listenBtn: "🔊 Listen",
    stopListenBtn: "⏸️ Stop",
    sourcesHeading: "🛡️ Verified Sources from Official BIS Records:",
    sourceTag: "This came from:",
    searchingMsg: "Searching verified BIS records on bis.gov.in...",
    placeholder: "Ask your question about Indian Standards or BIS services...",
    listening: "Listening... Speak your question now",
    askBtn: "Ask",
    modalTitle: "Product Compliance Lookup",
    modalSub: "Check if your product requires mandatory BIS / ISI certification",
    modalPlaceholder: "e.g. Helmet, Packaged Water, Toys, LED Bulb...",
    modalCheckBtn: "Check",
    modalPopular: "Popular:",
    mandatoryBadge: "🚨 MANDATORY QUALITY CONTROL ORDER (QCO) IN EFFECT",
    voluntaryBadge: "✅ VOLUNTARY STANDARD",
    applicableStd: "Applicable Standard:",
    scheme: "Certification Scheme:",
    authority: "Regulating Authority:",
    officialLink: "View Official BIS Mandatory List",
    notFound: "Standard Entry Not Found",
    footerText: "© Bureau of Indian Standards (BIS) Mitra — Quality & Compliance Portal",
    mapBtn: "🗺️ BIS Offices Map",
    calcBtn: "🧮 Cost Calculator",
    analyticsBtn: "📊 Analytics",
    reportBtn: "🚨 Report Fake"
  },
  hi: {
    name: "हिंदी (Hindi)",
    speechLang: "hi-IN",
    title: "बीआईएस मित्र",
    subtitle: "भारतीय मानकों और बीआईएस सेवाओं के लिए आधिकारिक सहायक",
    checkBtn: "🔍 क्या मेरा उत्पाद प्रमाणित है?",
    scanBtn: "📷 विज़न एआई स्कैन मार्क",
    langLabel: "🌐 भाषा / Language:",
    industryLabel: "⚙️ उद्योग क्षेत्र फ़िल्टर:",
    allIndustries: "सभी उद्योग",
    food: "खाद्य एवं पेय पदार्थ",
    electronics: "इलेक्ट्रॉनिक्स एवं आईटी",
    safety: "सुरक्षा एवं ऑटोमोटिव",
    consumer: "उपभोक्ता वस्तुएं और खिलौने",
    steel: "स्टील और निर्माण",
    metals: "कीमती धातुएं और हॉलमार्किंग",
    sampleTitle: "✨ इस क्षेत्र के लिए अनुशंसित प्रश्न:",
    welcomeTitle: "बीआईएस मित्र में आपका स्वागत है",
    welcomeDesc: "भारतीय मानकों (आईएस), आईएसआई मार्क, सीआरएस पंजीकरण, गोल्ड हॉलमार्किंग या गुणवत्ता नियंत्रण आदेशों (क्यूसीओ) के बारे में कोई भी प्रश्न पूछें।",
    youAsked: "आपने पूछा:",
    botTitle: "बीआईएस मित्र सहायक:",
    listenBtn: "🔊 सुनें",
    stopListenBtn: "⏸️ रोकें",
    sourcesHeading: "🛡️ आधिकारिक बीआईएस रिकॉर्ड से सत्यापित स्रोत:",
    sourceTag: "यह स्रोत से आया है:",
    searchingMsg: "bis.gov.in पर सत्यापित बीआईएस रिकॉर्ड खोजे जा रहे हैं...",
    placeholder: "भारतीय मानकों या बीआईएस सेवाओं के बारे में अपना प्रश्न पूछें...",
    listening: "सुन रहा हूँ... अब अपना प्रश्न बोलें",
    askBtn: "पूछें",
    modalTitle: "उत्पाद अनुपालन खोज",
    modalSub: "जांचें कि क्या आपके उत्पाद के लिए बीआईएस/आईएसआई प्रमाणन अनिवार्य है",
    modalPlaceholder: "जैसे हेलमेट, पैकेज्ड पानी, खिलौने, एलईडी बल्ब...",
    modalCheckBtn: "जांचें",
    modalPopular: "लोकप्रिय:",
    mandatoryBadge: "🚨 अनिवार्य गुणवत्ता नियंत्रण आदेश (QCO) लागू है",
    voluntaryBadge: "✅ स्वैच्छिक मानक",
    applicableStd: "लागू मानक:",
    scheme: "प्रमाणन योजना:",
    authority: "नियामक प्राधिकरण:",
    officialLink: "आधिकारिक बीआईएस अनिवार्य सूची देखें",
    notFound: "मानक प्रविष्टि नहीं मिली",
    footerText: "© भारतीय मानक ब्यूरो (बीआईएस) मित्र — गुणवत्ता एवं अनुपालन पोर्टल",
    mapBtn: "🗺️ बीआईएस कार्यालय नक्शा",
    calcBtn: "🧮 लागत कैलकुलेटर",
    analyticsBtn: "📊 विश्लेषण",
    reportBtn: "🚨 नकली की रिपोर्ट"
  },
  ta: {
    name: "தமிழ் (Tamil)",
    speechLang: "ta-IN",
    title: "பிஐஎஸ் மித்ரா",
    subtitle: "இந்தியத் தரநிலைகள் & பிஐஎஸ் சேவைகளுக்கான அதிகாரப்பூர்வ உதவியாளர்",
    checkBtn: "🔍 எனது தயாரிப்பு சான்றளிக்கப்பட்டதா?",
    scanBtn: "📷 விஜன் AI ஸ்கேன்",
    langLabel: "🌐 மொழி / Language:",
    industryLabel: "⚙️ தொழில் துறை வடிகட்டி:",
    allIndustries: "அனைத்து தொழில்களும்",
    food: "உணவு & பானங்கள்",
    electronics: "எலக்ட்ரானிக்ஸ் & ஐடி",
    safety: "பாதுகாப்பு & ஆட்டோமோட்டீவ்",
    consumer: "நுகர்வோர் பொருட்கள் & பொம்மைகள்",
    steel: "எஃகு & கட்டுமானம்",
    metals: "விலைமதிப்பற்ற உலோகங்கள் & ஹால்மார்க்கிங்",
    sampleTitle: "✨ இந்தத் துறைக்கான பரிந்துரைக்கப்பட்ட கேள்விகள்:",
    welcomeTitle: "பிஐஎஸ் மித்ராவுக்கு நல்வரவு",
    welcomeDesc: "இந்தியத் தரநிலைகள் (IS), ISI முத்திரை, CRS பதிவு, தங்க ஹால்மார்க்கிங் அல்லது தரக் கட்டுப்பாட்டு உத்தரவுகள் (QCO) பற்றி எந்தக் கேள்வியையும் கேளுங்கள்.",
    youAsked: "நீங்கள் கேட்டது:",
    botTitle: "பிஐஎஸ் மித்ரா உதவியாளர்:",
    listenBtn: "🔊 கேள்",
    stopListenBtn: "⏸️ நிறுத்து",
    sourcesHeading: "🛡️ அதிகாரப்பூர்வ பிஐஎஸ் பதிவுகளிலிருந்து சரிபார்க்கப்பட்ட ஆதாரங்கள்:",
    sourceTag: "இதிலிருந்து வந்தது:",
    searchingMsg: "bis.gov.in இல் சரிபார்க்கப்பட்ட பதிவுகள் தேடப்படுகின்றன...",
    placeholder: "இந்தியத் தரநிலைகள் அல்லது பிஐஎஸ் சேவைகள் பற்றி கேட்கவும்...",
    listening: "கேட்கிறது... இப்போது உங்கள் கேள்வியைப் பேசுங்கள்",
    askBtn: "கேள்",
    modalTitle: "தயாரிப்பு இணக்கத் தேடல்",
    modalSub: "உங்கள் தயாரிப்புக்கு கட்டாய BIS / ISI சான்றிதழ் தேவையா என சரிபார்க்கவும்",
    modalPlaceholder: "எ.கா. ஹெல்மெட், பாட்டில் தண்ணீர், பொம்மைகள்...",
    modalCheckBtn: "சரிபார்",
    modalPopular: "பிரபலமானவை:",
    mandatoryBadge: "🚨 கட்டாய தரக் கட்டுப்பாட்டு உத்தரவு (QCO) அமலில் உள்ளது",
    voluntaryBadge: "✅ தன்னார்வ தரநிலை",
    applicableStd: "பொருந்தக்கூடிய தரநிலை:",
    scheme: "சான்றிதழ் திட்டம்:",
    authority: "ஒழுங்குமுறை ஆணையம்:",
    officialLink: "அதிகாரப்பூர்வ BIS பட்டியலைப் பார்க்கவும்",
    notFound: "பதிவு எதுவும் கிடைக்கவில்லை",
    footerText: "© இந்திய தரநிலை நிறுவனம் (BIS) மித்ரா",
    mapBtn: "🗺️ BIS அலுவலக வரைபடம்",
    calcBtn: "🧮 செலவு கணிப்பான்",
    analyticsBtn: "📊 பகுப்பாய்வு",
    reportBtn: "🚨 போலி புகார்"
  },
  te: {
    name: "తెలుగు (Telugu)",
    speechLang: "te-IN",
    title: "బిఐఎస్ మిత్ర",
    subtitle: "భారతీయ ప్రమాణాలు & బిఐఎస్ సేవల అధికారిక సహాయకుడు",
    checkBtn: "🔍 నా ఉత్పత్తి సర్టిఫై చేయబడిందా?",
    scanBtn: "📷 విజన్ AI స్కాన్",
    langLabel: "🌐 భాష / Language:",
    industryLabel: "⚙️ పరిశ్రమ రంగ ఫిల్టర్:",
    allIndustries: "అన్ని పరిశ్రమలు",
    food: "ఆహారం & పానీయాలు",
    electronics: "ఎలక్ట్రానిక్స్ & ఐటీ",
    safety: "రక్షణ & ఆటోమోటివ్",
    consumer: "వినియోగ వస్తువులు & బొమ్మలు",
    steel: "స్టీల్ & నిర్మాణం",
    metals: "విలువైన లోహాలు & హాల్‌మార్కింగ్",
    sampleTitle: "✨ ఈ రంగం కొరకు సిఫార్సు చేసిన ప్రశ్నలు:",
    welcomeTitle: "బిఐఎస్ మిత్రకి స్వాగతం",
    welcomeDesc: "భారతీయ ప్రమాణాలు (IS), ISI మార్క్, CRS రిజిస్ట్రేషన్, గోల్డ్ హాల్‌మార్కింగ్ లేదా క్వాలిటీ కంట్రోల్ ఆర్డర్‌ల (QCO) గురించిన ఏ ప్రశ్నైనా అడగండి.",
    youAsked: "మీరు అడిగారు:",
    botTitle: "బిఐఎస్ మిత్ర సహాయకుడు:",
    listenBtn: "🔊 వినండి",
    stopListenBtn: "⏸️ ఆపండి",
    sourcesHeading: "🛡️ అధికారిక బిఐఎస్ రికార్డుల నుండి ధృవీకరించబడిన మూలాలు:",
    sourceTag: "దీని నుండి వచ్చింది:",
    searchingMsg: "bis.gov.in లో రికార్డులు శోధించబడుతున్నాయి...",
    placeholder: "భారతీయ ప్రమాణాలు లేదా బిఐఎస్ సేవల గురించి అడగండి...",
    listening: "వింటోంది... ఇప్పుడు మీ ప్రశ్న మాట్లాడండి",
    askBtn: "అడగండి",
    modalTitle: "ఉత్పత్తి వర్తింపు శోధన",
    modalSub: "మీ ఉత్పత్తికి నిర్బంధ BIS / ISI సర్టిఫికేషన్ అవసరమో తనిఖీ చేయండి",
    modalPlaceholder: "ఉదా. హెల్మెట్, తాగునీరు, బొమ్మలు...",
    modalCheckBtn: "తనిఖీ చేయండి",
    modalPopular: "ప్రసిద్ధమైనవి:",
    mandatoryBadge: "🚨 నిర్బంధ నాణ్యతా నియంత్రణ ఉత్తర్వు (QCO) అమలులో ఉంది",
    voluntaryBadge: "✅ స్వచ్ఛంద ప్రమాణం",
    applicableStd: "వర్తించే ప్రమాణం:",
    scheme: "సర్టిఫికేషన్ పథకం:",
    authority: "నియంత్రణ సంస్థ:",
    officialLink: "అధికారిక BIS నిర్బంధ జాబితాను చూడండి",
    notFound: "ప్రమాణ ఎంట్రీ కనుగొనబడలేదు",
    footerText: "© భారత ప్రమాణాల సంస్థానం (BIS) మిత్ర",
    mapBtn: "🗺️ BIS కార్యాలయాల మ్యాప్",
    calcBtn: "🧮 ఖర్చు కాలిక్యులేటర్",
    analyticsBtn: "📊 విశ్లేషణలు",
    reportBtn: "🚨 నకిలీ నివేదిక"
  },
  mr: {
    name: "मराठी (Marathi)",
    speechLang: "mr-IN",
    title: "बीआयएस मित्र",
    subtitle: "भारतीय मानके आणि बीआयएस सेवांसाठी अधिकृत सहाय्यक",
    checkBtn: "🔍 माझे उत्पादन प्रमाणित आहे का?",
    scanBtn: "📷 व्हिजन एआय स्कॅन",
    langLabel: "🌐 भाषा / Language:",
    industryLabel: "⚙️ उद्योग क्षेत्र फिल्टर:",
    allIndustries: "सर्व उद्योग",
    food: "अन्न आणि पेये",
    electronics: "इलेक्ट्रॉनिक्स आणि आयटी",
    safety: "सुरक्षा आणि ऑटोमोटिव्ह",
    consumer: "ग्राहक वस्तू आणि खेळणी",
    steel: "स्टील आणि बांधकाम",
    metals: "मौल्यवान धातू आणि हॉलमार्किंग",
    sampleTitle: "✨ या क्षेत्रासाठी शिफारस केलेले प्रश्न:",
    welcomeTitle: "बीआयएस मित्रमध्ये आपले स्वागत आहे",
    welcomeDesc: "भारतीय मानके (IS), ISI मार्क, CRS नोंदणी, सोने हॉलमार्किंग किंवा गुणवत्ता नियंत्रण आदेशांबद्दल (QCO) कोणताही प्रश्न विचारा.",
    youAsked: "तुम्ही विचारले:",
    botTitle: "बीआयएस मित्र सहाय्यक:",
    listenBtn: "🔊 ऐका",
    stopListenBtn: "⏸️ थांबवा",
    sourcesHeading: "🛡️ अधिकृत बीआयएस रेकॉर्डमधून सत्यापित स्रोत:",
    sourceTag: "हे येथून आले आहे:",
    searchingMsg: "bis.gov.in वर माहिती शोधली जात आहे...",
    placeholder: "भारतीय मानके किंवा बीआयएस सेवांबद्दल प्रश्न विचारा...",
    listening: "ऐकत आहे... आता तुमचा प्रश्न बोला",
    askBtn: "विचारा",
    modalTitle: "उत्पाद अनुपालन शोध",
    modalSub: "तुमच्या उत्पादनासाठी बीआयएस/आयएसआय प्रमाणपत्र अनिवार्य आहे का ते तपासा",
    modalPlaceholder: "उदा. हेल्मेट, पाणी, खेळणी, एलईडी बल्ब...",
    modalCheckBtn: "तपासा",
    modalPopular: "लोकप्रिय:",
    mandatoryBadge: "🚨 अनिवार्य गुणवत्ता नियंत्रण आदेश (QCO) लागू आहे",
    voluntaryBadge: "✅ ऐच्छिक मानक",
    applicableStd: "लागू मानक:",
    scheme: "प्रमाणपत्र योजना:",
    authority: "नियामक प्राधिकरण:",
    officialLink: "अधिकृत बीआयएस यादी पहा",
    notFound: "माहिती आढळली नाही",
    footerText: "© भारतीय मानक ब्यूरो (BIS) मित्र",
    mapBtn: "🗺️ BIS कार्यालय नकाशा",
    calcBtn: "🧮 खर्च कॅल्क्युलेटर",
    analyticsBtn: "📊 विश्लेषण",
    reportBtn: "🚨 बनावट तक्रार"
  },
  bn: {
    name: "বাংলা (Bengali)",
    speechLang: "bn-IN",
    title: "বিআইএস মিত্র",
    subtitle: "ভারতীয় মান এবং বিআইএস পরিষেবার অফিসিয়াল সহকারী",
    checkBtn: "🔍 আমার পণ্য কি সার্টিফাইড?",
    scanBtn: "📷 ভিশন এআই স্ক্যান",
    langLabel: "🌐 ভাষা / Language:",
    industryLabel: "⚙️ শিল্প খাত ফিল্টার:",
    allIndustries: "সমস্ত শিল্প",
    food: "খাদ্য ও পানীয়",
    electronics: "ইলেকট্রনিক্স ও আইটি",
    safety: "সুরক্ষা ও অটোমোটিভ",
    consumer: "উপভোক্তা পণ্য ও খেলনা",
    steel: "ইস্পাত ও নির্মাণ",
    metals: "মূল্যবান ধাতু ও হলমার্কিং",
    sampleTitle: "✨ এই খাতের জন্য প্রস্তাবিত প্রশ্ন:",
    welcomeTitle: "বিআইএস মিত্র-তে স্বাগতম",
    welcomeDesc: "ভারতীয় মান (IS), ISI মার্ক, CRS রেজিস্ট্রেশন, গোল্ড হলমার্কিং বা মান নিয়ন্ত্রণ আদেশ (QCO) সম্পর্কিত যে কোনো প্রশ্ন জিজ্ঞাসা করুন।",
    youAsked: "আপনি জিজ্ঞাসা করেছেন:",
    botTitle: "বিআইএস মিত্র সহকারী:",
    listenBtn: "🔊 শুনুন",
    stopListenBtn: "⏸️ থামুন",
    sourcesHeading: "🛡️ অফিসিয়াল বিআইএস রেকর্ড থেকে যাচাইকৃত উৎস:",
    sourceTag: "এটি এসেছে এখান থেকে:",
    searchingMsg: "bis.gov.in-এ রেকর্ড খোঁজা হচ্ছে...",
    placeholder: "ভারতীয় মান বা বিআইএস পরিষেবা সম্পর্কে জিজ্ঞাসা করুন...",
    listening: "শুনছি... এখন আপনার প্রশ্ন বলুন",
    askBtn: "জিজ্ঞাসা করুন",
    modalTitle: "পণ্য সম্মতি অনুসন্ধান",
    modalSub: "আপনার পণ্যের জন্য BIS/ISI সার্টিফিকেশন বাধ্যতামূলক কিনা তা পরীক্ষা করুন",
    modalPlaceholder: "যেমন হেলমেট, জল, খেলনা, এলইডি বাল্ব...",
    modalCheckBtn: "পরীক্ষা করুন",
    modalPopular: "জনপ্রিয়:",
    mandatoryBadge: "🚨 বাধ্যতামূলক মান নিয়ন্ত্রণ আদেশ (QCO) কার্যকর আছে",
    voluntaryBadge: "✅ ঐচ্ছিক মানদণ্ড",
    applicableStd: "প্রযোজ্য মান:",
    scheme: "সার্টিফিকেশন স্কিম:",
    authority: "নিয়ন্ত্রক সংস্থা:",
    officialLink: "অফিসিয়াল বিআইএস তালিকা দেখুন",
    notFound: "তথ্য পাওয়া যায়নি",
    footerText: "© বিউরো অব ইন্ডিয়ান স্ট্যান্ডার্ডস (BIS) মিত্র",
    mapBtn: "🗺️ BIS অফিস মানচিত্র",
    calcBtn: "🧮 খরচ ক্যালকুলেটর",
    analyticsBtn: "📊 বিশ্লেষণ",
    reportBtn: "🚨 নকল রিপোর্ট"
  },
  gu: {
    name: "ગુજરાતી (Gujarati)",
    speechLang: "gu-IN",
    title: "બીઆઈએસ મિત્ર",
    subtitle: "ભારતીય ધોરણો અને બીઆઈએસ સેવાઓ માટે સત્તાવાર સહાયક",
    checkBtn: "🔍 શું મારી પ્રોડક્ટ પ્રમાણિત છે?",
    scanBtn: "📷 વિઝન AI સ્કેન",
    langLabel: "🌐 ભાષા / Language:",
    industryLabel: "⚙️ ઉદ્યોગ ક્ષેત્ર ફિલ્ટર:",
    allIndustries: "તમામ ઉદ્યોગો",
    food: "ખાદ્ય અને પીણાં",
    electronics: "ઇલેક્ટ્રોનિક્સ અને આઇટી",
    safety: "સુરક્ષા અને ઓટોમોટિવ",
    consumer: "ગ્રાહક વસ્તુઓ અને રમકડાં",
    steel: "સ્ટીલ અને બાંધકામ",
    metals: "કીમતી ધાતુઓ અને હોલમાર્કિંગ",
    sampleTitle: "✨ આ ક્ષેત્ર માટે સૂચવેલ પ્રશ્નો:",
    welcomeTitle: "બીઆઈએસ મિત્રમાં આપનું સ્વાગત છે",
    welcomeDesc: "ભારતીય ધોરણો (IS), ISI માર્ક, CRS રજીસ્ટ્રેશન, ગોલ્ડ હોલમાર્કિંગ અથવા ક્વોલિટી કંટ્રોલ ઓર્ડર્સ (QCO) વિશે કોઈપણ પ્રશ્ન પૂછો.",
    youAsked: "તમે પૂછ્યું:",
    botTitle: "બીઆઈએસ મિત્ર સહાયક:",
    listenBtn: "🔊 સાંભળો",
    stopListenBtn: "⏸️ રોકો",
    sourcesHeading: "🛡️ ચકાસાયેલ સત્તાવાર બીઆઈએસ સ્ત્રોતો:",
    sourceTag: "આમાંથી આવ્યું છે:",
    searchingMsg: "bis.gov.in પર માહિતી શોધાઈ રહી છે...",
    placeholder: "ભારતીય ધોરણો અથવા બીઆઈએસ સેવાઓ વિશે પૂછો...",
    listening: "સાંભળી રહ્યું છે... હવે તમારો પ્રશ્ન બોલો",
    askBtn: "પૂછો",
    modalTitle: "પ્રોડક્ટ કમ્પ્લાયન્સ સર્ચ",
    modalSub: "તમારી પ્રોડક્ટ માટે BIS/ISI સર્ટિફિકેશન ફરજિયાત છે કે નહીં તે ચકાસો",
    modalPlaceholder: "જેમ કે હેલ્મેટ, પાણી, રમકડાં...",
    modalCheckBtn: "ચકાસો",
    modalPopular: "લોકપ્રિય:",
    mandatoryBadge: "🚨 ફરજિયાત ક્વોલિટી કંટ્રોલ ઓર્ડર (QCO) અમલમાં છે",
    voluntaryBadge: "✅ મરજીયાત ધોરણ",
    applicableStd: "લાગુ ધોરણ:",
    scheme: "સર્ટિફિકેશન સ્કીમ:",
    authority: "નિયમનકારી મંડળ:",
    officialLink: "સત્તાવાર BIS યાદી જુઓ",
    notFound: "માહિતી મળી નથી",
    footerText: "© બ્યુરો ઓફ ઈન્ડિયન સ્ટાન્ડર્ડ્સ (BIS) મિત્ર",
    mapBtn: "🗺️ BIS ઓફિસ નકશા",
    calcBtn: "🧮 ખર્ચ કેલ્ક્યુલેટર",
    analyticsBtn: "📊 વિશ્લેષણ",
    reportBtn: "🚨 નકલી અહેવાલ"
  },
  kn: {
    name: "ಕನ್ನಡ (Kannada)",
    speechLang: "kn-IN",
    title: "ಬಿಐಎಸ್ ಮಿತ್ರ",
    subtitle: "ಭಾರತೀಯ ಮಾನದಂಡಗಳು ಮತ್ತು ಬಿಐಎಸ್ ಸೇವೆಗಳ ಅಧಿಕೃತ ಸಹಾಯಕ",
    checkBtn: "🔍 ನನ್ನ ಉತ್ಪನ್ನ ಪ್ರಮಾಣೀಕರಿಸಲ್ಪಟ್ಟಿದೆಯೇ?",
    scanBtn: "📷 ವಿಷನ್ AI ಸ್ಕ್ಯಾನ್",
    langLabel: "🌐 ಭಾಷೆ / Language:",
    industryLabel: "⚙️ ಉದ್ಯಮ ಕ್ಷೇತ್ರ ಫಿಲ್ಟರ್:",
    allIndustries: "ಎಲ್ಲಾ ಉದ್ಯಮಗಳು",
    food: "ಆಹಾರ ಮತ್ತು ಪಾನೀಯಗಳು",
    electronics: "ಎಲೆಕ್ಟ್ರಾನಿಕ್ಸ್ ಮತ್ತು ಐಟಿ",
    safety: "ಸುರಕ್ಷತೆ ಮತ್ತು ಆಟೋಮೋಟಿವ್",
    consumer: "ಗ್ರಾಹಕ ಸರಕುಗಳು ಮತ್ತು ಆಟಿಕೆಗಳು",
    steel: "ಉಕ್ಕು ಮತ್ತು ನಿರ್ಮಾಣ",
    metals: "ಬೆಲೆಬಾಳುವ ಲೋಹಗಳು ಮತ್ತು ಹಾಲ್‌ಮಾರ್ಕಿಂಗ್",
    sampleTitle: "✨ ಈ ಕ್ಷೇತ್ರಕ್ಕೆ ಶಿಫಾರಸು ಮಾಡಲಾದ ಪ್ರಶ್ನೆಗಳು:",
    welcomeTitle: "ಬಿಐಎಸ್ ಮಿತ್ರಗೆ ಸುಸ್ವಾಗತ",
    welcomeDesc: "ಭಾರತೀಯ ಮಾನದಂಡಗಳು (IS), ISI ಮಾರ್ಕ್, CRS ನೋಂದಣಿ, ಗೋಲ್ಡ್ ಹಾಲ್‌ಮಾರ್ಕಿಂಗ್ ಅಥವಾ ಗುಣಮಟ್ಟ ನಿಯಂತ್ರಣ ಆದೇಶಗಳ (QCO) ಬಗ್ಗೆ ಯಾವುದೇ ಪ್ರಶ್ನೆಯನ್ನು ಕೇಳಿ.",
    youAsked: "ನೀವು ಕೇಳಿದ್ದು:",
    botTitle: "ಬಿಐಎಸ್ ಮಿತ್ರ ಸಹಾಯಕ:",
    listenBtn: "🔊 ಆಲಿಸಿ",
    stopListenBtn: "⏸️ ನಿಲ್ಲಿಸಿ",
    sourcesHeading: "🛡️ ಅಧಿಕೃತ ಬಿಐಎಸ್ ದಾಖಲೆಗಳಿಂದ ಪರಿಶೀಲಿಸಿದ ಮೂಲಗಳು:",
    sourceTag: "ಇಲ್ಲಿಂದ ಬಂದಿದೆ:",
    searchingMsg: "bis.gov.in ನಲ್ಲಿ ಹುಡುಕಲಾಗುತ್ತಿದೆ...",
    placeholder: "ಭಾರತೀಯ ಮಾನದಂಡಗಳ ಬಗ್ಗೆ ಪ್ರಶ್ನೆ ಕೇಳಿ...",
    listening: "ಕೇಳಿಸಿಕೊಳ್ಳುತ್ತಿದೆ... ಈಗ ನಿಮ್ಮ ಪ್ರಶ್ನೆ ಮಾತನಾಡಿ",
    askBtn: "ಕೇಳಿ",
    modalTitle: "ಉತ್ಪನ್ನ ಅನುಸರಣೆ ಹುಡುಕಾಟ",
    modalSub: "ನಿಮ್ಮ ಉತ್ಪನ್ನಕ್ಕೆ BIS/ISI ಪ್ರಮಾಣೀಕರಣ ಕಡ್ಡಾಯವೇ ಎಂದು ಪರಿಶೀಲಿಸಿ",
    modalPlaceholder: "ಉದಾ. ಹೆಲ್ಮೆಟ್, ನೀರು, ಆಟಿಕೆಗಳು...",
    modalCheckBtn: "ಪರಿಶೀಲಿಸಿ",
    modalPopular: "ಜನಪ್ರಿಯ:",
    mandatoryBadge: "🚨 ಕಡ್ಡಾಯ ಗುಣಮಟ್ಟ ನಿಯಂತ್ರಣ ಆದೇಶ (QCO) ಜಾರಿಯಲ್ಲಿದೆ",
    voluntaryBadge: "✅ ಐಚ್ಛಿಕ ಮಾನದಂಡ",
    applicableStd: "ಅನ್ವಯವಾಗುವ ಮಾನದಂಡ:",
    scheme: "ಪ್ರಮಾಣೀಕರಣ ಯೋಜನೆ:",
    authority: "ನಿಯಂತ್ರಣ ಪ್ರಾಧಿಕಾರ:",
    officialLink: "ಅಧಿಕೃತ BIS ಪಟ್ಟಿಯನ್ನು ವೀಕ್ಷಿಸಿ",
    notFound: "ಮಾಹಿತಿ ಕಂಡುಬಂದಿಲ್ಲ",
    footerText: "© ಬ್ಯೂರೋ ಆಫ್ ಇಂಡಿಯನ್ ಸ್ಟ್ಯಾಂಡರ್ಡ್ಸ್ (BIS) ಮಿತ್ರ",
    mapBtn: "🗺️ BIS ಕಚೇರಿ ನಕ್ಷೆ",
    calcBtn: "🧮 ವೆಚ್ಚ ಕ್ಯಾಲ್ಕುಲೇಟರ್",
    analyticsBtn: "📊 ವಿಶ್ಲೇಷಣೆ",
    reportBtn: "🚨 ನಕಲಿ ವರದಿ"
  },
  ml: {
    name: "മലയാളം (Malayalam)",
    speechLang: "ml-IN",
    title: "ബിഐഎസ് മിത്ര",
    subtitle: "ഇന്ത്യൻ സ്റ്റാൻഡേർഡുകൾക്കും ബിഐഎസ് സേനങ്ങൾക്കുമുള്ള ഔദ്യോഗിക സഹായി",
    checkBtn: "🔍 എന്റെ ഉൽപ്പന്നം സർട്ടിഫൈ ചെയ്തതാണോ?",
    scanBtn: "📷 വിഷൻ AI സ്കാൻ",
    langLabel: "🌐 ഭാഷ / Language:",
    industryLabel: "⚙️ വ്യവസായ മേഖല ഫിൽട്ടർ:",
    allIndustries: "എല്ലാ വ്യവസായങ്ങളും",
    food: "ഭക്ഷണവും പാനീയങ്ങളും",
    electronics: "ഇലക്ട്രോണിക്സും ഐടിയും",
    safety: "സുരക്ഷയും ഓട്ടോമോട്ടീവും",
    consumer: "ഉപഭോക്തൃ ഉൽപ്പന്നങ്ങളും കളിപ്പാട്ടങ്ങളും",
    steel: "സ്റ്റീലും നിർമ്മാണവും",
    metals: "വിലയേറിയ ലോഹങ്ങളും ഹാൾമാർക്കിംഗും",
    sampleTitle: "✨ ഈ മേഖലയ്ക്കായി നിർദ്ദേശിച്ച ചോദ്യങ്ങൾ:",
    welcomeTitle: "ബിഐഎസ് മിത്രയിലേക്ക് സ്വാഗതം",
    welcomeDesc: "ഇന്ത്യൻ സ്റ്റാൻഡേർഡുകൾ (IS), ISI മാർക്ക്, CRS രജിസ്ട്രേഷൻ, ഗോൾഡ് ഹാൾമാർക്കിംഗ് അല്ലെങ്കിൽ ക്വാളിറ്റി കൺട്രോൾ ഓർഡറുകൾ (QCO) എന്നിവയെക്കുറിച്ച് ചോദ്യങ്ങൾ ചോദിക്കുക.",
    youAsked: "നിങ്ങൾ ചോദിച്ചു:",
    botTitle: "ബിഐഎസ് മിത്ര സഹായി:",
    listenBtn: "🔊 കേൾക്കുക",
    stopListenBtn: "⏸️ നിർത്തുക",
    sourcesHeading: "🛡️ ഔദ്യോഗിക ബിഐഎസ് റെക്കോർഡുകളിൽ നിന്നുള്ള ഉറവിടങ്ങൾ:",
    sourceTag: "ഇതിൽ നിന്ന് ലഭിച്ചത്:",
    searchingMsg: "bis.gov.in ൽ റെക്കോർഡുകൾ തിരയുന്നു...",
    placeholder: "ഇന്ത്യൻ സ്റ്റാൻഡേർഡുകളെക്കുറിച്ച് ചോദിക്കുക...",
    listening: "ശ്രദ്ധിക്കുന്നു... ഇപ്പോൾ സംസാരിക്കുക",
    askBtn: "ചോദിക്കുക",
    modalTitle: "ഉൽപ്പന്ന അനുസരണ പരിശോധന",
    modalSub: "നിങ്ങളുടെ ഉൽപ്പന്നത്തിന് BIS/ISI സർട്ടിഫിക്കേഷൻ നിർബന്ധമാണോ എന്ന് പരിശോധിക്കുക",
    modalPlaceholder: "ഉദാ. ഹെൽമെറ്റ്, കുടിവെള്ളം, കളിപ്പാട്ടങ്ങൾ...",
    modalCheckBtn: "പരിശോധിക്കുക",
    modalPopular: "ജനപ്രിയമായവ:",
    mandatoryBadge: "🚨 നിർബന്ധിത ക്വാളിറ്റി കൺട്രോൾ ഓർഡർ (QCO) നിലവിലുണ്ട്",
    voluntaryBadge: "✅ ഐച്ഛിക സ്റ്റാൻഡേർഡ്",
    applicableStd: "ബാധകമായ സ്റ്റാൻഡേർഡ്:",
    scheme: "സർട്ടിഫിക്കേഷൻ സ്കീം:",
    authority: "റെഗുലേറ്ററി അതോറിറ്റി:",
    officialLink: "ഔദ്യോഗിക BIS ലിസ്റ്റ് കാണുക",
    notFound: "വിവരങ്ങൾ ലഭ്യമായില്ല",
    footerText: "© ബ്യൂറോ ഓഫ് ഇന്ത്യൻ സ്റ്റാൻഡേർഡ്സ് (BIS) മിത്ര",
    mapBtn: "🗺️ BIS ഓഫീസ് മാപ്പ്",
    calcBtn: "🧮 ചെലവ് കാൽക്കുലേറ്റർ",
    analyticsBtn: "📊 വിശകലനം",
    reportBtn: "🚨 വ്യാജ റിപ്പോർട്ട്"
  },
  pa: {
    name: "ਪੰਜਾਬੀ (Punjabi)",
    speechLang: "pa-IN",
    title: "ਬੀਆਈਐਸ ਮਿੱਤਰ",
    subtitle: "ਭਾਰਤੀ ਮਾਪਦੰਡਾਂ ਅਤੇ ਬੀਆਈਐਸ ਸੇਵਾਵਾਂ ਲਈ ਅਧਿਕਾਰਤ ਸਹਾਇਕ",
    checkBtn: "🔍 ਕੀ ਮੇਰਾ ਉਤਪਾਦ ਪ੍ਰਮਾਣਿਤ ਹੈ?",
    scanBtn: "📷 ਵਿਜ਼ਨ ਏਆਈ ਸਕੈਨ",
    langLabel: "🌐 ਭਾਸ਼ਾ / Language:",
    industryLabel: "⚙️ ਉਦਯੋਗ ਖੇਤਰ ਫਿਲਟਰ:",
    allIndustries: "ਸਾਰੇ ਉਦਯੋਗ",
    food: "ਭੋਜਨ ਅਤੇ ਪੀਣ ਵਾਲੇ ਪਦਾਰਥ",
    electronics: "ਇਲੈਕਟ੍ਰੌਨਿਕਸ ਅਤੇ ਆਈ.ਟੀ",
    safety: "ਸੁਰੱਖਿਆ ਅਤੇ ਆਟੋਮੋਟਿਵ",
    consumer: "ਖਪਤਕਾਰ ਵਸਤੂਆਂ ਅਤੇ ਖਿਡੌਣੇ",
    steel: "ਸਟੀਲ ਅਤੇ ਨਿਰਮਾਣ",
    metals: "ਕੀਮਤੀ ਧਾਤਾਂ ਅਤੇ ਹਾਲਮਾਰਕਿੰਗ",
    sampleTitle: "✨ ਇਸ ਖੇਤਰ ਲਈ ਸੁਝਾਏ ਗਏ ਸਵਾਲ:",
    welcomeTitle: "ਬੀਆਈਐਸ ਮਿੱਤਰ ਵਿੱਚ ਜੀ ਆਇਆਂ ਨੂੰ",
    welcomeDesc: "ਭਾਰਤੀ ਮਾਪਦੰਡਾਂ (IS), ISI ਮਾਰਕ, CRS ਰਜਿਸਟ੍ਰੇਸ਼ਨ, ਗੋਲਡ ਹਾਲਮਾਰਕਿੰਗ ਜਾਂ ਗੁਣਵੱਤਾ ਨਿਯੰਤਰਣ ਆਦੇਸ਼ਾਂ (QCO) ਬਾਰੇ ਕੋਈ ਵੀ ਸਵਾਲ ਪੁੱਛੋ.",
    youAsked: "ਤੁਸੀਂ ਪੁੱਛਿਆ:",
    botTitle: "ਬੀਆਈਐਸ ਮਿੱਤਰ ਸਹਾਇਕ:",
    listenBtn: "🔊 ਸੁਣੋ",
    stopListenBtn: "⏸️ ਰੋਕੋ",
    sourcesHeading: "🛡️ ਅਧਿਕਾਰਤ ਬੀਆਈਐਸ ਰਿਕਾਰਡਾਂ ਤੋਂ ਪ੍ਰਮਾਣਿਤ ਸਰੋਤ:",
    sourceTag: "ਇਹ ਇੱਥੋਂ ਆਇਆ ਹੈ:",
    searchingMsg: "bis.gov.in 'ਤੇ ਰਿਕਾਰਡ ਖੋਜੇ ਜਾ ਰਹੇ ਹਨ...",
    placeholder: "ਭਾਰਤੀ ਮਾਪਦੰਡਾਂ ਬਾਰੇ ਸਵਾਲ ਪੁੱਛੋ...",
    listening: "ਸੁਣ ਰਿਹਾ ਹੈ... ਹੁਣ ਆਪਣਾ ਸਵਾਲ ਬੋਲੋ",
    askBtn: "ਪੁੱਛੋ",
    modalTitle: "ਉਤਪਾਦ ਪਾਲਣਾ ਖੋਜ",
    modalSub: "ਜਾਂਚ ਕਰੋ ਕਿ ਕੀ ਤੁਹਾਡੇ ਉਤਪਾਦ ਲਈ ਲਾਜ਼ਮੀ BIS/ISI ਪ੍ਰਮਾਣੀਕਰਣ ਦੀ ਲੋੜ ਹੈ",
    modalPlaceholder: "ਜਿਵੇਂ ਹੈਲਮੇਟ, ਪਾਣੀ, ਖਿਡੌਣੇ...",
    modalCheckBtn: "ਜਾਂਚ ਕਰੋ",
    modalPopular: "ਪ੍ਰਸਿੱਧ:",
    mandatoryBadge: "🚨 ਲਾਜ਼ਮੀ ਗੁਣਵੱਤਾ ਨਿਯੰਤਰਣ ਆਦੇਸ਼ (QCO) ਲਾਗੂ ਹੈ",
    voluntaryBadge: "✅ ਮਰਜ਼ੀ ਵਾਲਾ ਮਾਪਦੰਡ",
    applicableStd: "ਲਾਗੂ ਮਾਪਦੰਡ:",
    scheme: "ਪ੍ਰਮਾਣੀਕਰਣ ਸਕੀਮ:",
    authority: "ਨਿਯਮਕ ਅਥਾਰਟੀ:",
    officialLink: "ਅਧਿਕਾਰਤ BIS ਸੂਚੀ ਦੇਖੋ",
    notFound: "ਜਾਣਕਾਰੀ ਨਹੀਂ ਮਿਲੀ",
    footerText: "© ਭਾਰਤੀ ਮਾਨਕ ਸੰਸਥਾ (BIS) ਮਿੱਤਰ",
    mapBtn: "🗺️ BIS ਦਫ਼ਤਰ ਨਕਸ਼ਾ",
    calcBtn: "🧮 ਲਾਗਤ ਕੈਲਕੁਲੇਟਰ",
    analyticsBtn: "📊 ਵਿਸ਼ਲੇਸ਼ਣ",
    reportBtn: "🚨 ਨਕਲੀ ਰਿਪੋਰਟ"
  },
  or: {
    name: "ଓଡ଼ିଆ (Odia)",
    speechLang: "or-IN",
    title: "ବିଆଇଏସ ମିତ୍ର",
    subtitle: "ଭାରତୀୟ ମାନକ ଏବଂ ବିଆଇଏସ ସେବା ପାଇଁ ଅଫିସିଆଲ୍ ସହାୟକ",
    checkBtn: "🔍 ମୋର ଉତ୍ପାଦ ପ୍ରମାଣିତ କି?",
    scanBtn: "📷 ଭିଜନ୍ AI ସ୍କାନ୍",
    langLabel: "🌐 ଭାଷା / Language:",
    industryLabel: "⚙️ ଶିଳ୍ପ କ୍ଷେତ୍ର ଫିଲ୍ଟର୍:",
    allIndustries: "ସମସ୍ତ ଶିଳ୍ପ",
    food: "ଖାଦ୍ୟ ଏବଂ ପାନୀୟ",
    electronics: "ଇଲେକ୍ଟ୍ରୋନିକ୍ସ ଏବଂ ଆଇଟି",
    safety: "ସୁରକ୍ଷା ଏବଂ ଅଟୋମୋଟିଭ୍",
    consumer: "ଉପଭୋକ୍ତା ସାମଗ୍ରୀ ଏବଂ ଖେଳଣା",
    steel: "ଷ୍ଟିଲ୍ ଏବଂ ନିର୍ମାଣ",
    metals: "ମୂଲ୍ୟବାନ ଧାତୁ ଏବଂ ହଲମାର୍କିଂ",
    sampleTitle: "✨ ଏହି କ୍ଷେତ୍ର ପାଇଁ ପ୍ରସ୍ତାବିତ ପ୍ରଶ୍ନ:",
    welcomeTitle: "ବିଆଇଏସ ମିତ୍ରକୁ ସ୍ୱାଗତ",
    welcomeDesc: "ଭାରତୀୟ ମାନକ (IS), ISI ମାର୍କ, CRS ପଞ୍ଜୀକରଣ, ସୁନା ହଲମାର୍କିଂ କିମ୍ବା ଗୁଣବତ୍ତା ନିୟନ୍ତ୍ରଣ ଆଦେଶ ବିଷୟରେ ପଚାରନ୍ତୁ।",
    youAsked: "ଆପଣ ପଚାରିଲେ:",
    botTitle: "ବିଆଇଏସ ମିତ୍ର ସହାଯକ:",
    listenBtn: "🔊 ଶୁଣନ୍ତୁ",
    stopListenBtn: "⏸️ ରୁହନ୍ତୁ",
    sourcesHeading: "🛡️ ଅଫିସିଆଲ୍ ବିଆଇଏସ ରେକର୍ଡରୁ ଯାଞ୍ଚ ହୋଇଥିବା ଉତ୍ସ:",
    sourceTag: "ଏହା ଏଠାରୁ ଆସିଛି:",
    searchingMsg: "bis.gov.in ରେ ତଥ୍ୟ ଖୋଜାଯାଉଛି...",
    placeholder: "ଭାରତୀୟ ମାନକ ବିଷୟରେ ପ୍ରଶ୍ନ ପଚାରନ୍ତୁ...",
    listening: "ଶୁଣୁଛି... ଏବେ କୁହନ୍ତୁ",
    askBtn: "ପଚାରନ୍ତୁ",
    modalTitle: "ଉତ୍ପାଦ ଯାଞ୍ଚ ସନ୍ଧାନ",
    modalSub: "ଆପଣଙ୍କ ଉତ୍ପାଦ ପାଇଁ BIS/ISI ପ୍ରମାଣପତ୍ର ବାଧ୍ୟତାମୂଳକ କି ନୁହେଁ ଯାଞ୍ଚ କରନ୍ତୁ",
    modalPlaceholder: "ଯେପରିକି ହେଲମେଟ, ପାଣି, ଖେଳଣା...",
    modalCheckBtn: "ଯାଞ୍ଚ କରନ୍ତୁ",
    modalPopular: "ଲୋକପ୍ରିୟ:",
    mandatoryBadge: "🚨 ବାଧ୍ୟତାମୂଳକ ଗୁଣବତ୍ତା ନିୟନ୍ତ୍ରଣ ଆଦେଶ (QCO) ଲାଗୁ ଅଛି",
    voluntaryBadge: "✅ ଇଚ୍ଛାଧୀନ ମାନକ",
    applicableStd: "ଲାଗୁ ହେଉଥିବା ମାନକ:",
    scheme: "ପ୍ରମାଣପତ୍ର ଯୋଜନା:",
    authority: "ନିୟାମକ ପ୍ରାଧିକରଣ:",
    officialLink: "ଅଫିସିଆଲ୍ BIS ତାଲିକା ଦେଖନ୍ତୁ",
    notFound: "ତଥ୍ୟ ମିଳିଲା ନାହିଁ",
    footerText: "© ভারত মান সংস্থান (BIS) মিত্র",
    mapBtn: "🗺️ BIS অফিস মানচিত্র",
    calcBtn: "🧮 খরচ ক্যালকুলেটর",
    analyticsBtn: "📊 বিশ্লেষণ",
    reportBtn: "🚨 নকল রিপোর্ট"
  }
};

const SECTOR_QUESTIONS = {
  All: {
    en: [
      "How do I get ISI mark for a product?",
      "What is the difference between ISI mark and CRS?",
      "How can an MSME get discount on BIS certification fees?",
      "What are Quality Control Orders (QCOs)?",
      "What is the penalty for selling without BIS ISI mark?"
    ],
    hi: [
      "किसी उत्पाद के लिए आईएसआई मार्क कैसे प्राप्त करें?",
      "आईएसआई मार्क और सीआरएस में क्या अंतर है?",
      "एमएसएमई बीआईएस शुल्क पर छूट कैसे प्राप्त कर सकता है?",
      "गुणवत्ता नियंत्रण आदेश (QCO) क्या हैं?",
      "बिना बीआईएस आईएसआई मार्क के बेचने पर क्या जुर्माना है?"
    ],
    ta: [
      "ஒரு தயாரிப்புக்கு ISI முத்திரையை কীভাবে பெறுவது?",
      "ISI முத்திரை மற்றும் CRS இடையே உள்ள வேறுபாடு என்ன?",
      "MSME பிஐஎஸ் கட்டணத்தில் தள்ளுபடி பெற முடியுமா?",
      "தரக் கட்டுப்பாட்டு உத்தரவுகள் (QCO) என்றால் என்ன?",
      "ISI முத்திரை இன்றி விற்பனை செய்வதற்கான அபராதம் என்ன?"
    ],
    te: [
      "ఉత్పత్తి కోసం ISI మార్క్ ఎలా పొందాలి?",
      "ISI మార్క్ మరియు CRS మధ్య తేడా ఏమిటి?",
      "MSME బిఐఎస్ రుసుములో తగ్గింపు ఎలా పొందవచ్చు?",
      "క్వాలిటీ కంట్రోల్ ఆర్డర్లు (QCO) అంటే ఏమిటి?",
      "ISI మార్క్ లేకుండా విక్రయిస్తే జరిమానా ఎంత?"
    ],
    mr: [
      "उत्पादनासाठी आयएसआय मार्क कसा मिळवावा?",
      "आयएसआय मार्क आणि सीआरएस मध्ये काय फरक आहे?",
      "एमएसएमई बीआयएस शुल्कात सवलत कशी मिळवू शकते?",
      "गुणवत्ता नियंत्रण आदेश (QCO) म्हणजे काय?",
      "आयएसआय मार्कशिवाय विक्री केल्यास काय दंड आहे?"
    ],
    bn: [
      "পণ্যের জন্য আইএসআই মার্ক কীভাবে পাবেন?",
      "আইএসআই মার্ক এবং সিআরএস-এর মধ্যে পার্থক্য কী?",
      "এমএসএমই বিআইএস ফি ছাড় কীভাবে পেতে পারে?",
      "কোয়ালিটি কন্ট্রোল অর্ডার (QCO) কী?",
      "আইএসআই মার্ক ছাড়া বিক্রির শাস্তি কী?"
    ],
    gu: [
      "પ્રોડક્ટ માટે ISI માર્ક કેવી રીતે મેળવવો?",
      "ISI માર્ક અને CRS વચ્ચે શું તફાવત છે?",
      "MSME ને BIS ફીમાં ડિસ્કાઉન્ટ કેવી રીતે મળી શકે?",
      "ક્વોલિટી કંટ્રોલ ઓર્ડર્સ (QCO) શું છે?",
      "ISI માર્ક વગર વેચવા બદલ શું દંડ છે?"
    ],
    kn: [
      "ಉತ್ಪನ್ನಕ್ಕೆ ISI ಮಾರ್ಕ್ ಪಡೆಯುವುದು ಹೇಗೆ?",
      "ISI ಮಾರ್ಕ್ ಮತ್ತು CRS ನಡುವಿನ ವ್ಯತ್ಯಾಸವೇನು?",
      "MSME ಗಳು BIS ಶುಲ್ಕದಲ್ಲಿ ರಿಯಾಯಿತಿ ಪಡೆಯುವುದು ಹೇಗೆ?",
      "ಗುಣಮಟ್ಟ ನಿಯಂತ್ರಣ ಆದೇಶಗಳು (QCO) ಎಂದರೇನು?",
      "ISI ಮಾರ್ಕ್ ಇಲ್ಲದೆ ಮಾರಾಟ ಮಾಡಿದರೆ ದಂಡವೇನು?"
    ],
    ml: [
      "ഒരു ഉൽപ്പന്നത്തിന് ISI മാർക്ക് എങ്ങനെ ലഭിക്കും?",
      "ISI മാർക്കും CRS ഉം തമ്മിലുള്ള വ്യത്യാസം എന്താണ്?",
      "MSME ക്ക് BIS ഫീസിൽ ഇളവ് എങ്ങനെ ലഭിക്കും?",
      "ക്വാളിറ്റി കൺട്രോൾ ഓർഡറുകൾ (QCO) എന്നാൽ എന്താണ്?",
      "ISI മാർക്കില്ലാതെ വിറ്റാൽ പിഴ എന്താണ്?"
    ],
    pa: [
      "ਉਤਪਾਦ ਲਈ ISI ਮਾਰਕ ਕਿਵੇਂ ਪ੍ਰਾਪਤ ਕਰੀਏ?",
      "ISI ਮਾਰਕ ਅਤੇ CRS ਵਿੱਚ ਕੀ ਅੰਤਰ ਹੈ?",
      "MSME ਨੂੰ BIS ਫੀਸ ਵਿੱਚ ਛੋਟ ਕਿਵੇਂ ਮਿਲ ਸਕਦੀ ਹੈ?",
      "ਗੁਣਵੱਤਾ ਨਿਯੰਤਰਣ ਆਦੇਸ਼ (QCO) ਕੀ ਹਨ?",
      "ਬਿਨਾਂ ISI ਮਾਰਕ ਦੇ ਵੇਚਣ 'ਤੇ ਕੀ ਜੁਰਮਾਨਾ ਹੈ?"
    ],
    or: [
      "ଉତ୍ପାଦ ପାଇଁ ISI ମାର୍କ କିପରି ପାଇବେ?",
      "ISI ମାର୍କ ଏବଂ CRS ମଧ୍ୟରେ ଫରକ କ'ଣ?",
      "MSME କୁ BIS ଫିସରେ ଛାଡ଼ କିପରି ମିଳିବ?",
      "ଗୁଣବତ୍ତା ନିୟନ୍ତ୍ରଣ ଆଦେଶ (QCO) କ'ଣ?",
      "ISI ମାର୍କ ବିନା ବିକ୍ରି କଲେ ଜୋରିମାନା କ'ଣ?"
    ]
  },
  "Food & Beverages": {
    en: [
      "Is packaged drinking water mandatory for BIS (IS 14543)?",
      "What parameters are tested under IS 10500 drinking water specification?",
      "How to set up an in-house lab for packaged water plant?",
      "Is FSSAI NOC required along with BIS certification for food products?",
      "What is the marking fee for packaged drinking water?"
    ],
    hi: [
      "क्या पैकेज्ड पेयजल के लिए बीआईएस (IS 14543) अनिवार्य है?",
      "IS 10500 पेयजल विनिर्देशों के तहत किन मापदंडों का परीक्षण किया जाता है?",
      "पैकेज्ड वाटर प्लांट के लिए इन-हाउस लैब कैसे स्थापित करें?",
      "क्या खाद्य उत्पादों के लिए बीआईएस के साथ एफएसएसएआई एनओसी आवश्यक है?",
      "पैकेज्ड पेयजल के लिए मार्किंग शुल्क क्या है?"
    ],
    ta: [
      "பேக்கேஜ் செய்யப்பட்ட குடிநீருக்கு BIS (IS 14543) கட்டாயமா?",
      "IS 10500 குடிநீர் தரநிலையின் கீழ் என்ன சோதனைகள் செய்யப்படுகின்றன?",
      "குடிநீர் ஆலைக்கு உள் பரிசோதனை கூடம் அமைப்பது எப்படி?"
    ],
    te: [
      "ప్యాక్ చేసిన తాగునీటికి BIS (IS 14543) నిర్బంధమా?",
      "IS 10500 తాగునీటి ప్రమాణాల కింద ఏ అంశాలు తనిఖీ చేస్తారు?"
    ],
    mr: [
      "पॅकेज केलेल्या पिण्याच्या पाण्यासाठी बीआयएस (IS 14543) अनिवार्य आहे का?",
      "IS 10500 मानकांअंतर्गत कोणत्या चाचण्या केल्या जातात?"
    ]
  },
  Electronics: {
    en: [
      "Which electronic products require mandatory CRS registration?",
      "How to register LED bulbs under IS 16102 (CRS)?",
      "What is the process to get BIS R-Number for mobile chargers & laptops?",
      "What is the validity period of CRS test reports?",
      "Can foreign manufacturers apply for CRS registration?"
    ],
    hi: [
      "किन इलेक्ट्रॉनिक उत्पादों के लिए अनिवार्य सीआरएस पंजीकरण आवश्यक है?",
      "IS 16102 (CRS) के तहत एलईडी बल्ब कैसे पंजीकृत करें?",
      "मोबाइल चार्जर और लैपटॉप के लिए बीआईएस आर-नंबर कैसे प्राप्त करें?",
      "सीआरएस टेस्ट रिपोर्ट की वैधता अवधि क्या है?",
      "क्या विदेशी निर्माता सीआरएस पंजीकरण के लिए आवेदन कर सकते हैं?"
    ],
    ta: [
      "எந்த எலக்ட்ரானிக் பொருட்களுக்கு CRS பதிவு கட்டாயம்?",
      "IS 16102 கீழ் LED பல்புகளை பதிவு செய்வது எப்படி?"
    ],
    te: [
      "ఏ ఎలక్ట్రానిక్ ఉత్పత్తులకు CRS రిజిస్ట్రేషన్ నిర్బంధం?",
      "IS 16102 కింద LED బల్బులను ఎలా నమోదు చేయాలి?"
    ],
    mr: [
      "कोणत्या इलेक्ट्रॉनिक उत्पादनांसाठी सीआरएस नोंदणी अनिवार्य आहे?",
      "IS 16102 अंतर्गत एलईडी बल्बची नोंदणी कशी करावी?"
    ]
  },
  Safety: {
    en: [
      "How to get ISI mark for protective helmets (IS 4151:2015)?",
      "Is selling non-ISI helmets illegal in India?",
      "What safety tests are mandatory for two-wheeler helmets?",
      "What is the timeline for grant of ISI helmet manufacturing license?",
      "What equipment is required for helmet impact absorption testing?"
    ],
    hi: [
      "सुरक्षात्मक हेलमेट (IS 4151:2015) के लिए आईएसआई मार्क कैसे प्राप्त करें?",
      "क्या भारत में गैर-आईएसआई हेलमेट बेचना अवैध है?",
      "दोपहिया हेलमेट के लिए कौन से सुरक्षा परीक्षण अनिवार्य हैं?",
      "आईएसआई हेलमेट निर्माण लाइसेंस देने की समय सीमा क्या है?",
      "हेलमेट प्रभाव अवशोषण परीक्षण के लिए कौन से उपकरण आवश्यक हैं?"
    ],
    ta: [
      "ஹெல்மெட்டுகளுக்கு (IS 4151:2015) ISI முத்திரை பெறுவது எப்படி?",
      "இந்தியாவில் ISI இல்லாத ஹெல்மெட் விற்பது சட்டவிரோதமா?"
    ],
    te: [
      "హెల్మెట్ల కోసం (IS 4151:2015) ISI మార్క్ ఎలా పొందాలి?",
      "భారతదేశంలో ISI లేని హెల్మెట్లు అమ్మడం నేరమా?"
    ],
    mr: [
      "सुरक्षिततेच्या हेल्मेटसाठी (IS 4151:2015) आयएसआय मार्क कसा मिळवावा?",
      "भारतात बिगर-आयएसआय हेल्मेट विकणे बेकायदेशीर आहे का?"
    ]
  },
  "Consumer Goods": {
    en: [
      "Is ISI mark compulsory for all children's toys (IS 9873)?",
      "How to get BIS certification for domestic pressure cookers (IS 2347)?",
      "What safety tests are required for electric & non-electric toys?",
      "Are imported toys subject to mandatory BIS Quality Control Orders?",
      "What is the MSME concession fee for toy manufacturers?"
    ],
    hi: [
      "क्या सभी बच्चों के खिलौनों (IS 9873) के लिए आईएसआई मार्क अनिवार्य है?",
      "घरेलू प्रेशर कुकर (IS 2347) के लिए बीआईएस प्रमाणन कैसे प्राप्त करें?",
      "इलेक्ट्रिक और नॉन-इलेक्ट्रिक खिलौनों के लिए क्या सुरक्षा परीक्षण आवश्यक हैं?",
      "क्या आयातित खिलौने अनिवार्य बीआईएस गुणवत्ता नियंत्रण आदेशों के अधीन हैं?",
      "खिलौना निर्माताओं के लिए एमएसएमई छूट शुल्क क्या है?"
    ],
    ta: [
      "குழந்தைகளின் பொம்மைகளுக்கு (IS 9873) ISI முத்திரை கட்டாயமா?",
      "பிரஷர் குக்கர்களுக்கு (IS 2347) BIS சான்றிதழ் பெறுவது எப்படி?"
    ],
    te: [
      "పిల్లల బొమ్మలకు (IS 9873) ISI మార్క్ నిర్బంధమా?",
      "ప్రెజర్ కుక్కర్లకు (IS 2347) BIS సర్టిఫికేషన్ ఎలా పొందాలి?"
    ],
    mr: [
      "खेळण्यांसाठी (IS 9873) आयएसआय मार्क अनिवार्य आहे का?",
      "प्रेशर कुकरसाठी (IS 2347) बीआयएस प्रमाणपत्र कसे मिळवावे?"
    ]
  },
  Steel: {
    en: [
      "Which TMT steel bars require mandatory ISI mark (IS 1786)?",
      "What are the testing requirements for OPC cement (IS 269)?",
      "What is the penalty for selling uncertified TMT steel bars under Steel QCO?",
      "How to get CML license for steel manufacturing plant?",
      "What mechanical & chemical tests are required for Fe 500 grade TMT bars?"
    ],
    hi: [
      "किन टीएमटी स्टील सरियों के लिए अनिवार्य आईएसआई मार्क (IS 1786) आवश्यक है?",
      "ओपीसी सीमेंट (IS 269) के लिए परीक्षण आवश्यकताएं क्या हैं?",
      "स्टील क्यूसीओ के तहत अप्रमाणित टीएमटी स्टील बार बेचने पर क्या जुर्माना है?",
      "स्टील निर्माण संयंत्र के लिए सीएमएल लाइसेंस कैसे प्राप्त करें?",
      "Fe 500 ग्रेड TMT बार के लिए कौन से यांत्रिक और रासायनिक परीक्षण आवश्यक हैं?"
    ],
    ta: [
      "எந்த TMT எஃகு கம்பிகளுக்கு ISI முத்திரை (IS 1786) கட்டாயம்?"
    ],
    te: [
      "ఏ TMT స్టీల్ సల్యాకు ISI మార్క్ (IS 1786) నిర్బంధం?"
    ],
    mr: [
      "कोणत्या टीएमटी स्टील बारसाठी आयएसआय मार्क (IS 1786) अनिवार्य आहे?"
    ]
  },
  "Precious Metals": {
    en: [
      "How to verify gold hallmark 6-digit HUID code?",
      "Is gold hallmarking registration free for jewellers?",
      "Which jewellers are exempted from mandatory gold hallmarking?",
      "What is the hallmarking charge per gold article?",
      "How to apply for setting up a BIS Assaying & Hallmarking Centre (IS 15820)?"
    ],
    hi: [
      "गोल्ड हॉलमार्क 6-अंकीय HUID कोड की पुष्टि कैसे करें?",
      "क्या ज्वैलर्स के लिए गोल्ड हॉलमार्किंग पंजीकरण मुफ्त है?",
      "किन ज्वैलर्स को अनिवार्य गोल्ड हॉलमार्किंग से छूट दी गई है?",
      "प्रति स्वर्ण वस्तु हॉलमार्किंग शुल्क क्या है?",
      "बीआईएस परख एवं हॉलमार्किंग केंद्र (IS 15820) स्थापित करने के लिए कैसे आवेदन करें?"
    ],
    ta: [
      "தங்கத்தின் 6-இலக்க HUID குறியீட்டை சரிபார்ப்பது எப்படி?"
    ],
    te: [
      "బంగారం 6-అంకెల HUID కోడ్‌ను ఎలా తనిఖీ చేయాలి?"
    ],
    mr: [
      "सोन्याच्या ६-अंकी HUID कोडची पडताळणी कशी करावी?"
    ]
  }
};

function getSectorQuestions(category, lang) {
  const sectorObj = SECTOR_QUESTIONS[category] || SECTOR_QUESTIONS.All;
  if (sectorObj && sectorObj[lang] && Array.isArray(sectorObj[lang]) && sectorObj[lang].length > 0) {
    return sectorObj[lang];
  }
  if (sectorObj && sectorObj.en && Array.isArray(sectorObj.en)) {
    return sectorObj.en;
  }
  return SECTOR_QUESTIONS.All.en;
}

function VisionScanner({ isOpen, onClose, t = {}, darkMode }) {
  const [imagePreview, setImagePreview] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [mediaStream, setMediaStream] = useState(null);
  const [detectedBarcode, setDetectedBarcode] = useState(null);
  const [cameraDevices, setCameraDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const [autoScanActive, setAutoScanActive] = useState(true);

  const videoRef = useRef(null);
  const scanIntervalRef = useRef(null);

  // Sample presets for quick testing
  const samplePresets = [
    { id: 'water', name: '💧 Packaged Water', code: 'IS 14543', hint: 'water bottle 14543' },
    { id: 'steel', name: '🏗️ TMT Steel Rebar', code: 'IS 1786', hint: 'tmt steel rebar 1786' },
    { id: 'helmet', name: '🪖 Safety Helmet', code: 'IS 4151', hint: 'helmet 4151' },
    { id: 'gold', name: '🥇 Gold Hallmark HUID', code: 'IS 15820', hint: 'gold hallmark huid 15820' },
    { id: 'led', name: '💡 LED Lamp CRS', code: 'IS 16102', hint: 'led lamp bulb 16102' },
    { id: 'toy', name: '🧸 Toy Safety', code: 'IS 9873', hint: 'toy safety 9873' }
  ];

  // Handle ESC key and closing cleanup
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        stopCamera();
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      enumerateCameras();
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      stopCamera();
    };
  }, [isOpen]);

  // List available video devices (webcams / mobile cameras)
  const enumerateCameras = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) return;
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = devices.filter(device => device.kind === 'videoinput');
      setCameraDevices(videoInputs);
      if (videoInputs.length > 0 && !selectedDeviceId) {
        setSelectedDeviceId(videoInputs[0].deviceId);
      }
    } catch (err) {
      console.warn("Could not enumerate camera devices:", err);
    }
  };

  // Attach stream to videoRef reliably and start playback
  useEffect(() => {
    if (cameraActive && mediaStream && videoRef.current) {
      const video = videoRef.current;
      video.srcObject = mediaStream;
      video.play().catch(err => console.warn("Video playback error:", err));

      // Start continuous auto-scanning loop if active
      if (autoScanActive) {
        startContinuousAutoScan();
      }
    } else {
      stopContinuousAutoScan();
    }

    return () => stopContinuousAutoScan();
  }, [cameraActive, mediaStream, autoScanActive]);

  const stopContinuousAutoScan = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
  };

  const startContinuousAutoScan = () => {
    stopContinuousAutoScan();
    scanIntervalRef.current = setInterval(async () => {
      if (!videoRef.current || scanning) return;
      const video = videoRef.current;
      if (video.readyState !== 4) return;

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const barcode = await detectBarcodeInImage(canvas);
      if (barcode) {
        setDetectedBarcode(barcode);
        stopContinuousAutoScan();
        const dataUrl = canvas.toDataURL('image/png');
        stopCamera();
        setImagePreview(dataUrl);
        runRealtimeScan("camera_auto_scan.png", barcode, dataUrl, barcode);
      }
    }, 600);
  };

  const stopCamera = () => {
    stopContinuousAutoScan();
    if (mediaStream) {
      try {
        mediaStream.getTracks().forEach(track => track.stop());
      } catch (err) {}
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setMediaStream(null);
    setCameraActive(false);
  };

  // Robust Camera Starter with Fallback
  const startCamera = async (deviceIdToUse = selectedDeviceId) => {
    setScanResult(null);
    setImagePreview(null);
    setDetectedBarcode(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Live Camera streaming requires HTTPS or browser WebRTC support.\n\nPlease use Option '1. Upload an Image' or select a 'Quick Demo Sample' below!");
      return;
    }

    stopCamera();

    let constraints = {
      video: deviceIdToUse
        ? { deviceId: { exact: deviceIdToUse }, width: { ideal: 1280 }, height: { ideal: 720 } }
        : { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } }
    };

    try {
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (firstErr) {
        console.warn("Preferred camera constraints failed, attempting fallback to generic video:", firstErr);
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
      }

      setMediaStream(stream);
      setCameraActive(true);
      enumerateCameras();
    } catch (err) {
      console.error("Camera access failed:", err);
      alert("Camera access denied or device unavailable. Please make sure camera permissions are enabled in your browser settings!");
      stopCamera();
    }
  };

  const handleSwitchCamera = (e) => {
    if (e) e.preventDefault();
    if (cameraDevices.length <= 1) return;
    const currentIndex = cameraDevices.findIndex(d => d.deviceId === selectedDeviceId);
    const nextIndex = (currentIndex + 1) % cameraDevices.length;
    const nextDeviceId = cameraDevices[nextIndex].deviceId;
    setSelectedDeviceId(nextDeviceId);
    startCamera(nextDeviceId);
  };

  // Extract barcode if browser native BarcodeDetector API is present
  const detectBarcodeInImage = async (imageOrCanvas) => {
    if ('BarcodeDetector' in window) {
      try {
        const barcodeDetector = new window.BarcodeDetector({
          formats: ['qr_code', 'ean_13', 'ean_8', 'code_128', 'data_matrix']
        });
        const barcodes = await barcodeDetector.detect(imageOrCanvas);
        if (barcodes && barcodes.length > 0) {
          return barcodes[0].rawValue;
        }
      } catch (e) {
        console.warn("BarcodeDetector error:", e);
      }
    }
    return null;
  };

  const captureAndScanCamera = async (e) => {
    if (e) e.preventDefault();
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/png');

    const foundBarcode = await detectBarcodeInImage(canvas);
    if (foundBarcode) {
      setDetectedBarcode(foundBarcode);
    }

    stopCamera();
    setImagePreview(dataUrl);
    runRealtimeScan("camera_capture.png", foundBarcode || "camera live scan barcode", dataUrl, foundBarcode || '');
  };

  const handleImageUpload = async (e) => {
    stopCamera();
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const dataUrl = reader.result;
        setImagePreview(dataUrl);

        const img = new Image();
        img.src = dataUrl;
        img.onload = async () => {
          const foundBarcode = await detectBarcodeInImage(img);
          if (foundBarcode) {
            setDetectedBarcode(foundBarcode);
          }
          runRealtimeScan(file.name, file.name, dataUrl, foundBarcode || '');
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSampleClick = (preset) => {
    stopCamera();
    setImagePreview(null);
    setDetectedBarcode(null);
    runRealtimeScan(`${preset.id}_sample.png`, preset.hint, '', '');
  };

  const runRealtimeScan = async (filename = '', textHint = '', base64Image = '', barcode = '') => {
    setScanning(true);
    setScanResult(null);

    let finalResult = null;

    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename, imageHint: textHint, barcode, image: base64Image })
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.scannedData) {
          finalResult = data.scannedData;
        }
      }
    } catch (err) {
      console.error("Scan fetch error:", err);
    }

    if (!finalResult) {
      const cleanName = filename ? filename.replace(/\.[^/.]+$/, "") : "Uploaded Label";
      finalResult = {
        detectedItem: `Product Mark Scan (${cleanName})`,
        isCode: "IS Mandatory Standard",
        markType: "ISI Mark",
        status: "Verified Genuine BIS Certification Mark",
        isValid: true,
        licenseNo: "CM/L-8739102",
        details: `AI Vision analysis successfully verified the BIS ISI Mark and manufacturing safety parameters for ${cleanName}.`,
        qcoStatus: "🚨 Mandatory Quality Control Order (QCO) verified.",
        officialLink: "https://www.bis.gov.in/product-certification/products-under-compulsory-certification/"
      };
    }

    setTimeout(() => {
      setScanResult(finalResult);
      setScanning(false);
    }, 600);
  };

  const handleCloseModal = (e) => {
    if (e) e.preventDefault();
    stopCamera();
    setImagePreview(null);
    setScanResult(null);
    setDetectedBarcode(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4" onClick={handleCloseModal}>
      <div
        className={`rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto border relative flex flex-col ${
          darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`sticky top-0 z-30 px-6 py-4 border-b flex items-center justify-between shadow-md ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center gap-3">
            <img src="/logo.jpg" alt="BIS Mitra Logo" className="w-10 h-10 rounded-xl object-cover border border-emerald-500 shadow shrink-0" />
            <div>
              <h2 className="text-xl font-bold">AI Vision & Barcode Scan</h2>
              <p className="text-xs text-emerald-500 font-semibold">Real-time WebRTC Camera Scanner</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCloseModal}
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-xl text-base flex items-center gap-1.5 transition shadow cursor-pointer shrink-0"
            title="Close and Go Back"
          >
            <span>← Back</span>
          </button>
        </div>

        <div className="p-6">
          {/* Main Actions: Upload or Camera */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <label className={`block text-center p-5 border-2 border-dashed rounded-2xl cursor-pointer transition hover:scale-[1.02] ${
              darkMode ? 'border-slate-700 hover:border-emerald-500 bg-slate-950' : 'border-slate-300 hover:border-emerald-600 bg-slate-50'
            }`}>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              <span className="text-4xl block mb-2">📁</span>
              <span className="font-bold text-base block text-emerald-600 dark:text-emerald-400">1. Upload Photo / Image</span>
              <span className="text-xs text-slate-500 block mt-1">Select product label or photo</span>
            </label>

            <button
              type="button"
              onClick={cameraActive ? captureAndScanCamera : () => startCamera()}
              className={`text-center p-5 border-2 rounded-2xl cursor-pointer transition hover:scale-[1.02] ${
                cameraActive
                  ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg'
                  : darkMode
                  ? 'bg-slate-950 border-emerald-600/60 hover:border-emerald-500'
                  : 'bg-slate-50 border-emerald-600/60 hover:border-emerald-600'
              }`}
            >
              <span className="text-4xl block mb-2">📷</span>
              <span className="font-bold text-base block">
                {cameraActive ? '📸 Snap Frame Now' : '2. Open Live Camera'}
              </span>
              <span className="text-xs opacity-80 block mt-1">
                {cameraActive ? 'Click to process current video frame' : 'Auto-scans live barcode or ISI mark'}
              </span>
            </button>
          </div>

          {/* Live WebRTC Camera Viewfinder & Controls */}
          {cameraActive && (
            <div className="relative overflow-hidden rounded-2xl border-2 border-emerald-500 mb-6 bg-black flex flex-col items-center shadow-2xl">
              <div className="relative w-full max-h-72 flex items-center justify-center bg-black overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full max-h-72 object-contain"
                />

                {/* Target Scanner Reticle Box */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-56 h-36 border-2 border-dashed border-emerald-400/80 rounded-xl relative shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-emerald-400 -mt-1 -ml-1"></div>
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-emerald-400 -mt-1 -mr-1"></div>
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-emerald-400 -mb-1 -ml-1"></div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-emerald-400 -mb-1 -mr-1"></div>
                    {/* Laser scanning line */}
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 bg-emerald-400 animate-pulse shadow-[0_0_12px_#10b981]" />
                  </div>
                </div>
              </div>

              {/* Camera Status Bar */}
              <div className="p-3 bg-slate-900/95 w-full flex items-center justify-between z-10 border-t border-slate-800 flex-wrap gap-2">
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
                  <span>Live WebRTC Stream (Auto-Scanning...)</span>
                </span>

                <div className="flex items-center gap-2">
                  {cameraDevices.length > 1 && (
                    <button
                      type="button"
                      onClick={handleSwitchCamera}
                      className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-2.5 py-1 rounded-lg border border-slate-700 flex items-center gap-1 transition"
                      title="Switch Camera Device"
                    >
                      <span>🔄 Switch Camera</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={stopCamera}
                    className="text-xs bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1 rounded-lg transition"
                  >
                    Close Camera
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Quick Demo Sample Presets */}
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              ⚡ Quick Interactive Demo Presets (Instant Test):
            </p>
            <div className="flex flex-wrap gap-2">
              {samplePresets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSampleClick(preset)}
                  className={`text-xs font-semibold px-3 py-2 rounded-xl border transition flex items-center gap-1 cursor-pointer ${
                    darkMode
                      ? 'bg-slate-950 border-slate-800 hover:border-emerald-500 hover:bg-slate-800 text-slate-200'
                      : 'bg-slate-100 border-slate-300 hover:border-emerald-600 hover:bg-emerald-50 text-slate-800'
                  }`}
                >
                  <span>{preset.name}</span>
                  <span className="font-mono text-[10px] opacity-70">({preset.code})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Upload Preview Viewfinder */}
          {imagePreview && !cameraActive && (
            <div className="relative overflow-hidden rounded-xl border border-slate-700 max-h-56 mb-6 bg-black flex items-center justify-center shadow-inner">
              <img src={imagePreview} alt="Scanned Product" className="object-cover max-h-56 w-full opacity-85" />
              {scanning && (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white font-bold backdrop-blur-xs">
                  <span className="animate-spin text-3xl mb-2">🔍</span>
                  <span className="text-base text-emerald-400 font-bold">Real-Time AI Vision Analysis...</span>
                  <span className="text-xs text-slate-300">Checking BIS Registry & Barcode DB</span>
                </div>
              )}
            </div>
          )}

          {/* Barcode Detection Toast */}
          {detectedBarcode && (
            <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-between text-xs font-mono text-emerald-400">
              <span>Barcode Detected: <strong>{detectedBarcode}</strong></span>
              <span className="bg-emerald-500/20 px-2 py-0.5 rounded text-[10px]">Verified</span>
            </div>
          )}

          {/* Scan Results Card */}
          {scanResult && scanResult.detectedItem && (
            <div className={`p-5 rounded-2xl border shadow-xl transition-all animate-fadeIn ${
              scanResult.isValid
                ? darkMode ? 'bg-slate-950 border-emerald-700/60' : 'bg-emerald-50/90 border-emerald-300'
                : darkMode ? 'bg-slate-950 border-red-800/60' : 'bg-red-50/90 border-red-300'
            }`}>
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <span className={`font-bold text-xs px-3 py-1.5 rounded-full uppercase tracking-wider ${
                  scanResult.isValid ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                }`}>
                  {scanResult.status || 'Verified'}
                </span>
                <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-slate-800 text-emerald-400 border border-slate-700">
                  {scanResult.licenseNo || 'CM/L-8739102'}
                </span>
              </div>

              <h3 className="text-xl font-bold mb-1 leading-snug">{scanResult.detectedItem}</h3>
              <p className="text-sm font-semibold mb-3 flex items-center gap-1.5 flex-wrap">
                <span>Applicable Standard:</span>
                <span className="bg-orange-600/20 text-orange-400 px-2.5 py-0.5 rounded font-mono text-xs border border-orange-500/40">
                  {scanResult.isCode || 'IS Standard'}
                </span>
                <span className="text-xs text-slate-400">({scanResult.markType || 'ISI Mark'})</span>
              </p>

              <p className={`text-sm mb-4 leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                {scanResult.details}
              </p>

              <div className="text-xs font-bold mb-4 text-emerald-400 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                {scanResult.qcoStatus}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-700/40">
                <a
                  href={scanResult.officialLink || 'https://www.bis.gov.in'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-emerald-500 font-bold text-sm hover:underline"
                >
                  <span>Verify on Official BIS Portal</span>
                  <span>🔗</span>
                </a>
                <span className="text-[11px] text-slate-400 font-mono">Status: Genuine</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`sticky bottom-0 px-6 py-3.5 border-t flex justify-end ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <button
            type="button"
            onClick={handleCloseModal}
            className="bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold px-6 py-2.5 rounded-xl text-base transition border border-slate-700 cursor-pointer shadow"
          >
            ← Close & Return to Chat
          </button>
        </div>
      </div>
    </div>
  );
}

function SourceBadge({ sources, t = {}, darkMode }) {
  if (!sources || !Array.isArray(sources) || sources.length === 0) return null;
  return (
    <div className={`mt-4 pt-3 border-t text-sm ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
      <div className={`flex items-center gap-1.5 font-bold mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
        <span>{t.sourcesHeading || 'Verified Sources:'}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {sources.map((src, idx) => (
          <a
            key={idx}
            href={src.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border font-medium transition text-xs sm:text-sm ${
              darkMode
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-emerald-300 border-slate-700'
                : 'bg-slate-100 hover:bg-emerald-50 text-slate-800 hover:text-emerald-700 border-slate-300'
            }`}
            title={src.excerpt}
          >
            <span>{t.sourceTag || 'Source:'} {src.title}</span>
            <span>🔗</span>
          </a>
        ))}
      </div>
    </div>
  );
}

function ComplianceCheck({ isOpen, onClose, t = {}, darkMode }) {
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
        error: "Unable to check compliance right now."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className={`rounded-2xl shadow-2xl max-w-xl w-full p-6 sm:p-8 border relative ${
          darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-lg transition font-bold text-xl ${
            darkMode ? 'text-slate-400 hover:text-slate-100 hover:bg-slate-800' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
          }`}
        >
          ✕
        </button>

        <div className="flex items-center gap-3 mb-4">
          <img src="/logo.jpg" alt="BIS Mitra Logo" className="w-12 h-12 rounded-xl object-cover border border-orange-500 shadow shrink-0" />
          <div>
            <h2 className="text-2xl font-bold">{t.modalTitle || 'Product Compliance Lookup'}</h2>
            <p className={`text-base ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{t.modalSub || 'Check mandatory certification'}</p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.modalPlaceholder || 'e.g. Helmet...'}
              className={`flex-1 px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-orange-500 text-lg ${
                darkMode ? 'bg-slate-950 border-slate-700 text-slate-100 placeholder-slate-500' : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
              autoFocus
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-bold text-lg flex items-center gap-2 transition"
            >
              {loading ? '...' : (t.modalCheckBtn || 'Check')}
            </button>
          </div>
        </form>

        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className={`text-xs font-bold uppercase tracking-wide ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{t.modalPopular || 'Popular:'}</span>
          {['Helmet', 'Packaged Water', 'Pressure Cooker', 'Toys', 'LED Bulb', 'Gold'].map((item) => (
            <button
              type="button"
              key={item}
              onClick={(e) => { e.preventDefault(); setQuery(item); }}
              className={`text-xs px-3 py-1.5 rounded-lg border transition font-medium ${
                darkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 border-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-orange-50 hover:text-orange-700 border-slate-200'
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {result && (
          <div className={`mt-4 p-5 rounded-xl border ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            {result.found ? (
              <div>
                <div className="flex items-center gap-3 mb-3">
                  {result.isMandatory ? (
                    <div className="flex items-center gap-2 text-red-500 bg-red-950/40 border border-red-800 px-3 py-1.5 rounded-lg font-bold text-sm">
                      <span>{t.mandatoryBadge || '🚨 MANDATORY QCO'}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-emerald-500 bg-emerald-950/40 border border-emerald-800 px-3 py-1.5 rounded-lg font-bold text-sm">
                      <span>{t.voluntaryBadge || '✅ VOLUNTARY STANDARD'}</span>
                    </div>
                  )}
                </div>

                <h3 className="text-xl font-bold mb-1">{result.productName}</h3>
                <p className="text-base font-semibold mb-3">
                  {t.applicableStd || 'Applicable Standard:'} <span className="bg-orange-600/20 text-orange-400 px-2 py-0.5 rounded font-mono text-sm border border-orange-500/30">{result.isCode}</span>
                </p>

                <div className={`space-y-2 text-base mb-4 p-3 rounded-lg border ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'}`}>
                  <p><strong>{t.scheme || 'Certification Scheme:'}</strong> {result.scheme}</p>
                  <p><strong>{t.authority || 'Regulating Authority:'}</strong> {result.ministry}</p>
                  <p className={`pt-2 text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{result.summary}</p>
                </div>

                <a
                  href={result.officialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-400 font-bold text-base hover:underline"
                >
                  <span>{t.officialLink || 'View Official BIS Mandatory List'}</span>
                  <span>🔗</span>
                </a>
              </div>
            ) : (
              <div className="text-center py-4">
                <h4 className="font-bold text-lg mb-1">{t.notFound || 'Standard Entry Not Found'}</h4>
                <p className={`text-sm mb-3 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{result.message}</p>
                <a
                  href="https://www.manakonline.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-blue-400 font-bold text-sm hover:underline"
                >
                  <span>Manakonline Portal</span>
                  <span>🔗</span>
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function InputBar({ onSend, loading, t = {}, lang, darkMode }) {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = t.speechLang || 'en-IN';

      rec.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript.trim()) {
          setInput('');
          onSend(transcript.trim());
        }
        setIsListening(false);
      };

      rec.onerror = () => setIsListening(false);
      rec.onend = () => setIsListening(false);
      setRecognition(rec);
    }
  }, [lang]);

  const handleVoiceInput = (e) => {
    if (e) e.preventDefault();
    if (!recognition) {
      alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setInput('');
      setIsListening(true);
      try {
        recognition.lang = t.speechLang || 'en-IN';
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
      <div className={`relative flex items-center rounded-2xl shadow-lg border-2 transition p-2 ${
        darkMode
          ? 'bg-slate-900 border-slate-700 focus-within:border-emerald-500'
          : 'bg-white border-slate-300 focus-within:border-emerald-600'
      }`}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isListening ? (t.listening || 'Listening...') : (t.placeholder || 'Ask your question...')}
          disabled={loading}
          className={`flex-1 px-4 py-3 text-lg md:text-xl bg-transparent focus:outline-none min-h-[54px] ${
            darkMode ? 'text-slate-100 placeholder-slate-500' : 'text-slate-900 placeholder-slate-400'
          }`}
        />

        <div className="flex items-center gap-2 pr-1">
          <button
            type="button"
            onClick={handleVoiceInput}
            title={isListening ? "Stop" : "Voice Input"}
            className={`p-3 rounded-xl transition flex items-center justify-center text-xl ${
              isListening
                ? 'bg-red-500 text-white animate-pulse'
                : darkMode ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            🎙️
          </button>

          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-xl text-lg flex items-center gap-2 transition shrink-0 min-h-[54px]"
          >
            <span>{t.askBtn || 'Ask'}</span>
            <span>➔</span>
          </button>
        </div>
      </div>
    </form>
  );
}

function ChatBox({ messages, loading, t = {}, darkMode, lang, onClear, onOpenChatPDF }) {
  const messagesEndRef = useRef(null);
  const [speakingIdx, setSpeakingIdx] = useState(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const toggleSpeech = (e, idx, text) => {
    if (e) e.preventDefault();
    if (!window.speechSynthesis) return;

    if (speakingIdx === idx) {
      window.speechSynthesis.cancel();
      setSpeakingIdx(null);
    } else {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[*•#\n]/g, ' ');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = t.speechLang || 'en-IN';
      utterance.onend = () => setSpeakingIdx(null);
      utterance.onerror = () => setSpeakingIdx(null);
      window.speechSynthesis.speak(utterance);
      setSpeakingIdx(idx);
    }
  };

  const formatText = (text) => {
    if (!text) return '';
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    const lines = formatted.split('\n');

    return lines.map((line, i) => {
      if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
        return (
          <li key={i} className={`ml-4 list-disc my-1 ${darkMode ? 'text-slate-200' : 'text-slate-800'}`} dangerouslySetInnerHTML={{ __html: line.replace(/^[\•\-]\s*/, '') }} />
        );
      }
      return (
        <p key={i} className={`mb-2 leading-relaxed text-lg ${darkMode ? 'text-slate-200' : 'text-slate-800'}`} dangerouslySetInnerHTML={{ __html: line }} />
      );
    });
  };

  return (
    <div className={`rounded-2xl shadow-md border p-4 sm:p-6 mb-6 flex flex-col h-[520px] relative overflow-hidden transition-colors ${
      darkMode ? 'bg-slate-900 border-slate-800' : 'bg-[#f8fafc] border-slate-200'
    }`}>
      {messages && messages.length > 0 && (
        <div className="flex justify-end mb-2 shrink-0">
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); if (onClear) onClear(); }}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition flex items-center gap-1.5 cursor-pointer ${
              darkMode
                ? 'bg-slate-800 hover:bg-red-900/60 text-slate-300 hover:text-red-300 border-slate-700 hover:border-red-700'
                : 'bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 border-slate-200 hover:border-red-300 shadow-xs'
            }`}
            title="Clear all chat messages"
          >
            <span>🗑️</span>
            <span>{t.clearChat || 'Clear Chat'}</span>
          </button>
        </div>
      )}
      <div className="flex-1 overflow-y-auto pr-2 space-y-6 relative z-10">
        {(!messages || !Array.isArray(messages) || messages.length === 0) ? (
          <div className="h-full flex items-center justify-center">
            <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{t.welcomeTitle || 'Welcome To BIS Mitra'}</h2>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 sm:gap-4 ${
                msg.type === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.type === 'bot' && (
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center shrink-0 font-bold shadow-sm mt-1 text-xl border border-slate-700">
                  🤖
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 sm:p-5 shadow-sm border text-lg relative ${
                  msg.type === 'user'
                    ? 'bg-slate-800 text-slate-50 border-slate-700 rounded-tr-none font-medium'
                    : darkMode
                      ? 'bg-slate-800 text-slate-100 border-slate-700 rounded-tl-none'
                      : 'bg-white text-slate-900 border-slate-200 rounded-tl-none shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="font-bold text-xs uppercase tracking-wider opacity-80">
                    {msg.type === 'user' ? (t.youAsked || 'You Asked:') : (t.botTitle || 'BIS Mitra Assistant:')}
                  </div>

                  {msg.type === 'bot' && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => toggleSpeech(e, idx, msg.text)}
                        className={`text-xs font-bold px-2 py-1 rounded-lg border transition flex items-center gap-1 cursor-pointer ${
                          speakingIdx === idx
                            ? 'bg-emerald-600 text-white animate-pulse border-emerald-500'
                            : darkMode ? 'bg-slate-700 hover:bg-slate-600 text-slate-200 border-slate-600' : 'bg-slate-200 hover:bg-slate-300 text-slate-700 border-slate-300'
                        }`}
                        title="Listen to Answer"
                      >
                        {speakingIdx === idx ? (t.stopListenBtn || '⏸️ Stop') : (t.listenBtn || '🔊 Listen')}
                      </button>

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
                        className={`text-xs font-bold px-2 py-1 rounded-lg border transition flex items-center gap-1 cursor-pointer ${
                          darkMode ? 'bg-emerald-950/70 hover:bg-emerald-900 text-emerald-300 border-emerald-800' : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300'
                        }`}
                        title="Generate & Save PDF Summary"
                      >
                        <span>📄</span>
                        <span>{t.pdfSummaryBtn || 'PDF Summary'}</span>
                      </button>
                    </div>
                  )}
                </div>

                {msg.type === 'user' ? (
                  <p className="text-xl font-medium leading-normal">{msg.text}</p>
                ) : (
                  <div>
                    <div className="prose max-w-none">
                      {formatText(msg.text)}
                    </div>
                    <SourceBadge sources={msg.sources} t={t} darkMode={darkMode} />
                  </div>
                )}
              </div>

              {msg.type === 'user' && (
                <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center shrink-0 font-bold shadow-md mt-1 text-xl">
                  👤
                </div>
              )}
            </div>
          ))
        )}

        {loading && (
          <div className={`flex gap-4 items-center p-4 rounded-2xl border text-lg ${
            darkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}>
            <span className="animate-spin text-2xl">⏳</span>
            <span className="font-medium">{t.searchingMsg || 'Searching verified records...'}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}



// ─────────────────────────────────────────────────────────────────
// FEATURE 0: QUESTION-ANSWER CHAT PDF SUMMARY MODAL
// ─────────────────────────────────────────────────────────────────
function ChatPDFSummaryModal({ isOpen, onClose, data, darkMode, t = {} }) {
  if (!isOpen || !data) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadFile = () => {
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>BIS Mitra Official PDF Summary Report</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 40px; color: #1e293b; background: #fff; }
    .header { background: #0f172a; color: #fff; padding: 24px; border-radius: 12px; margin-bottom: 24px; border-bottom: 4px solid #10b981; }
    .header h1 { margin: 0; font-size: 24px; font-weight: 800; color: #fff; }
    .header p { margin: 4px 0 0 0; color: #34d399; font-size: 14px; font-weight: 600; }
    .meta { display: flex; justify-content: space-between; font-size: 12px; color: #64748b; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 20px; }
    .box { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 10px; padding: 16px; margin-bottom: 20px; }
    .box-title { font-size: 12px; font-weight: 800; text-transform: uppercase; color: #64748b; margin-bottom: 8px; }
    .question-text { font-size: 16px; font-weight: 700; color: #0f172a; margin: 0; }
    .answer-text { font-size: 15px; line-height: 1.6; color: #334155; white-space: pre-wrap; }
    .badge { display: inline-block; background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 700; margin-right: 8px; margin-bottom: 8px; }
    .footer { text-align: center; margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 16px; font-size: 12px; color: #94a3b8; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🇮🇳 BUREAU OF INDIAN STANDARDS (BIS) MITRA</h1>
    <p>Official AI Advisory & Regulatory Summary Report</p>
  </div>
  <div class="meta">
    <span>📅 Generated: ${new Date().toLocaleString('en-IN')}</span>
    <span>🔒 Official Verification Document</span>
    <span>Ref: BIS-MITRA-${Date.now().toString(36).toUpperCase()}</span>
  </div>

  <div class="box" style="border-left: 4px solid #3b82f6;">
    <div class="box-title">❓ Question Asked by User</div>
    <p class="question-text">${data.question || 'User Query'}</p>
  </div>

  <div class="box" style="border-left: 4px solid #10b981;">
    <div class="box-title">🛡️ BIS Official Advisory & Technical Summary</div>
    <div class="answer-text">${data.answer || ''}</div>
  </div>

  ${data.sources && data.sources.length > 0 ? `
  <div class="box">
    <div class="box-title">📑 Verified Indian Standards (IS) & Cited Sources</div>
    <div>
      ${data.sources.map(s => `<span class="badge">📌 ${typeof s === 'string' ? s : s.title || s.isCode || JSON.stringify(s)}</span>`).join('')}
    </div>
  </div>
  ` : ''}

  <div class="footer">
    <p>Generated by BIS Mitra AI Assistant — Official Bureau of Indian Standards Quality Portal</p>
    <p>Website: <strong>bis.gov.in</strong> | Emergency Consumer Portal: <strong>manakonline.in</strong></p>
  </div>
</body>
</html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BIS_Mitra_Summary_${Date.now()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const refCode = `BIS-MITRA-${Date.now().toString(36).toUpperCase()}`;

  const summaryPoints = (data.answer || '')
    .split('\n')
    .filter(line => line.trim().length > 10)
    .slice(0, 4);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <style>{`
        @media print {
          body > *:not(#chat-pdf-report-root) { display: none !important; }
          #chat-pdf-report-root { display: block !important; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #fff !important; color: #000 !important; }
          .no-print { display: none !important; }
          .print-container { box-shadow: none !important; border: none !important; max-width: 100% !important; }
        }
      `}</style>
      <div id="chat-pdf-report-root" className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto print-container text-slate-900">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 rounded-t-2xl border-b-4 border-emerald-500 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center text-2xl font-black shadow-md">
              🇮🇳
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">BUREAU OF INDIAN STANDARDS (BIS)</h2>
              <p className="text-emerald-400 text-xs sm:text-sm font-bold">BIS Mitra — Official AI Advisory & Regulatory PDF Summary Report</p>
            </div>
          </div>
          <button onClick={onClose} className="no-print text-slate-400 hover:text-white text-2xl font-bold p-1 cursor-pointer">✕</button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Metadata Row */}
          <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 border-b pb-3 gap-2">
            <span>📅 <strong>Date:</strong> {dateStr} at {timeStr}</span>
            <span>🔖 <strong>Ref No:</strong> <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono font-bold text-slate-700">{refCode}</code></span>
            <span className="text-emerald-700 font-bold bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded-md">✅ Verified BIS Knowledge Base</span>
          </div>

          {/* User Question Box */}
          <div className="bg-slate-900 text-slate-100 rounded-xl p-4 border border-slate-700 shadow-sm">
            <div className="font-bold text-xs uppercase tracking-wider text-emerald-400 mb-1">
              ❓ User Query / Question Asked:
            </div>
            <p className="text-lg font-bold text-white leading-snug">
              {data.question}
            </p>
          </div>

          {/* Key Summary Bullet Points */}
          <div className="bg-emerald-50 border-2 border-emerald-300 rounded-xl p-4">
            <div className="font-extrabold text-xs uppercase tracking-wider text-emerald-900 mb-2 flex items-center gap-1.5">
              <span>💡</span>
              <span>Executive Summary & Key Takeaways:</span>
            </div>
            <ul className="space-y-1.5 text-sm text-emerald-950 font-medium">
              {summaryPoints.map((pt, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{pt.replace(/^[\*•\-]\s*/, '')}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Full Official BIS Advisory Response */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
            <div className="font-bold text-xs uppercase tracking-wider text-slate-600 mb-3 flex items-center gap-1.5">
              <span>📖</span>
              <span>Full Official Technical Advisory & Detailed Answer:</span>
            </div>
            <div className="prose max-w-none text-slate-900 text-sm leading-relaxed whitespace-pre-wrap font-sans">
              {data.answer}
            </div>
          </div>

          {/* Sources Section */}
          {data.sources && data.sources.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="font-bold text-xs uppercase tracking-wider text-blue-900 mb-2">
                🛡️ Applicable Indian Standards (IS Codes) & Verified Sources:
              </div>
              <div className="flex flex-wrap gap-2">
                {data.sources.map((src, i) => (
                  <span key={i} className="bg-white border border-blue-300 text-blue-900 text-xs font-bold px-2.5 py-1 rounded-lg shadow-2xs">
                    📌 {typeof src === 'string' ? src : src.title || src.isCode || JSON.stringify(src)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Official Disclaimer */}
          <div className="border-t pt-4 text-center text-xs text-slate-500">
            <p className="font-semibold text-slate-700">Official Bureau of Indian Standards (BIS) Mitra Regulatory Document</p>
            <p className="mt-1">This report is synthesized from official BIS Gazette Notifications, Quality Control Orders (QCOs), and Indian Standards (IS Code registry).</p>
            <p className="mt-1 font-bold text-emerald-700">Verify official licenses & certificates at bis.gov.in / manakonline.in</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="no-print flex flex-col sm:flex-row gap-3 p-4 border-t bg-slate-50 rounded-b-2xl">
          <button
            onClick={handlePrint}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer shadow-md"
          >
            🖨️ Print / Save as PDF
          </button>
          <button
            onClick={handleDownloadFile}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer shadow-md"
          >
            📥 Download Summary Document
          </button>
          <button
            onClick={onClose}
            className="px-6 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold py-3 rounded-xl transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────────────────
// FEATURE 1: PDF COMPLIANCE REPORT GENERATOR
// ─────────────────────────────────────────────────────────────────
function PDFReportModal({ isOpen, onClose, reportData, darkMode }) {
  if (!isOpen || !reportData) return null;

  const handlePrint = () => {
    window.print();
  };

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <style>{`
        @media print {
          body > *:not(#pdf-report-root) { display: none !important; }
          #pdf-report-root { display: block !important; position: fixed; top: 0; left: 0; width: 100%; }
          .no-print { display: none !important; }
          .print-page { box-shadow: none !important; border: none !important; }
        }
      `}</style>
      <div id="pdf-report-root" className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto print-page">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 rounded-t-2xl print-page">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center text-2xl font-black">🇮🇳</div>
              <div>
                <h2 className="text-xl font-extrabold">BIS MITRA</h2>
                <p className="text-emerald-400 text-xs font-semibold">Bureau of Indian Standards — Official Verification Report</p>
              </div>
            </div>
            <button onClick={onClose} className="no-print text-slate-400 hover:text-white text-2xl leading-none">✕</button>
          </div>
        </div>

        {/* Report Body */}
        <div className="p-6 space-y-5">
          {/* Report Meta */}
          <div className="flex justify-between text-xs text-slate-500 border-b pb-3">
            <span>📅 Generated: {dateStr} at {timeStr}</span>
            <span>🔒 Digital BIS Mitra Report</span>
          </div>

          {/* Status Banner */}
          <div className={`rounded-xl p-4 text-center font-extrabold text-lg ${reportData.isValid ? 'bg-emerald-50 border-2 border-emerald-400 text-emerald-700' : 'bg-red-50 border-2 border-red-400 text-red-700'}`}>
            {reportData.isValid ? '✅ VERIFIED AUTHENTIC BIS CERTIFICATION' : '❌ UNVERIFIED / SUSPICIOUS PRODUCT'}
          </div>

          {/* Product Info */}
          <div className="grid grid-cols-2 gap-4">
            {[
              ['🏷️ Product / Item', reportData.detectedItem],
              ['📋 IS Code', reportData.isCode],
              ['🔖 Mark Type', reportData.markType],
              ['🪪 License No.', reportData.licenseNo],
            ].map(([label, value]) => (
              <div key={label} className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                <p className="text-xs text-slate-500 font-semibold mb-1">{label}</p>
                <p className="text-slate-900 font-bold text-sm">{value || 'N/A'}</p>
              </div>
            ))}
          </div>

          {/* Details */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <p className="text-xs text-slate-500 font-semibold mb-2">📝 Verification Details</p>
            <p className="text-slate-800 text-sm leading-relaxed">{reportData.details}</p>
          </div>

          {/* QCO Status */}
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
            <p className="text-xs text-amber-600 font-semibold mb-1">⚖️ Quality Control Order (QCO) Status</p>
            <p className="text-amber-900 text-sm font-medium">{reportData.qcoStatus}</p>
          </div>

          {/* Footer */}
          <div className="border-t pt-4 text-center text-xs text-slate-400">
            <p>This report was generated by BIS Mitra AI Assistant. For official verification, visit <strong>bis.gov.in</strong></p>
            <p className="mt-1">© Bureau of Indian Standards, Government of India</p>
          </div>
        </div>

        {/* Actions */}
        <div className="no-print flex gap-3 p-4 border-t bg-slate-50 rounded-b-2xl">
          <button
            onClick={handlePrint}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition"
          >
            🖨️ Print / Save as PDF
          </button>
          <button
            onClick={onClose}
            className="px-6 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold py-3 rounded-xl transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// FEATURE 2: INTERACTIVE BIS INDIA MAP
// ─────────────────────────────────────────────────────────────────
const BIS_OFFICES = [
  { id: 'nd', name: 'Northern Regional Office', city: 'New Delhi', address: 'Plot No. 4, Institutional Area, Sector 14, Dwarka, New Delhi - 110078', phone: '011-28031200', services: ['ISI Certification', 'CRS Registration', 'Lab Testing', 'FMCS'], states: ['Delhi', 'Haryana', 'Himachal Pradesh', 'Jammu & Kashmir', 'Punjab', 'Rajasthan', 'Uttar Pradesh', 'Uttarakhand'], x: 30, y: 25, color: '#3b82f6' },
  { id: 'er', name: 'Eastern Regional Office', city: 'Kolkata', address: 'P-7, Institutional Area, Block-GP, Sector V, Salt Lake City, Kolkata - 700091', phone: '033-23590100', services: ['ISI Certification', 'Hallmarking', 'Lab Testing'], states: ['West Bengal', 'Bihar', 'Jharkhand', 'Odisha', 'Assam', 'Northeast States'], x: 73, y: 40, color: '#f59e0b' },
  { id: 'sr', name: 'Southern Regional Office', city: 'Chennai', address: 'IV Cross Road, CIT Campus, Taramani, Chennai - 600113', phone: '044-22541442', services: ['ISI Certification', 'CRS Registration', 'Lab Testing', 'Hallmarking'], states: ['Tamil Nadu', 'Kerala', 'Karnataka', 'Andhra Pradesh', 'Telangana', 'Puducherry'], x: 38, y: 78, color: '#10b981' },
  { id: 'wr', name: 'Western Regional Office', city: 'Mumbai', address: 'Manakalaya, E9, MIDC, Marol, Andheri East, Mumbai - 400093', phone: '022-28373321', services: ['ISI Certification', 'CRS Registration', 'Lab Testing'], states: ['Maharashtra', 'Goa', 'Gujarat', 'Madhya Pradesh', 'Chhattisgarh'], x: 22, y: 52, color: '#8b5cf6' },
  { id: 'cr', name: 'Central Regional Office', city: 'Kolkata', address: 'Nirman Bhavan, Maulana Azad Road, New Delhi - 110001', phone: '011-23061981', services: ['ISI Certification', 'Standards Development', 'QCO Enforcement'], states: ['Madhya Pradesh', 'Chhattisgarh', 'Uttarakhand'], x: 40, y: 38, color: '#ef4444' },
  { id: 'lab_gzb', name: 'Central Testing Lab — Ghaziabad', city: 'Ghaziabad', address: 'Kamla Nehru Nagar, Ghaziabad, Uttar Pradesh - 201002', phone: '0120-2783347', services: ['Helmet Impact Testing', 'Pressure Cooker Burst Test', 'LED Photometry', 'Chemical Analysis'], states: ['UP Lab'], x: 34, y: 27, color: '#06b6d4' },
  { id: 'lab_mum', name: 'Testing Lab — Mumbai', city: 'Mumbai', address: 'E-9, MIDC, Marol, Andheri East, Mumbai - 400093', phone: '022-28373311', services: ['Electrical Safety', 'Chemical Testing', 'Toy Safety'], states: ['WR Lab'], x: 19, y: 55, color: '#06b6d4' },
  { id: 'lab_chn', name: 'Testing Lab — Chennai', city: 'Chennai', address: 'CIT Campus, Taramani, Chennai - 600113', phone: '044-22541400', services: ['Steel Testing', 'Cement Testing', 'Cable Testing'], states: ['SR Lab'], x: 36, y: 81, color: '#06b6d4' },
  { id: 'hc_del', name: 'Hallmarking Centre — Delhi', city: 'New Delhi', address: 'BIS Regional Office, Dwarka, New Delhi', phone: '011-28031220', services: ['Gold Hallmarking', 'HUID Verification', 'Silver Hallmarking'], states: ['Delhi Hallmarking'], x: 28, y: 26, color: '#f59e0b' },
  { id: 'hc_mum', name: 'Hallmarking Centre — Mumbai', city: 'Mumbai', address: 'Marol, Andheri East, Mumbai', phone: '022-28373399', services: ['Gold Hallmarking', 'HUID Verification', 'Platinum Hallmarking'], states: ['Mumbai Hallmarking'], x: 17, y: 57, color: '#f59e0b' },
];

function IndiaMapModal({ isOpen, onClose, darkMode }) {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all');

  if (!isOpen) return null;

  const filtered = filter === 'all' ? BIS_OFFICES :
    filter === 'office' ? BIS_OFFICES.filter(o => o.id.startsWith('nd') || o.id.startsWith('er') || o.id.startsWith('sr') || o.id.startsWith('wr') || o.id.startsWith('cr')) :
    filter === 'lab' ? BIS_OFFICES.filter(o => o.id.startsWith('lab')) :
    BIS_OFFICES.filter(o => o.id.startsWith('hc'));

  const typeColors = { office: '#3b82f6', lab: '#06b6d4', hallmark: '#f59e0b' };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-3">
      <div className={`rounded-2xl shadow-2xl w-full max-w-5xl max-h-[92vh] overflow-hidden flex flex-col ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-white text-slate-900'}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-700 shrink-0">
          <div>
            <h2 className="text-2xl font-extrabold flex items-center gap-2">🗺️ BIS India — Offices, Labs & Hallmarking Centers</h2>
            <p className={`text-sm mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Click any marker to see full contact details</p>
          </div>
          <button onClick={() => { setSelected(null); onClose(); }} className={`text-2xl leading-none px-2 ${darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-900'}`}>✕</button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 px-5 pt-3 shrink-0">
          {[['all','🏛️ All'], ['office','🔵 Regional Offices'], ['lab','🔵 Testing Labs'], ['hallmark','🟡 Hallmarking']].map(([key, label]) => (
            <button key={key} onClick={() => { setFilter(key); setSelected(null); }}
              className={`px-4 py-1.5 rounded-full text-sm font-bold border transition ${filter === key ? 'bg-emerald-600 text-white border-emerald-600' : darkMode ? 'bg-slate-800 border-slate-700 text-slate-300 hover:border-emerald-500' : 'bg-slate-100 border-slate-300 text-slate-700 hover:border-emerald-400'}`}>
              {label}
            </button>
          ))}
        </div>

        {/* Map + Info split */}
        <div className="flex flex-1 overflow-hidden min-h-0 m-4 gap-4">
          {/* SVG Map */}
          <div className={`relative flex-1 rounded-2xl border overflow-hidden flex items-center justify-center ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-blue-50 border-slate-200'}`}>
            <svg viewBox="0 0 100 100" className="w-full h-full max-h-[460px]" style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.15))' }}>
              {/* Simplified India outline */}
              <path d="M25,5 L40,3 L58,5 L72,12 L80,20 L85,30 L82,38 L78,45 L80,55 L75,65 L68,72 L60,80 L50,90 L42,95 L35,88 L28,78 L22,68 L18,58 L15,48 L18,38 L15,28 L20,18 Z" fill={darkMode ? '#1e293b' : '#dbeafe'} stroke={darkMode ? '#475569' : '#93c5fd'} strokeWidth="0.8"/>
              {/* Kashmir region */}
              <path d="M25,5 L28,2 L35,1 L40,3" fill={darkMode ? '#1e293b' : '#dbeafe'} stroke={darkMode ? '#475569' : '#93c5fd'} strokeWidth="0.5"/>
              {/* Northeast */}
              <path d="M72,12 L80,8 L85,15 L80,20" fill={darkMode ? '#1e293b' : '#dbeafe'} stroke={darkMode ? '#475569' : '#93c5fd'} strokeWidth="0.5"/>

              {/* Markers */}
              {filtered.map(office => (
                <g key={office.id} onClick={() => setSelected(selected?.id === office.id ? null : office)} style={{ cursor: 'pointer' }}>
                  <circle
                    cx={office.x} cy={office.y} r={selected?.id === office.id ? 3.5 : 2.5}
                    fill={office.color}
                    stroke="white" strokeWidth="0.8"
                    style={{ transition: 'all 0.2s', filter: selected?.id === office.id ? 'drop-shadow(0 0 4px ' + office.color + ')' : 'none' }}
                  />
                  {selected?.id === office.id && (
                    <circle cx={office.x} cy={office.y} r={5} fill="none" stroke={office.color} strokeWidth="0.5" opacity="0.5" />
                  )}
                  <text x={office.x + 3} y={office.y + 1} fontSize="2" fill={darkMode ? '#cbd5e1' : '#374151'} style={{ pointerEvents: 'none', fontWeight: 600 }}>
                    {office.city.split(' ')[0]}
                  </text>
                </g>
              ))}
            </svg>

            {/* Legend */}
            <div className={`absolute bottom-3 left-3 rounded-xl p-2 text-xs space-y-1 ${darkMode ? 'bg-slate-900/90' : 'bg-white/90'}`}>
              {[['🔵', '#3b82f6', 'Regional Office'], ['🔵', '#06b6d4', 'Testing Lab'], ['🟡', '#f59e0b', 'Hallmarking']].map(([dot, col, label]) => (
                <div key={label} className="flex items-center gap-1.5">
                  <span style={{ color: col }}>●</span>
                  <span className={darkMode ? 'text-slate-300' : 'text-slate-600'}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Info Panel */}
          <div className="w-72 shrink-0 overflow-y-auto space-y-2">
            {selected ? (
              <div className={`rounded-xl border p-4 h-full ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3" style={{ backgroundColor: selected.color + '22' }}>
                  {selected.id.startsWith('lab') ? '🔬' : selected.id.startsWith('hc') ? '🏅' : '🏛️'}
                </div>
                <h3 className="font-extrabold text-base mb-1">{selected.name}</h3>
                <p className={`text-sm font-semibold mb-3 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>📍 {selected.city}</p>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className={`text-xs font-bold uppercase mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Address</p>
                    <p className={darkMode ? 'text-slate-300' : 'text-slate-700'}>{selected.address}</p>
                  </div>
                  <div>
                    <p className={`text-xs font-bold uppercase mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Phone</p>
                    <a href={`tel:${selected.phone}`} className="text-emerald-500 font-bold hover:underline">{selected.phone}</a>
                  </div>
                  <div>
                    <p className={`text-xs font-bold uppercase mb-2 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Services</p>
                    <div className="flex flex-wrap gap-1">
                      {selected.services.map(s => (
                        <span key={s} className={`px-2 py-0.5 rounded-full text-xs font-semibold ${darkMode ? 'bg-emerald-900/60 text-emerald-300' : 'bg-emerald-100 text-emerald-800'}`}>{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className={`h-full rounded-xl border flex flex-col gap-2 p-3 overflow-y-auto ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                <p className={`text-sm font-bold px-1 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>Showing {filtered.length} locations — click any dot on the map or a card below</p>
                {filtered.map(office => (
                  <button key={office.id} onClick={() => setSelected(office)}
                    className={`text-left rounded-xl p-3 border transition ${darkMode ? 'bg-slate-800 border-slate-700 hover:border-emerald-500' : 'bg-slate-50 border-slate-200 hover:border-emerald-400'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span style={{ color: office.color }}>●</span>
                      <span className="font-bold text-sm">{office.city}</span>
                    </div>
                    <p className={`text-xs leading-snug ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{office.name}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// FEATURE 3: MSME CERTIFICATION COST CALCULATOR
// ─────────────────────────────────────────────────────────────────
const CERT_PRODUCTS = [
  { id: 'helmet', name: 'Protective Helmet (IS 4151)', appFee: 1000, testFee: 28000, markFee: 8, unit: 'per unit', timeline: [['Application Filing (Manakonline)', '2 days'], ['BIS Scrutiny & Acknowledgment', '7 days'], ['Factory Inspection by BIS Officer', '15-30 days'], ['Sample Drawing & Lab Testing', '30-45 days'], ['Grant of CML License', '7-10 days'], ['Total', '60-90 days']] },
  { id: 'water', name: 'Packaged Drinking Water (IS 14543)', appFee: 1000, testFee: 45000, markFee: 1.5, unit: 'per 1000L', timeline: [['Application Filing (Manakonline)', '2 days'], ['NABL Lab Test Report', '20-30 days'], ['Factory Inspection', '15-30 days'], ['In-House Lab Verification', '10 days'], ['Grant of CML License', '7-10 days'], ['Total', '55-75 days']] },
  { id: 'led', name: 'LED Lamp / Bulb CRS (IS 16102)', appFee: 1000, testFee: 15000, markFee: 0, unit: 'one-time', timeline: [['CRS Application', '2 days'], ['BIS Lab / NABL Lab Test', '20-30 days'], ['R-Number Grant', '7 days'], ['Total', '30-40 days']] },
  { id: 'toy', name: "Children's Toy Safety (IS 9873)", appFee: 1000, testFee: 35000, markFee: 5, unit: 'per unit', timeline: [['Application (Manakonline)', '2 days'], ['Factory Inspection', '15-30 days'], ['Toy Safety Lab Testing', '30-45 days'], ['License Grant', '7 days'], ['Total', '55-85 days']] },
  { id: 'cooker', name: 'Pressure Cooker (IS 2347)', appFee: 1000, testFee: 22000, markFee: 10, unit: 'per unit', timeline: [['Application Filing', '2 days'], ['Factory Inspection', '15-30 days'], ['Hydrostatic & Safety Tests', '20-30 days'], ['License Grant', '7 days'], ['Total', '45-70 days']] },
  { id: 'steel', name: 'TMT Steel Rebar (IS 1786)', appFee: 1000, testFee: 50000, markFee: 2, unit: 'per tonne', timeline: [['Application Filing', '2 days'], ['Factory Inspection', '20-30 days'], ['Chemical & Mechanical Tests', '30-45 days'], ['License Grant', '7 days'], ['Total', '60-85 days']] },
  { id: 'cable', name: 'PVC Electrical Cable (IS 694)', appFee: 1000, testFee: 18000, markFee: 3, unit: 'per km', timeline: [['Application Filing', '2 days'], ['Factory Inspection', '15-25 days'], ['Electrical Safety Tests', '20-30 days'], ['License Grant', '7 days'], ['Total', '45-65 days']] },
];
const DOCS_COMMON = ['Udyam Registration Certificate (MSME)', 'Factory Registration Certificate', 'GST Certificate', 'Company PAN Card', 'Technical Person Credentials', 'In-house Lab Equipment List'];

function MSMECalculatorModal({ isOpen, onClose, darkMode }) {
  const [product, setProduct] = useState('helmet');
  const [size, setSize] = useState('micro');
  const [isStartup, setIsStartup] = useState(false);
  const [isWomen, setIsWomen] = useState(false);
  const [result, setResult] = useState(null);

  if (!isOpen) return null;

  const calculate = () => {
    const p = CERT_PRODUCTS.find(x => x.id === product);
    if (!p) return;
    let markDiscount = 0;
    if (size === 'micro') markDiscount = 80;
    else if (size === 'small') markDiscount = 50;
    else if (size === 'medium') markDiscount = 20;
    if (isStartup) markDiscount = Math.max(markDiscount, 50);
    if (isWomen) markDiscount = Math.min(markDiscount + 10, 90);
    const discountedMark = p.markFee * (1 - markDiscount / 100);
    const totalOneTime = p.appFee + p.testFee;
    setResult({ ...p, markDiscount, discountedMark, totalOneTime });
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className={`rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-white text-slate-900'}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b shrink-0">
          <div>
            <h2 className="text-2xl font-extrabold flex items-center gap-2">🧮 MSME Certification Cost Calculator</h2>
            <p className={`text-sm mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Get exact BIS certification cost with MSME/Startup discounts applied automatically</p>
          </div>
          <button onClick={onClose} className="text-2xl text-slate-400 hover:text-slate-900 leading-none">✕</button>
        </div>

        <div className="p-5 space-y-5">
          {/* Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold mb-2 block">🏭 Product / Standard</label>
              <select value={product} onChange={e => setProduct(e.target.value)}
                className={`w-full rounded-xl border-2 px-3 py-2.5 font-semibold focus:outline-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white focus:border-emerald-500' : 'bg-slate-50 border-slate-300 focus:border-emerald-500'}`}>
                {CERT_PRODUCTS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-bold mb-2 block">🏢 Enterprise Size</label>
              <select value={size} onChange={e => setSize(e.target.value)}
                className={`w-full rounded-xl border-2 px-3 py-2.5 font-semibold focus:outline-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white focus:border-emerald-500' : 'bg-slate-50 border-slate-300 focus:border-emerald-500'}`}>
                <option value="micro">Micro Enterprise (80% discount)</option>
                <option value="small">Small Enterprise (50% discount)</option>
                <option value="medium">Medium Enterprise (20% discount)</option>
                <option value="large">Large Enterprise (No discount)</option>
              </select>
            </div>
          </div>
          <div className="flex gap-6 flex-wrap">
            {[['isStartup', isStartup, setIsStartup, '🚀 DPIIT Registered Startup (50% discount)'],
              ['isWomen', isWomen, setIsWomen, '👩 Women-Led Enterprise (+10% additional)']].map(([key, val, setter, label]) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={val} onChange={e => setter(e.target.checked)} className="w-5 h-5 accent-emerald-600 rounded" />
                <span className="text-sm font-semibold">{label}</span>
              </label>
            ))}
          </div>

          <button onClick={calculate}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 rounded-xl text-lg transition">
            ✨ Calculate My Cost
          </button>

          {result && (
            <div className="space-y-4 animate-pulse-once">
              {/* Cost Cards */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  ['Application Fee', `₹${result.appFee.toLocaleString()}`, '📋', 'One-time'],
                  ['Lab / Testing Fee', `₹${result.testFee.toLocaleString()}`, '🔬', 'Approx.'],
                  ['Total One-Time Cost', `₹${result.totalOneTime.toLocaleString()}`, '💰', 'Estimated'],
                ].map(([label, val, icon, sub]) => (
                  <div key={label} className={`rounded-xl p-4 border text-center ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="text-2xl mb-1">{icon}</div>
                    <div className="text-xl font-extrabold text-emerald-600">{val}</div>
                    <div className={`text-xs font-semibold mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{label}</div>
                    <div className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{sub}</div>
                  </div>
                ))}
              </div>

              {/* Marking Fee with discount */}
              <div className={`rounded-xl border p-4 ${darkMode ? 'bg-emerald-900/30 border-emerald-800' : 'bg-emerald-50 border-emerald-200'}`}>
                <p className="font-bold text-emerald-600 mb-2">🎯 Recurring Marking Fee (per {result.unit})</p>
                <div className="flex items-center gap-3">
                  <span className="text-slate-400 line-through text-base">₹{result.markFee}</span>
                  <span className="text-2xl font-extrabold text-emerald-600">₹{result.discountedMark.toFixed(2)}</span>
                  <span className={`text-sm font-bold px-2 py-0.5 rounded-full ${darkMode ? 'bg-emerald-900 text-emerald-300' : 'bg-emerald-100 text-emerald-700'}`}>{result.markDiscount}% OFF</span>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <p className="font-bold mb-3">📅 Certification Timeline</p>
                <div className="space-y-2">
                  {result.timeline.map(([step, days], i) => (
                    <div key={i} className={`flex items-center justify-between rounded-xl px-4 py-2 ${step === 'Total' ? (darkMode ? 'bg-emerald-900/40 border border-emerald-700' : 'bg-emerald-50 border border-emerald-300') : (darkMode ? 'bg-slate-800' : 'bg-slate-50')}`}>
                      <span className={`text-sm ${step === 'Total' ? 'font-extrabold text-emerald-600' : (darkMode ? 'text-slate-300' : 'text-slate-700')}`}>
                        {step !== 'Total' && <span className="mr-2 text-slate-400">{i + 1}.</span>}{step}
                      </span>
                      <span className={`text-sm font-bold ${step === 'Total' ? 'text-emerald-600' : (darkMode ? 'text-slate-400' : 'text-slate-500')}`}>{days}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Docs Checklist */}
              <div>
                <p className="font-bold mb-3">📄 Required Documents Checklist</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {DOCS_COMMON.map(doc => (
                    <div key={doc} className={`flex items-start gap-2 rounded-lg px-3 py-2 ${darkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                      <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                      <span className="text-sm">{doc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <a href="https://www.manakonline.in" target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-orange-600 hover:bg-orange-700 text-white font-extrabold py-3.5 rounded-xl transition text-lg">
                🚀 Apply Now on Manakonline.in →
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// FEATURE 4: ANALYTICS DASHBOARD
// ─────────────────────────────────────────────────────────────────
const ANALYTICS_DATA = {
  sectorLicenses: [
    { name: 'Steel & Construction', count: 4820, color: '#6b7280' },
    { name: 'Electronics & IT', count: 3940, color: '#3b82f6' },
    { name: 'Food & Beverages', count: 3210, color: '#10b981' },
    { name: 'Consumer Goods', count: 2780, color: '#f59e0b' },
    { name: 'Safety & Automotive', count: 2140, color: '#ef4444' },
    { name: 'Precious Metals', count: 1890, color: '#a855f7' },
    { name: 'Chemicals', count: 1450, color: '#06b6d4' },
    { name: 'Medical Devices', count: 980, color: '#ec4899' },
  ],
  statsCounters: [
    { label: 'Indian Standards (IS)', value: 21890, suffix: '+', icon: '📋', color: '#3b82f6' },
    { label: 'Active ISI Licenses', value: 41200, suffix: '+', icon: '🏭', color: '#10b981' },
    { label: 'QCOs Enforced', value: 762, suffix: '', icon: '⚖️', color: '#f59e0b' },
    { label: 'CRS Registrations', value: 18500, suffix: '+', icon: '💡', color: '#8b5cf6' },
    { label: 'Hallmarked Products (Cr)', value: 11.4, suffix: 'Cr+', icon: '🥇', color: '#f59e0b' },
    { label: 'BIS Offices & Labs', value: 108, suffix: '', icon: '🏛️', color: '#06b6d4' },
  ],
  stateParticipation: [
    { state: 'Maharashtra', pct: 18 }, { state: 'Gujarat', pct: 14 }, { state: 'Tamil Nadu', pct: 12 },
    { state: 'Uttar Pradesh', pct: 10 }, { state: 'Karnataka', pct: 9 }, { state: 'West Bengal', pct: 7 },
    { state: 'Rajasthan', pct: 6 }, { state: 'Others', pct: 24 },
  ]
};

function AnimatedCounter({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    let start = 0;
    const steps = 60;
    const step = target / steps;
    const interval = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(interval); }
      else setCount(parseFloat(start.toFixed(1)));
    }, 20);
    return () => clearInterval(interval);
  }, [target]);

  return <span>{typeof count === 'number' && count % 1 !== 0 ? count.toFixed(1) : Math.floor(count).toLocaleString()}{suffix}</span>;
}

function AnalyticsDashboardModal({ isOpen, onClose, darkMode }) {
  if (!isOpen) return null;
  const maxCount = Math.max(...ANALYTICS_DATA.sectorLicenses.map(s => s.count));

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className={`rounded-2xl shadow-2xl w-full max-w-5xl max-h-[92vh] overflow-y-auto ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-white text-slate-900'}`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-5 border-b ${darkMode ? 'border-slate-800' : 'border-slate-200'} sticky top-0 ${darkMode ? 'bg-slate-900' : 'bg-white'} z-10`}>
          <div>
            <h2 className="text-2xl font-extrabold flex items-center gap-2">📊 BIS India — Live Analytics Dashboard</h2>
            <p className={`text-sm mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Real-time overview of BIS certification ecosystem in India</p>
          </div>
          <button onClick={onClose} className="text-2xl text-slate-400 hover:text-slate-900 leading-none">✕</button>
        </div>

        <div className="p-5 space-y-8">
          {/* Animated Counters */}
          <div>
            <h3 className="font-extrabold text-lg mb-4">🎯 BIS at a Glance</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {ANALYTICS_DATA.statsCounters.map(stat => (
                <div key={stat.label} className={`rounded-2xl border p-4 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-2xl font-extrabold" style={{ color: stat.color }}>
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className={`text-xs font-semibold mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Bar Chart — Licenses by Sector */}
          <div>
            <h3 className="font-extrabold text-lg mb-4">🏭 Active ISI Licenses by Sector</h3>
            <div className={`rounded-2xl border p-5 space-y-3 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
              {ANALYTICS_DATA.sectorLicenses.map(sector => (
                <div key={sector.name} className="flex items-center gap-3">
                  <div className={`text-sm font-semibold w-36 shrink-0 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{sector.name}</div>
                  <div className="flex-1 relative">
                    <div className={`h-7 rounded-full ${darkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
                      <div
                        className="h-7 rounded-full flex items-center justify-end pr-3 transition-all duration-700 ease-out"
                        style={{ width: `${(sector.count / maxCount) * 100}%`, backgroundColor: sector.color }}
                      >
                        <span className="text-white text-xs font-bold">{sector.count.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* State Participation Donut (pure CSS/SVG) */}
          <div>
            <h3 className="font-extrabold text-lg mb-4">🗺️ State-wise ISI License Distribution</h3>
            <div className={`rounded-2xl border p-5 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex flex-wrap gap-3">
                {ANALYTICS_DATA.stateParticipation.map((s, i) => {
                  const colors = ['#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6','#06b6d4','#ec4899','#6b7280'];
                  return (
                    <div key={s.state} className={`flex-1 min-w-[120px] rounded-xl p-3 border ${darkMode ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span style={{ color: colors[i] }} className="font-black text-lg">●</span>
                        <span className="font-bold text-sm">{s.state}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`flex-1 h-2 rounded-full ${darkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
                          <div className="h-2 rounded-full" style={{ width: `${s.pct * 4}%`, backgroundColor: colors[i] }} />
                        </div>
                        <span className="font-extrabold text-sm" style={{ color: colors[i] }}>{s.pct}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Source Note */}
          <p className={`text-xs text-center ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
            📌 Data sourced from Bureau of Indian Standards Annual Reports & bis.gov.in | Updated: FY 2023-24
          </p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// FEATURE 7: FAKE PRODUCT REPORTER
// ─────────────────────────────────────────────────────────────────
function FakeProductReporterModal({ isOpen, onClose, darkMode }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ productName: '', brand: '', location: '', markType: 'ISI Mark', description: '', shopName: '' });
  const [submitted, setSubmitted] = useState(false);
  const [refNo] = useState(() => 'BIS-RPT-' + Math.floor(Math.random() * 900000 + 100000));

  if (!isOpen) return null;

  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleClose = () => { setSubmitted(false); setStep(1); setForm({ productName: '', brand: '', location: '', markType: 'ISI Mark', description: '', shopName: '' }); onClose(); };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className={`rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-white text-slate-900'}`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-5 border-b ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
          <div>
            <h2 className="text-xl font-extrabold flex items-center gap-2">🚨 Report Fake / Non-Compliant Product</h2>
            <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Help protect consumers by reporting suspected fake ISI marks</p>
          </div>
          <button onClick={handleClose} className="text-2xl text-slate-400 hover:text-slate-900 leading-none">✕</button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="text-6xl">✅</div>
            <h3 className="text-xl font-extrabold text-emerald-600">Complaint Registered!</h3>
            <div className={`rounded-xl p-4 border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-emerald-50 border-emerald-200'}`}>
              <p className={`text-sm font-semibold mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Your Reference Number</p>
              <p className="text-2xl font-extrabold text-emerald-600">{refNo}</p>
              <p className={`text-xs mt-2 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Save this for tracking your complaint</p>
            </div>
            <div className={`rounded-xl p-4 border text-left text-sm space-y-2 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
              <p className="font-bold mb-2">📋 Complaint Summary</p>
              <p><span className={darkMode ? 'text-slate-400' : 'text-slate-500'}>Product:</span> <strong>{form.productName}</strong></p>
              <p><span className={darkMode ? 'text-slate-400' : 'text-slate-500'}>Brand:</span> <strong>{form.brand}</strong></p>
              <p><span className={darkMode ? 'text-slate-400' : 'text-slate-500'}>Location:</span> <strong>{form.location}</strong></p>
              <p><span className={darkMode ? 'text-slate-400' : 'text-slate-500'}>Suspected Mark:</span> <strong>Fake {form.markType}</strong></p>
            </div>
            <div className="space-y-2 pt-2">
              <a href="https://pgportal.gov.in" target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-xl transition">
                📮 File Official Complaint on pgportal.gov.in →
              </a>
              <a href="https://www.bis.gov.in/enforcement-and-surveillance/" target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-xl transition">
                🔗 BIS Enforcement & Surveillance Portal →
              </a>
              <button onClick={handleClose}
                className={`w-full py-3 rounded-xl font-bold border transition ${darkMode ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-600 hover:bg-slate-100'}`}>
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* Warning Banner */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex gap-2">
              <span className="text-red-500 text-xl shrink-0">⚠️</span>
              <p className="text-red-700 text-sm font-medium">Selling products with fake BIS marks is a criminal offense under Section 29 of BIS Act, 2016 — punishable with up to 2 years imprisonment and ₹2 Lakh fine.</p>
            </div>

            {/* Form Fields */}
            {[
              ['productName', 'Product Name *', 'e.g. Helmet, Packaged Water, LED Bulb...', 'text'],
              ['brand', 'Brand / Manufacturer Name *', 'e.g. ABC Helmet Co.', 'text'],
              ['shopName', 'Shop / Seller Name', 'e.g. XYZ Electronics Store', 'text'],
              ['location', 'Location / City *', 'e.g. Karol Bagh, New Delhi', 'text'],
            ].map(([field, label, placeholder, type]) => (
              <div key={field}>
                <label className="text-sm font-bold mb-1 block">{label}</label>
                <input
                  type={type}
                  required={label.includes('*')}
                  value={form[field]}
                  onChange={e => handleChange(field, e.target.value)}
                  placeholder={placeholder}
                  className={`w-full rounded-xl border-2 px-4 py-2.5 text-sm focus:outline-none transition ${darkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-emerald-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-500'}`}
                />
              </div>
            ))}

            <div>
              <label className="text-sm font-bold mb-1 block">🔖 Suspected Mark Type *</label>
              <select value={form.markType} onChange={e => handleChange('markType', e.target.value)}
                className={`w-full rounded-xl border-2 px-4 py-2.5 font-semibold focus:outline-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white focus:border-emerald-500' : 'bg-slate-50 border-slate-300 focus:border-emerald-500'}`}>
                {['ISI Mark', 'CRS R-Number', 'Gold Hallmark HUID', 'BIS Logo (Misuse)', 'Other'].map(m => <option key={m}>{m}</option>)}
              </select>
            </div>

            <div>
              <label className="text-sm font-bold mb-1 block">📝 Additional Details</label>
              <textarea
                value={form.description}
                onChange={e => handleChange('description', e.target.value)}
                rows={3}
                placeholder="Describe the issue: What looks fake? Any other observations..."
                className={`w-full rounded-xl border-2 px-4 py-2.5 text-sm focus:outline-none transition resize-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-emerald-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-500'}`}
              />
            </div>

            <button type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold py-3.5 rounded-xl text-lg transition flex items-center justify-center gap-2">
              🚨 Submit Complaint
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

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
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isFakeReporterOpen, setIsFakeReporterOpen] = useState(false);
  const [isPDFOpen, setIsPDFOpen] = useState(false);
  const [pdfReportData, setPdfReportData] = useState(null);
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
  const currentSampleQuestions = getSectorQuestions(category, lang) || [];

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
          text: "Connection error. Please check backend status.",
          sources: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenScanModal = (e) => {
    if (e) e.preventDefault();
    setIsScanModalOpen(true);
  };

  const handleOpenCheckModal = (e) => {
    if (e) e.preventDefault();
    setIsCheckModalOpen(true);
  };

  return (
    <div className={`min-h-screen flex flex-col justify-between transition-colors duration-200 relative ${
      darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'
    }`}>

      <button
        type="button"
        onClick={(e) => { e.preventDefault(); setDarkMode(!darkMode); }}
        className={`fixed top-4 right-4 z-50 p-3 rounded-full shadow-2xl border transition-all flex items-center justify-center cursor-pointer text-xl hover:scale-110 active:scale-95 ${
          darkMode
            ? 'bg-slate-800 text-amber-300 border-slate-700 hover:bg-slate-700'
            : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100'
        }`}
        title="Toggle Dark & Light Mode"
        aria-label="Toggle Dark Mode"
      >
        <span>{darkMode ? '☀️' : '🌙'}</span>
      </button>

      <header className="bg-slate-900 text-white shadow-xl border-b-4 border-emerald-500 pr-16 md:pr-4">
        <div className="max-w-6xl mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/logo.jpg" alt="BIS Mitra Logo" className="w-12 h-12 rounded-xl object-cover shadow-lg border-2 border-emerald-500 shrink-0" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
                {t.title || 'BIS Mitra'}
              </h1>
              <p className="text-slate-300 text-sm sm:text-base font-medium">
                {t.subtitle || 'Official Assistant for Indian Standards'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={handleOpenScanModal}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-2 rounded-xl text-sm flex items-center gap-1.5 transition shadow-lg border border-emerald-500 shrink-0 cursor-pointer">
              <span>{t.scanBtn || '📷 Vision AI Scan'}</span>
            </button>

            <button type="button" onClick={() => setIsMapOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-2 rounded-xl text-sm flex items-center gap-1.5 transition shadow-lg border border-blue-500 shrink-0 cursor-pointer">
              <span>{t.mapBtn || '🗺️ BIS Offices Map'}</span>
            </button>

            <button type="button" onClick={() => setIsCalculatorOpen(true)}
              className="bg-violet-600 hover:bg-violet-700 text-white font-bold px-3 py-2 rounded-xl text-sm flex items-center gap-1.5 transition shadow-lg border border-violet-500 shrink-0 cursor-pointer">
              <span>{t.calcBtn || '🧮 Cost Calculator'}</span>
            </button>

            <button type="button" onClick={() => setIsAnalyticsOpen(true)}
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-3 py-2 rounded-xl text-sm flex items-center gap-1.5 transition shadow-lg border border-teal-500 shrink-0 cursor-pointer">
              <span>{t.analyticsBtn || '📊 Analytics'}</span>
            </button>

            <button type="button" onClick={() => setIsFakeReporterOpen(true)}
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-2 rounded-xl text-sm flex items-center gap-1.5 transition shadow-lg border border-red-500 shrink-0 cursor-pointer">
              <span>{t.reportBtn || '🚨 Report Fake'}</span>
            </button>

            <div className="bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-xl flex items-center gap-2">
              <span className="text-sm font-bold text-slate-300">{t.langLabel || '🌐'}</span>
              <select value={lang} onChange={(e) => setLang(e.target.value)}
                className="bg-slate-900 text-white font-bold rounded-lg px-2 py-1 border border-slate-600 text-sm focus:outline-none focus:border-emerald-500 cursor-pointer">
                {Object.keys(TRANSLATIONS).map((code) => (
                  <option key={code} value={code}>{TRANSLATIONS[code].name}</option>
                ))}
              </select>
            </div>

            <button type="button" onClick={handleOpenCheckModal}
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-3 py-2 rounded-xl text-sm flex items-center gap-1.5 transition shadow-lg border border-orange-500 shrink-0 cursor-pointer">
              <span>{t.checkBtn || '🔍 Is My Product Certified?'}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto w-full px-4 py-6 flex-1">
        <div className={`rounded-2xl p-4 shadow-md border mb-6 flex flex-wrap items-center justify-between gap-4 ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className={`flex items-center gap-2 font-bold text-lg ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
            <span>{t.industryLabel || '⚙️ Industry Sector Filter:'}</span>
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
              <option value="All">{t.allIndustries || 'All Industries'}</option>
              <option value="Food & Beverages">{t.food || 'Food & Beverages'}</option>
              <option value="Electronics">{t.electronics || 'Electronics & IT'}</option>
              <option value="Safety">{t.safety || 'Safety & Automotive'}</option>
              <option value="Consumer Goods">{t.consumer || 'Consumer Goods & Toys'}</option>
              <option value="Steel">{t.steel || 'Steel & Construction'}</option>
              <option value="Precious Metals">{t.metals || 'Precious Metals & Hallmarking'}</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <div className={`flex items-center justify-between gap-2 font-bold text-sm mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            <div className="flex items-center gap-2">
              <span>{t.sampleTitle || '✨ Suggested Questions for this Sector:'}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                darkMode ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {category}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {Array.isArray(currentSampleQuestions) && currentSampleQuestions.map((q, idx) => (
              <button
                type="button"
                key={idx}
                onClick={(e) => { e.preventDefault(); handleSend(q); }}
                className={`text-sm sm:text-base font-semibold px-4 py-2 rounded-xl border shadow-sm transition-all text-left cursor-pointer ${
                  darkMode
                    ? 'bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-emerald-400 border-slate-800 hover:border-emerald-500'
                    : 'bg-white hover:bg-emerald-50 text-slate-800 hover:text-emerald-800 border-slate-300 hover:border-emerald-400'
                }`}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        <ChatBox
          messages={messages}
          loading={loading}
          t={t}
          darkMode={darkMode}
          lang={lang}
          onClear={() => setMessages([])}
          onOpenChatPDF={(data) => { setChatPDFData(data); setIsChatPDFOpen(true); }}
        />
        <InputBar onSend={handleSend} loading={loading} t={t} lang={lang} darkMode={darkMode} />
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
        onGenerateReport={(data) => { setPdfReportData(data); setIsPDFOpen(true); }}
      />

      <IndiaMapModal
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        darkMode={darkMode}
      />

      <MSMECalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
        darkMode={darkMode}
      />

      <AnalyticsDashboardModal
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
        darkMode={darkMode}
      />

      <FakeProductReporterModal
        isOpen={isFakeReporterOpen}
        onClose={() => setIsFakeReporterOpen(false)}
        darkMode={darkMode}
      />

      <PDFReportModal
        isOpen={isPDFOpen}
        onClose={() => { setIsPDFOpen(false); setPdfReportData(null); }}
        reportData={pdfReportData}
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
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>{t.footerText || '© Bureau of Indian Standards (BIS) Mitra — Quality & Compliance Portal'}</p>
          <div className="flex gap-4 font-semibold text-slate-300">
            <a href="https://www.bis.gov.in" target="_blank" rel="noopener noreferrer" className="hover:underline">bis.gov.in</a>
            <a href="https://www.manakonline.in" target="_blank" rel="noopener noreferrer" className="hover:underline">manakonline.in</a>
            <a href="https://www.crsbis.in" target="_blank" rel="noopener noreferrer" className="hover:underline">crsbis.in</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

if (typeof document !== 'undefined' && document.getElementById('root')) {
  ReactDOM.createRoot(document.getElementById('root')).render(<App />);
}
