import fs from 'fs';

const files = [
  'src/pages/Explore.tsx',
  'src/pages/Details.tsx',
  'src/pages/Home.tsx'
];

for (const file of files) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/import \{.*\} from 'react-icons.*';?/g, '');
    content = content.replace(/import \{.*\} from "react-icons.*";?/g, '');
    
    // Quick replacements for remaining usages
    content = content.replace(/<FaStar/g, '<Star size={14}');
    content = content.replace(/<FaHeart/g, '<Heart size={16} strokeWidth={2.5}');
    content = content.replace(/<FaRegHeart/g, '<Heart size={16} strokeWidth={2.5} fill="none" color="currentColor"');
    content = content.replace(/<FaWhatsapp/g, '<MessageCircle size={20}');
    content = content.replace(/<FaWifi/g, '<Wifi size={14}');
    content = content.replace(/<FaSnowflake/g, '<Snowflake size={14}');
    content = content.replace(/<FaShieldAlt/g, '<ShieldCheck size={14}');
    content = content.replace(/<FaPlug/g, '<PlugZap size={14}');
    content = content.replace(/<FaBookOpen/g, '<BookOpen size={14}');
    content = content.replace(/<FaTint/g, '<Droplet size={14}');
    content = content.replace(/<FaUtensils/g, '<Coffee size={14}'); // using coffee as fallback
    content = content.replace(/<FaVrCardboard/g, '<Video size={14}'); // fallback
    content = content.replace(/<HiLocationMarker/g, '<MapPin size={16}');
    
    fs.writeFileSync(file, content, 'utf8');
  }
}
