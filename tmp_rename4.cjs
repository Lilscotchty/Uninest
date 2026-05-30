import fs from 'fs';

const file = 'src/pages/Home.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/more than just a room/g, "more than just a unit");
content = content.replace(/Executive single rooms/g, "Executive single suites");
content = content.replace(/I found my room/g, "I found my unit");
content = content.replace(/See rooms live/g, "See units live");

fs.writeFileSync(file, content, 'utf8');
