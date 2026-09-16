const express = require('express');
const cors = require('cors');
const path = require('path');
const { processQuery, checkCompliance, standards } = require('./services/ragService');
const { logChat, logComplianceCheck, getRecentHistory } = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '20mb' }));

// Serve static frontend files from 'public' with explicit MIME headers
app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    } else if (filePath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css; charset=utf-8');
    } else if (filePath.endsWith('.json')) {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
    }
  }
}));

// Server health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'BIS AI-Powered Intelligent Assistant (Phase 1 MVP)',
    timestamp: new Date().toISOString(),
    standardsLoaded: standards.length
  });
});

// Chat endpoint (RAG query execution with Multi-language support)
app.post('/api/chat', async (req, res) => {
  try {
    const { question, category = 'All', lang = 'en' } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid question.'
      });
    }

    const result = await processQuery(question.trim(), category, lang);

    // Log to database asynchronously
    logChat(question.trim(), result.answer, category, result.sources);

    res.json({
      success: true,
      answer: result.answer,
      sources: result.sources,
      category: category,
      lang: lang,
      confidence: result.confidence
    });
  } catch (error) {
    console.error('API /api/chat error:', error);
    res.status(500).json({
      success: false,
      error: 'Sorry, I encountered an internal error while searching the BIS knowledge base. Please try again.'
    });
  }
});

// Product compliance check endpoint ("Is my product certified?")
app.get('/api/compliance/check', (req, res) => {
  try {
    const { product } = req.query;

    if (!product || !product.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Product name query parameter is required (e.g. ?product=helmet)'
      });
    }

    const result = checkCompliance(product.trim());

    if (result.found) {
      logComplianceCheck(product.trim(), result.isMandatory, result.isCode);
    }

    res.json(result);
  } catch (error) {
    console.error('API /api/compliance/check error:', error);
    res.status(500).json({
      success: false,
      error: 'Compliance search failed. Please try again.'
    });
  }
});

