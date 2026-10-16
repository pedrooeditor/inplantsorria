import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
let html = await readFile(resolve(root, 'index.html'), 'utf8');
const styles = await readFile(resolve(root, 'styles.css'), 'utf8');
const config = await readFile(resolve(root, 'site.config.js'), 'utf8');
const app = await readFile(resolve(root, 'app.js'), 'utf8');
html = html.replace('<link rel="stylesheet" href="styles.css">', () => `<style>\n${styles}\n</style>`);
html = html.replace('<script defer src="site.config.js"></script>', '');
html = html.replace('<script defer src="app.js"></script>', '');
const mime = {webp:'image/webp',png:'image/png',svg:'image/svg+xml'};
for (const path of new Set([...html.matchAll(/(?:src|href)="(assets\/[^"]+)"/g)].map(match => match[1]))) {
  const data = (await readFile(resolve(root,path))).toString('base64');
  html = html.replaceAll(`"${path}"`, `"data:${mime[path.split('.').pop()]};base64,${data}"`);
}
html = html.replace('</body>', () => `<script>\n${config}\n${app}\n</script>\n</body>`);
const output = resolve(process.argv[2] || resolve(root, 'dist/implansorria-mais.html'));
await mkdir(dirname(output), {recursive:true});
await writeFile(output, html, 'utf8');
console.log(`HTML independente salvo: ${output}`);
