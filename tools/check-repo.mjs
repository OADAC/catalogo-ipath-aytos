import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('..', import.meta.url));
const required = ['index.html','styles.css','app.js','release-config.js','release-assets.js','security.css','security-client.js','robots.txt','.nojekyll','404.html','SECURITY.md','DEPLOYMENT.md','release-assets-manifest.json','release-check.html'];
const missing = required.filter((file) => !fs.existsSync(path.join(root, file)));
if (missing.length) { console.error('Faltan archivos obligatorios:\n' + missing.map((file) => ` - ${file}`).join('\n')); process.exit(1); }
const forbidden = ['access-config.js','login.html','login.css','login.js'];
const presentForbidden = forbidden.filter((file) => fs.existsSync(path.join(root, file)));
if (presentForbidden.length) { console.error('Todavía existen archivos de autenticación:\n' + presentForbidden.map((file) => ` - ${file}`).join('\n')); process.exit(1); }
const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
if (/login\.html|access-config\.js|access-locked|IPATH_ACCESS/.test(index)) { console.error('index.html todavía contiene referencias de autenticación.'); process.exit(1); }
const releaseConfig = fs.readFileSync(path.join(root, 'release-config.js'), 'utf8');
if (!/tag:\s*'catalogoipath'/.test(releaseConfig)) { console.error('release-config.js no utiliza el tag catalogoipath.'); process.exit(1); }
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'release-assets-manifest.json'), 'utf8'));
const unique = new Set(manifest.assets);
if (unique.size !== manifest.assets.length) { console.error('El manifiesto del Release contiene nombres duplicados.'); process.exit(1); }
if (manifest.assets.length !== 51) { console.error(`Se esperaban 51 assets y hay ${manifest.assets.length}.`); process.exit(1); }
for (const file of ['app.js','release-assets.js','release-config.js','security-client.js']) { const source = fs.readFileSync(path.join(root, file), 'utf8'); if (!source.trim()) { console.error(`${file} está vacío.`); process.exit(1); } }
console.log('Comprobación del repositorio público GitHub Pages + Release: correcta.');
