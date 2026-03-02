const { execSync } = require('child_process');

console.log('Building for Production...');
try {
  execSync('npm run build', { stdio: 'inherit' });
} catch (e) {
  console.error('Build failed', e);
  process.exit(1);
}

console.log('Deploying via Vercel CLI...');
try {
  // Use npx string to assure it installs/runs vercel
  execSync('npx vercel --prod --yes', { stdio: 'inherit' });
} catch (e) {
  console.error('Deploy failed', e);
  process.exit(1);
}
