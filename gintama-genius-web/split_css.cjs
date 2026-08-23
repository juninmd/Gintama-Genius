const fs = require('fs');
const css = fs.readFileSync('src/styles/hud_combined.css', 'utf-8');

const lines = css.split('\n');
let currentChunk = [];
let chunkIndex = 1;

let inRule = false;
let openBraces = 0;

function saveChunk() {
  if (currentChunk.length === 0) return;
  fs.writeFileSync(`src/styles/hud-${chunkIndex}.css`, currentChunk.join('\n'));
  console.log(`Saved hud-${chunkIndex}.css with ${currentChunk.length} lines.`);
  chunkIndex++;
  currentChunk = [];
}

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  currentChunk.push(line);

  // Count braces to know if we're at the top level
  openBraces += (line.match(/\{/g) || []).length;
  openBraces -= (line.match(/\}/g) || []).length;

  if (openBraces === 0 && line.trim() === '}') {
      // Safe to split here if chunk gets too big
      if (currentChunk.length > 100) {
          saveChunk();
      }
  } else if (openBraces === 0 && line.trim() === '' && currentChunk.length > 100) {
      saveChunk();
  }
}

saveChunk();
