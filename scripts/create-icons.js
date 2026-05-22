const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'public', 'icons');
fs.mkdirSync(dir, { recursive: true });

function createSVGIcon(size) {
  const rx = Math.round(size * 0.15);
  const fontSize = Math.round(size * 0.3);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect fill="#2d5016" width="${size}" height="${size}" rx="${rx}"/>
  <text x="50%" y="55%" font-family="Arial,sans-serif" font-weight="bold" font-size="${fontSize}" fill="#d4a843" text-anchor="middle" dominant-baseline="middle">RC</text>
</svg>`;
}

[96, 192, 512].forEach(size => {
  fs.writeFileSync(path.join(dir, `icon-${size}.png`), createSVGIcon(size));
});
fs.copyFileSync(path.join(dir, 'icon-512.png'), path.join(dir, 'icon-maskable.png'));
console.log('Icons created:', fs.readdirSync(dir));
