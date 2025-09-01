// Script to check for missing sticker images
const fs = require('fs');
const path = require('path');

const stickersDir = path.join(__dirname, 'src', 'assets', 'stickers');
const componentFile = path.join(__dirname, 'src', 'components', 'StickerRoulette.jsx');

// Read the component file to extract import statements
const componentContent = fs.readFileSync(componentFile, 'utf8');

// Extract all import lines for stickers
const importLines = componentContent.match(/import .+ from ['"]\.\.\/.+stickers\/.+['"]/g) || [];

// Extract filenames from imports
const importedFiles = importLines.map(line => {
  const match = line.match(/from ['"]\.\.\/.+stickers\/(.+)['"]/);
  return match ? match[1] : null;
}).filter(Boolean);

// Get actual files in the stickers directory
const actualFiles = fs.readdirSync(stickersDir);

console.log('=== STICKER IMAGE ANALYSIS ===\n');

console.log(`Total imports in component: ${importedFiles.length}`);
console.log(`Total files in directory: ${actualFiles.length}\n`);

// Check for imported files that don't exist
const missingFiles = importedFiles.filter(file => !actualFiles.includes(file));
if (missingFiles.length > 0) {
  console.log('❌ MISSING FILES (imported but not found):');
  missingFiles.forEach(file => console.log(`  - ${file}`));
  console.log();
}

// Check for files that exist but aren't imported
const unimportedFiles = actualFiles.filter(file => !importedFiles.includes(file));
if (unimportedFiles.length > 0) {
  console.log('⚠️  UNIMPORTED FILES (exist but not imported):');
  unimportedFiles.forEach(file => console.log(`  - ${file}`));
  console.log();
}

// Check for potential naming mismatches
console.log('🔍 POTENTIAL NAMING ISSUES:');
importedFiles.forEach(imported => {
  const similar = actualFiles.filter(actual => {
    const importedLower = imported.toLowerCase();
    const actualLower = actual.toLowerCase();
    return Math.abs(importedLower.length - actualLower.length) <= 3 && 
           (importedLower.includes(actualLower.slice(0, -4)) || actualLower.includes(importedLower.slice(0, -4)));
  });
  
  if (similar.length > 0 && !actualFiles.includes(imported)) {
    console.log(`  - "${imported}" might be "${similar[0]}"`);
  }
});

if (missingFiles.length === 0 && unimportedFiles.length === 0) {
  console.log('✅ All imported sticker images exist and are properly referenced!');
}