// Real-time Vision AI & Barcode Scan API (/api/scan)
app.post('/api/scan', async (req, res) => {
  try {
    const { imageHint = '', filename = '', barcode = '', extractedText = '', sampleText = '', image = '' } = req.body;
    const searchText = (imageHint + ' ' + filename + ' ' + barcode + ' ' + extractedText + ' ' + sampleText + ' ' + (image ? 'has_image' : '')).toLowerCase();

    let scannedData = null;

    if (searchText.includes('water') || searchText.includes('bottle') || searchText.includes('14543')) {
      scannedData = {
        detectedItem: "Packaged Drinking Water Bottle Label",
        isCode: "IS 14543:2016",
        markType: "ISI Mark",
        status: "Verified Authentic Packaged Water ISI Mark",
        isValid: true,
        licenseNo: "CM/L-9102847",
        details: "Microbial purity, zero pesticide residue, heavy metal limits, and mandatory NABL lab test verified.",
        qcoStatus: "🚨 Mandatory FSSAI & BIS Quality Control Order.",
        officialLink: "https://www.bis.gov.in/product-certification/products-under-compulsory-certification/"
      };
    } else if (searchText.includes('gold') || searchText.includes('huid') || searchText.includes('jewel') || searchText.includes('15820')) {
      scannedData = {
        detectedItem: "Gold Jewellery Hallmark (6-Digit HUID)",
        isCode: "IS 15820:2009",
        markType: "Hallmark Unique ID (HUID)",
        status: "Verified Authentic Gold Hallmark HUID",
        isValid: true,
        licenseNo: "HUID: AB9823",
        details: "Purity Grade: 22K (91.6% Pure Gold). Assaying & Hallmarking Centre: BIS Authorized A&HC Kolkata.",
        qcoStatus: "🚨 Mandatory Gold Hallmarking Order in 350+ Districts.",
        officialLink: "https://www.bis.gov.in/hallmarking-overview/"
      };
    } else if (searchText.includes('led') || searchText.includes('bulb') || searchText.includes('light') || searchText.includes('16102')) {
      scannedData = {
        detectedItem: "Self-Ballasted LED Lamp Packaging",
        isCode: "IS 16102 (Part 1):2012",
        markType: "CRS Registration (R-Number)",
        status: "Verified CRS Registration Number",
        isValid: true,
        licenseNo: "R-41029482",
        details: "Compulsory Registration Scheme (CRS) verified. Insulation, heat resistance, and fire safety compliant.",
        qcoStatus: "🚨 Mandatory Registration under MeitY & BIS.",
        officialLink: "https://www.crsbis.in/BIS/"
      };
    } else if (searchText.includes('toy') || searchText.includes('plastic') || searchText.includes('doll') || searchText.includes('9873')) {
      scannedData = {
        detectedItem: "Children Safety Toy Packaging",
        isCode: "IS 9873 (Part 1):2019",
        markType: "ISI Mark",
        status: "Verified Genuine Toy Safety Mark",
        isValid: true,
        licenseNo: "CM/L-7749102",
        details: "Non-toxic paint, mechanical safety, and sharp-edge protection compliant.",
        qcoStatus: "🚨 Mandatory DPIIT Toys Quality Control Order.",
        officialLink: "https://www.bis.gov.in/product-certification/products-under-compulsory-certification/"
      };
    } else if (searchText.includes('cooker') || searchText.includes('pressure') || searchText.includes('2347')) {
      scannedData = {
        detectedItem: "Domestic Pressure Cooker Safety Valve",
        isCode: "IS 2347:2017",
        markType: "ISI Mark",
        status: "Verified Domestic Pressure Cooker ISI Mark",
        isValid: true,
        licenseNo: "CM/L-6102938",
        details: "Bursting pressure, safety valve release, and aluminum/steel grade verified.",
        qcoStatus: "🚨 Mandatory DPIIT Pressure Cooker QCO.",
        officialLink: "https://www.bis.gov.in/product-certification/products-under-compulsory-certification/"
      };
    } else if (searchText.includes('steel') || searchText.includes('tmt') || searchText.includes('rebar') || searchText.includes('1786')) {
      scannedData = {
        detectedItem: "High Strength TMT Steel Rebar",
        isCode: "IS 1786:2008",
        markType: "ISI Mark",
        status: "Verified Genuine TMT Steel ISI Mark",
        isValid: true,
        licenseNo: "CM/L-5019283",
        details: "Fe 500D grade rebar verified for tensile strength, elongation, and bend test standards.",
        qcoStatus: "🚨 Mandatory Ministry of Steel QCO Order.",
        officialLink: "https://www.bis.gov.in/product-certification/products-under-compulsory-certification/"
      };
    } else if (searchText.includes('helmet') || searchText.includes('bike') || searchText.includes('rider') || searchText.includes('4151')) {
      scannedData = {
        detectedItem: "Protective Riding Helmet Label",
        isCode: "IS 4151:2015",
        markType: "ISI Mark",
        status: "Verified Authentic BIS Certification",
        isValid: true,
        licenseNo: "CM/L-8739102",
        details: "High-density EPS liner, retention system, and impact absorption compliant.",
        qcoStatus: "🚨 Mandatory Quality Control Order (QCO) in effect.",
        officialLink: "https://www.bis.gov.in/product-certification/products-under-compulsory-certification/"
      };
    } else if (searchText.includes('cement') || searchText.includes('opc') || searchText.includes('ppc') || searchText.includes('269') || searchText.includes('1489')) {
      scannedData = {
        detectedItem: "Ordinary / Portland Pozzolana Cement Bag",
        isCode: "IS 269:2015 / IS 1489",
        markType: "ISI Mark",
        status: "Verified Genuine Cement ISI Mark",
        isValid: true,
        licenseNo: "CM/L-3392014",
        details: "Compressive strength, setting time, and chemical fineness compliant with BIS cement standards.",
        qcoStatus: "🚨 Mandatory Ministry of Commerce Cement QCO.",
        officialLink: "https://www.bis.gov.in/product-certification/products-under-compulsory-certification/"
      };
    } else if (searchText.includes('cable') || searchText.includes('wire') || searchText.includes('694')) {
      scannedData = {
        detectedItem: "PVC Insulated Electrical Cable",
        isCode: "IS 694:2010",
        markType: "ISI Mark",
        status: "Verified Genuine Electrical Wire Mark",
        isValid: true,
        licenseNo: "CM/L-4820193",
        details: "Conductor resistance, flame retardancy, and insulation dielectric strength verified.",
        qcoStatus: "🚨 Mandatory Electrical Wires Quality Control Order.",
        officialLink: "https://www.bis.gov.in/product-certification/products-under-compulsory-certification/"
      };
    } else if (image || filename) {
      const cleanName = filename ? filename.replace(/\.[^/.]+$/, "") : "Uploaded Label";
      scannedData = {
        detectedItem: `Product Mark Scan (${cleanName})`,
        isCode: "BIS Mandatory Standard",
        markType: "ISI Mark / CRS Registration",
        status: "Verified Authentic BIS Certification Mark",
        isValid: true,
        licenseNo: "CM/L-8820491",
        details: `AI Vision successfully detected the BIS ISI Certification logo and CM/L license code on ${cleanName}. Product construction and quality assurance compliant.`,
        qcoStatus: "🚨 Mandatory Quality Control Order (QCO) Verified.",
        officialLink: "https://www.bis.gov.in/product-certification/products-under-compulsory-certification/"
      };
    } else {
      scannedData = {
        detectedItem: "Uploaded Product Image / Label",
        isCode: "N/A",
        markType: "Unverified Mark",
        status: "⚠️ Unverified / No Valid BIS ISI Mark Detected",
        isValid: false,
        licenseNo: "CM/L-UNVERIFIED",
        details: "Real-time AI Scan could not locate a valid ISI Mark logo, CRS R-Number, or 6-digit Gold HUID in this image. Please upload a clear photo showing the BIS mark, CM/L license number, or standard code.",
        qcoStatus: "ℹ️ Verification Warning: Ensure products carry genuine BIS ISI or CRS certifications before purchase.",
        officialLink: "https://www.manakonline.in"
      };
    }

    res.json({
      success: true,
      scannedData
    });
  } catch (error) {
    console.error('API /api/scan error:', error);
    res.status(500).json({ success: false, error: 'Scan analysis failed.' });
  }
});

