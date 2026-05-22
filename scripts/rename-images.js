const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../Public/LOTE 59');
const destDir = path.join(__dirname, '../Public/lote-59');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

if (fs.existsSync(srcDir)) {
  const files = fs.readdirSync(srcDir);
  files.forEach(file => {
    // Check if LOTE 59 is in the name
    if (file.includes('LOTE 59')) {
      let newName = file.replace(/LOTE 59/g, 'lote-59').replace(/ /g, '-').toLowerCase();
      // Ensure there are no double hyphens like '--'
      newName = newName.replace(/-+/g, '-');
      fs.copyFileSync(path.join(srcDir, file), path.join(destDir, newName));
      console.log(`Copied: ${file} -> ${newName}`);
    }
  });
  console.log('Successfully copied all images to lote-59 directory in lowercase kebab-case.');
} else {
  console.error(`Source directory does not exist: ${srcDir}`);
}
