const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../lib/auction/mock-data.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Replace all spaces in LOTE 59 to hyphens, lowercase it
content = content.replace(/\/LOTE 59\/(\d+)?\s*LOTE 59\.jpeg/g, (match, p1) => {
  if (p1) {
    return `/lote-59/${p1}-lote-59.jpeg`;
  }
  return `/lote-59/lote-59.jpeg`;
});

// Remove the URL auto-encoding block at the end (lines 352-357) if it's there
content = content.replace(/\/\/ Codificación automática de espacios[\s\S]*?MOCK_LOTS\.forEach[\s\S]*?\}\)\s*\}\)\s*/g, '');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated mock-data.ts with clean lowercase kebab-case image URLs!');
