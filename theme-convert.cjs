const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    filelist = fs.statSync(path.join(dir, file)).isDirectory()
      ? walkSync(path.join(dir, file), filelist)
      : filelist.concat(path.join(dir, file));
  });
  return filelist;
}

const files = walkSync('src/admin').filter(f => f.endsWith('.jsx'));
files.push('src/App.jsx');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Colors
  content = content.replace(/#0D1117/g, '#F9FAFB'); // Main bg
  content = content.replace(/#161B22/g, '#FFFFFF'); // Card bg
  content = content.replace(/#1C2128/g, '#FFFFFF'); // Tooltip bg
  content = content.replace(/#30363D/g, '#E5E7EB'); // Borders
  content = content.replace(/#21262D/g, '#F3F4F6'); // Inner borders / hover bg
  
  // Text colors
  content = content.replace(/text-white/g, 'text-[#0A0A0A]');
  content = content.replace(/text-\[#8B949E\]/g, 'text-[#555555]');
  content = content.replace(/text-\[#484F58\]/g, 'text-[#888888]');
  content = content.replace(/text-\[#E6EDF3\]/g, 'text-[#333333]');
  
  // Hover text colors
  content = content.replace(/hover:text-white/g, 'hover:text-[#0A0A0A]');
  content = content.replace(/hover:text-\[#E6EDF3\]/g, 'hover:text-[#333333]');
  content = content.replace(/hover:border-\[#484F58\]/g, 'hover:border-[#999999]');
  
  // Specific alphas for hover/borders
  content = content.replace(/rgba\(255,255,255,0\.02\)/g, 'rgba(0,0,0,0.02)');
  content = content.replace(/rgba\(255,255,255,0\.05\)/g, 'rgba(0,0,0,0.05)');
  
  // Recharts text colors (tick={{ fill: '#484F58' }})
  content = content.replace(/fill: '#484F58'/g, "fill: '#888888'");
  content = content.replace(/fill: '#8B949E'/g, "fill: '#555555'");

  // Fix buttons that have linear-gradient and should have white text
  // e.g. text-[#0A0A0A] font-semibold transition-all" style={{ background: 'linear-gradient...
  content = content.replace(/text-\[#0A0A0A\]([^>]+?background:\s*['"`]linear-gradient)/g, 'text-white$1');
  
  // Fix background: '#FF3C78'
  content = content.replace(/text-\[#0A0A0A\]([^>]+?background:\s*['"`]#FF3C78)/g, 'text-white$1');
  
  // AdminSidebar active state (was text-white, now text-[#0A0A0A] which is okay on 0.15 gradient)
  // But let's make it text-[#FF3C78] for active state text
  // isActive ? 'text-white' -> isActive ? 'text-[#FF3C78]'
  content = content.replace(/isActive\s*\?\s*['"`]text-\[#0A0A0A\]['"`]/g, "isActive ? 'text-[#FF3C78]'");
  
  // AdminSidebar active button text
  content = content.replace(/isActive \? 'text-\[#FF3C78\]' : 'text-\[#8B949E\]/g, "isActive ? 'text-[#FF3C78]' : 'text-[#555555]'");

  // Fix App.jsx toast
  content = content.replace(/background: '#161B22'/g, "background: '#FFFFFF'");
  content = content.replace(/color: '#E6EDF3'/g, "color: '#0A0A0A'");
  content = content.replace(/border: '1px solid #30363D'/g, "border: '1px solid #E5E7EB'");

  // AdminNavbar profile icon text color
  // text-[#0A0A0A]" style={{ background: 'linear-gradient...
  // The regex above for linear-gradient might catch it.

  // StatsCard number color
  // <p className="font-mono text-[28px] text-[#0A0A0A] font-bold leading-tight">
  // It's correct to be dark now.

  fs.writeFileSync(file, content);
});

console.log('Theme conversion completed!');
