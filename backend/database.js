const fs = require('fs');
const path = require('path');

const dbFilePath = path.join(__dirname, 'data', 'bis_db.json');

// Initialize local DB file if not exists
function initDb() {
  if (!fs.existsSync(dbFilePath)) {
    const initialData = {
      conversations: [],
      compliance_checks: []
    };
    fs.writeFileSync(dbFilePath, JSON.stringify(initialData, null, 2), 'utf8');
  }
}

initDb();

function readDb() {
  try {
    const raw = fs.readFileSync(dbFilePath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return { conversations: [], compliance_checks: [] };
  }
}

function writeDb(data) {
  try {
    fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error("Failed to save to database:", err);
  }
}

/**
 * Log a chat conversation
 */
function logChat(question, answer, category, sources) {
  const dbData = readDb();
  const entry = {
    id: dbData.conversations.length + 1,
    question,
    answer,
    category: category || 'All',
    sources: sources || [],
    timestamp: new Date().toISOString()
  };
  dbData.conversations.unshift(entry); // newest first
  writeDb(dbData);
}

/**
 * Log a compliance check
 */
function logComplianceCheck(productQuery, isMandatory, isCode) {
  const dbData = readDb();
  const entry = {
    id: dbData.compliance_checks.length + 1,
    product_query: productQuery,
    is_mandatory: isMandatory,
    is_code: isCode || 'N/A',
    timestamp: new Date().toISOString()
  };
  dbData.compliance_checks.unshift(entry);
  writeDb(dbData);
}

/**
 * Get recent chat history
 */
function getRecentHistory(limit = 20) {
  const dbData = readDb();
  return dbData.conversations.slice(0, limit);
}

module.exports = {
  logChat,
  logComplianceCheck,
  getRecentHistory
};
