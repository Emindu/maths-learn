const fs = require('fs');
let c = fs.readFileSync('src/components/Hub.tsx', 'utf8');

// Replace to="..." with to="..." isLocked={!isUnlocked("...")} isCompleted={isCompleted("...")}
// but don't double replace if we already did
c = c.replace(/to="([^"]+)"(?!\s*isLocked)/g, (match, p1) => {
  return `to="${p1}" isLocked={!isUnlocked('${p1}')} isCompleted={isCompleted('${p1}')}`;
});

fs.writeFileSync('src/components/Hub.tsx', c);
