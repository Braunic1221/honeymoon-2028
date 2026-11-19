import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname } from 'node:path';

const root = new URL('../', import.meta.url);
const mime = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.webp':'image/webp', '.woff2':'font/woff2' };
const base = '/honeymoon-2028/';
createServer(async (request,response) => {
  const path = new URL(request.url, 'http://127.0.0.1').pathname;
  const file = (path.startsWith(base) ? path.slice(base.length) : path.slice(1)) || 'index.html';
  if (!/^(?:media\/)?[\w.-]+$/.test(file) || !mime[extname(file)]) {
    response.writeHead(404).end();
    return;
  }
  try {
    const bytes = await readFile(new URL(file,root));
    response.writeHead(200,{'Content-Type':mime[extname(file)]}).end(bytes);
  } catch {
    response.writeHead(404).end();
  }
}).listen(4173,'127.0.0.1', () => console.log('http://127.0.0.1:4173/honeymoon-2028/'));
