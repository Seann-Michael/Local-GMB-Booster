const fs = require("fs");

// Read the file
const content = fs.readFileSync("client/pages/SuperAdminAPI.tsx", "utf8");

// Fix the corrupted line
const fixedContent = content.replace(
  /return `•.*?•••\${lastSix}`;/,
  "return `•••••${lastSix}`;",
);

// Write back the fixed content
fs.writeFileSync("client/pages/SuperAdminAPI.tsx", fixedContent, "utf8");

console.log("Fixed corrupted characters in SuperAdminAPI.tsx");
