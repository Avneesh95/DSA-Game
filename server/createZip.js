const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const outZip = path.join(rootDir, 'dsa-100-doors-project.zip');

if (fs.existsSync(outZip)) {
  fs.unlinkSync(outZip);
}

// Use powershell Compress-Archive targeting a clean staged folder
const tempStage = path.join(rootDir, '.zip_staging');
if (fs.existsSync(tempStage)) {
  fs.rmSync(tempStage, { recursive: true, force: true });
}
fs.mkdirSync(tempStage, { recursive: true });

const IGNORES = ['node_modules', '.git', '.jdk', 'dist', '.zip_staging', 'dsa-100-doors-project.zip', 'dsa-100-doors.zip'];

function copyRecursive(src, dst) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dst, { recursive: true });
    for (const child of fs.readdirSync(src)) {
      if (IGNORES.includes(child)) continue;
      copyRecursive(path.join(src, child), path.join(dst, child));
    }
  } else {
    fs.copyFileSync(src, dst);
  }
}

console.log('Staging files for compression...');
for (const item of fs.readdirSync(rootDir)) {
  if (IGNORES.includes(item)) continue;
  copyRecursive(path.join(rootDir, item), path.join(tempStage, item));
}

console.log('Compressing to zip archive...');
try {
  // PowerShell Compress-Archive
  const psCmd = `Compress-Archive -Path "${tempStage}\\*" -DestinationPath "${outZip}" -Force`;
  execSync(`powershell -NoProfile -Command "${psCmd}"`, { stdio: 'inherit' });
  console.log(`\n✅ Zip created successfully at:\n${outZip}`);
  const sizeMb = (fs.statSync(outZip).size / (1024 * 1024)).toFixed(2);
  console.log(`Size: ${sizeMb} MB`);
} finally {
  fs.rmSync(tempStage, { recursive: true, force: true });
}
