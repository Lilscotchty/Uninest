import fs from 'fs';

const file = 'src/pages/Details.tsx';
let content = fs.readFileSync(file, 'utf8');

// Rooms -> Units text in Details
content = content.replace(/Private Single Room/g, "Private Single Suite");
content = content.replace(/Shared Double Room/g, "Shared Double Unit");
content = content.replace(/Shared Quad Room/g, "Shared Quad Unit");
content = content.replace(/4 rooms left/g, "4 units left");
content = content.replace(/2 rooms left/g, "2 units left");
content = content.replace(/6 rooms left/g, "6 units left");
content = content.replace(/in a room \/ sem/g, "in a unit / sem");
content = content.replace(/Single Room –/g, "Single Unit –");
content = content.replace(/Double Room –/g, "Double Unit –");
content = content.replace(/Quad Room –/g, "Quad Unit –");

fs.writeFileSync(file, content, 'utf8');
