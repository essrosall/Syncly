const fs = require('fs');
const s = fs.readFileSync('src/pages/Settings.jsx','utf8');
const lines = s.split(/\r?\n/);
let stack = [];
for (let i = 0; i < lines.length; i++) {
  const l = lines[i];
  if (/\<div(\s|>)/.test(l)) stack.push({line: i+1, text: l.trim()});
  if (/\<\/div\>/.test(l)) {
    if (stack.length === 0) {
      console.log('Unmatched closing </div> at', i+1);
    } else {
      stack.pop();
    }
  }
}
if (stack.length) {
  console.log('Unmatched opening <div> at', stack.map(x=>x.line));
} else {
  console.log('All divs matched');
}