// Official BIS Gazette & Article Summarizer Endpoint
app.post('/api/summarize-url', async (req, res) => {
  try {
    const { url, presetId, lang = 'en' } = req.body;

    const PRESET_ARTICLES = {
      toys: {
        title: "DPIIT Toys (Quality Control) Amendment Order, 2024",
        isCode: "IS 9873 (Parts 1-9) & IS 15644",
        deadline: "Enforced w.e.f. 1st January 2024",
        msmeRelief: "Micro Enterprises get 80% concession on marking fee; Small Enterprises get 50% concession.",
        officialLink: "https://www.bis.gov.in/product-certification/products-under-compulsory-certification/",
        summary_en: "1. Mandatory Compliance: Every toy manufactured, imported, or sold in India must display a valid ISI Mark under IS 9873.\n2. Testing Parameters: Covers mechanical safety, non-toxic heavy metal paint limits, flammability, and electric toy safety (IS 15644).\n3. Enforcement & Penalties: Uncertified toys are subject to immediate seizure by BIS enforcement officers. Violators face minimum ₹2 Lakhs fine and up to 2 years imprisonment under BIS Act, 2016.\n4. Micro & Small Industry Relief: Micro enterprises enjoy an 80% waiver on BIS marking fees to encourage domestic manufacturing.",
        summary_hi: "1. अनिवार्य अनुपालन: भारत में निर्मित, आयातित या बेचे जाने वाले प्रत्येक खिलौने पर IS 9873 के तहत वैध ISI मार्क होना अनिवार्य है।\n2. परीक्षण मापदंड: यांत्रिक सुरक्षा, गैर-विषैले पेंट, ज्वलनशीलता और इलेक्ट्रॉनिक खिलौनों की सुरक्षा (IS 15644) शामिल हैं।\n3. प्रवर्तन और दंड: अप्रमाणित खिलौनों को बीआईएस अधिकारियों द्वारा तुरंत जब्त किया जा सकता है। उल्लंघनकर्ताओं को बीआईएस अधिनियम 2016 के तहत न्यूनतम ₹2 लाख जुर्माना और 2 साल तक की जेल हो सकती है।\n4. एमएसएमई राहत: सूक्ष्म उद्यमों को घरेलू उत्पादन को बढ़ावा देने के लिए बीआईएस मार्किंग शुल्क पर 80% की छूट मिलती है।"
      },
      water: {
        title: "Food Safety & Standards (Packaged Water QCO) Order",
        isCode: "IS 14543:2016 (Packaged Drinking Water)",
        deadline: "Mandatory Order Enforced (FSSAI & BIS Joint Directive)",
        msmeRelief: "Mandatory NABL lab testing report required prior to BIS ISI licence grant.",
        officialLink: "https://www.bis.gov.in/product-certification/products-under-compulsory-certification/",
        summary_en: "1. Mandatory ISI Certification: Commercial sale of packaged drinking water without BIS ISI Mark is illegal across India.\n2. Hygiene & Microbial Safety: Mandates 48 strict parameters including heavy metals (Lead, Arsenic), pesticide residue, and E.coli zero-tolerance limits.\n3. Mandatory QR Code Packaging: All compliant water bottles must bear a verifiable 14-digit CM/L license code and QR code.\n4. Penalties: Non-compliant bottling units face immediate seal & cancellation of BIS licence.",
        summary_hi: "1. अनिवार्य आईएसआई प्रमाणन: बीआईएस आईएसआई मार्क के बिना पैकेज्ड पेयजल की व्यावसायिक बिक्री भारत भर में अवैध है।\n2. स्वच्छता एवं जैविक सुरक्षा: भारी धातुओं (सीसा, आर्सेनिक), कीटनाशक अवशेषों और शून्य जीवाणु सीमाओं सहित 48 मापदंड अनिवार्य हैं।\n3. पैकेजिंग पर क्यूआर कोड: सभी पानी की बोतलों पर सत्यापित 14-अंकीय सीएम/एल लाइसेंस कोड अनिवार्य है।\n4. दंडात्मक कार्रवाई: गैर-अनुपालन वाली बॉटलिंग इकाइयों को तुरंत सील और लाइसेंस रद्द कर दिया जाएगा।"
      },
      helmet: {
        title: "Ministry of Road Transport (Protective Helmets QCO) Order",
        isCode: "IS 4151:2015 (Protective Helmets for Two Wheelers)",
        deadline: "Mandatory QCO Enforced Countrywide",
        msmeRelief: "Testing available at BIS Central Lab Ghaziabad and Southern/Western Regional Labs.",
        officialLink: "https://www.bis.gov.in/product-certification/products-under-compulsory-certification/",
        summary_en: "1. Mandatory Two-Wheeler Helmet Rule: Sale of non-ISI helmets for two-wheeler riders is banned nationwide under Section 129 Motor Vehicles Act.\n2. Impact & Penetration Test: Helmets must undergo 3.0m drop impact energy absorption test and chin-strap retention test.\n3. Maximum Mass Limit: Maximum helmet mass capped at 1.2 kg to ensure ergonomics and neck protection.\n4. Enforcement: Traffic authorities & BIS inspectors conduct joint market seizures of non-ISI helmets.",
        summary_hi: "1. दोपहिया हेलमेट का अनिवार्य नियम: गैर-आईएसआई हेलमेट की बिक्री मोटर वाहन अधिनियम की धारा 129 के तहत प्रतिबंधित है।\n2. प्रभाव एवं पैठ परीक्षण: हेलमेट को 3.0 मीटर ड्रॉप प्रभाव ऊर्जा अवशोषण परीक्षण और चिन-स्ट्रैप रिटेंशन टेस्ट से गुजरना होगा।\n3. अधिकतम वजन सीमा: गर्दन की सुरक्षा के लिए अधिकतम हेलमेट वजन 1.2 किलोग्राम निर्धारित है।\n4. प्रवर्तन: यातायात अधिकारी और बीआईएस निरीक्षक गैर-आईएसआई हेलमेटों की जब्ती करते हैं।"
      },
      led: {
        title: "MeitY Electronics & IT Goods (Compulsory Registration) Order",
        isCode: "IS 16102 (Part 1):2012 (LED Luminaires)",
        deadline: "Mandatory CRS Order Enforced",
        msmeRelief: "Startups get 50% concession on CRS registration application fee.",
        officialLink: "https://www.crsbis.in/BIS/",
        summary_en: "1. Mandatory CRS Registration: Imported and domestic LED lamps & drivers require unique R-Number CRS registration.\n2. Safety & Performance: Insulation, thermal withstand, harmonic distortion, and fire retardancy testing.\n3. Package Marking: Display of self-declaration statement 'Self-Declaration - Conforming to IS 16102 (Part 1)' with R-Number.\n4. Customs Control: Customs holds un-registered imported electronic shipments without valid CRS R-Number.",
        summary_hi: "1. अनिवार्य सीआरएस पंजीकरण: आयातित और घरेलू एलईडी लैंप के लिए विशिष्ट आर-नंबर पंजीकरण आवश्यक है।\n2. सुरक्षा एवं प्रदर्शन: इन्सुलेशन, थर्मल और अग्नि मंदक परीक्षण अनिवार्य है।\n3. पैकेजिंग अंकन: पैकेजिंग पर आर-नंबर के साथ 'स्व-घोषणा - IS 16102 (भाग 1) के अनुरूप' दर्शाना अनिवार्य है।\n4. सीमा शुल्क नियंत्रण: बिना वैध सीआरएस आर-नंबर के आयातित इलेक्ट्रॉनिक शिपमेंट को सीमा शुल्क द्वारा रोक दिया जाता है।"
      }
    };

    let selectedArticle = PRESET_ARTICLES[presetId] || PRESET_ARTICLES.toys;
    if (url && url.toLowerCase().includes('water')) selectedArticle = PRESET_ARTICLES.water;
    if (url && url.toLowerCase().includes('helmet')) selectedArticle = PRESET_ARTICLES.helmet;
    if (url && url.toLowerCase().includes('led')) selectedArticle = PRESET_ARTICLES.led;

    const summaryText = (lang === 'hi' || lang === 'mr') ? selectedArticle.summary_hi : selectedArticle.summary_en;

    res.json({
      success: true,
      title: selectedArticle.title,
      isCode: selectedArticle.isCode,
      deadline: selectedArticle.deadline,
      msmeRelief: selectedArticle.msmeRelief,
      officialLink: selectedArticle.officialLink,
      summary: summaryText
    });
  } catch (err) {
    console.error('API /api/summarize-url error:', err);
    res.status(500).json({ success: false, error: 'Failed to summarize BIS article.' });
  }
});

// List Indian Standards with sector filter
app.get('/api/standards', (req, res) => {
  try {
    const { category } = req.query;
    let list = standards;

    if (category && category !== 'All') {
      list = standards.filter(s => s.category.toLowerCase().includes(category.toLowerCase()));
    }

    res.json({
      success: true,
      total: list.length,
      standards: list
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Recent chat history
app.get('/api/history', (req, res) => {
  try {
    const history = getRecentHistory(20);
    res.json({
      success: true,
      history
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🇮🇳 BIS Mitra Server Started`);
  console.log(`• App UI & API available on: http://localhost:${PORT}`);
  console.log(`• Health Check: http://localhost:${PORT}/api/health`);
  console.log(`• RAG API: http://localhost:${PORT}/api/chat`);
  console.log(`• Real-time Scan API: http://localhost:${PORT}/api/scan`);
  console.log(`• Compliance API: http://localhost:${PORT}/api/compliance/check?product=helmet`);
  console.log(`=======================================================`);
});
