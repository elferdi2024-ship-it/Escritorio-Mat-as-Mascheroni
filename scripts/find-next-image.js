const fs = require('fs');
const path = require('path');

function findImports(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(f => {
    const fp = path.join(dir, f);
    if (fs.statSync(fp).isDirectory() && !f.startsWith('.') && f !== 'node_modules') {
      findImports(fp);
    } else if (fp.endsWith('.tsx') || fp.endsWith('.ts')) {
      const c = fs.readFileSync(fp, 'utf8');
      if (c.includes("from 'next/image'") || c.includes('from "next/image"')) {
        console.log(fp);
      }
    }
  });
}

findImports('.');
