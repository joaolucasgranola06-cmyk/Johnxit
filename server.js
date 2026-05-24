const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const port = process.env.PORT || 8080;
const host = '0.0.0.0';
const publicDir = path.resolve(__dirname);

// Estado simples em memória para demo (não persiste entre reinícios)
let activated = false;
function getLocalIPs() {
  const nets = os.networkInterfaces();
  const addresses = [];

  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        addresses.push(net.address);
      }
    }
  }

  return addresses;
}

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.html': return 'text/html; charset=utf-8';
    case '.js': return 'application/javascript; charset=utf-8';
    case '.css': return 'text/css; charset=utf-8';
    case '.json': return 'application/json; charset=utf-8';
    case '.png': return 'image/png';
    case '.jpg':
    case '.jpeg': return 'image/jpeg';
    default: return 'text/plain; charset=utf-8';
  }
}

function createServer() {
  return http.createServer((req, res) => {
    // API endpoints for demo control
    if (req.url === '/activate' && req.method === 'POST') {
      activated = true;
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ ok: true, activated }));
      return;
    }

    if (req.url === '/deactivate' && req.method === 'POST') {
      activated = false;
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ ok: true, activated }));
      return;
    }

    if (req.url === '/state' && req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ activated }));
      return;
    }

    if (req.url === '/ips') {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ ips: getLocalIPs() }));
      return;
    }
    const requestedPath = req.url === '/' ? '/index.html' : req.url;
    const safePath = path.normalize(requestedPath).replace(/^\.+/, '');
    const filePath = path.join(publicDir, safePath);

    if (!filePath.startsWith(publicDir)) {
      res.writeHead(403);
      res.end('Acesso proibido');
      return;
    }

    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
        res.writeHead(404);
        res.end('Arquivo não encontrado');
        return;
      }

      res.writeHead(200, { 'Content-Type': getContentType(filePath) });
      fs.createReadStream(filePath).pipe(res);
    });
  });
}

const preferredPort = parseInt(process.env.PORT, 10) || port;
const maxPort = preferredPort + 10;

function startServer(portToTry) {
  const server = createServer();

  server.on('error', err => {
    if (err.code === 'EADDRINUSE' && portToTry < maxPort) {
      console.warn(`Porta ${portToTry} em uso. Tentando porta ${portToTry + 1}...`);
      startServer(portToTry + 1);
      return;
    }

    console.error('Erro ao iniciar o servidor:', err.message);
    process.exit(1);
  });

  server.listen(portToTry, host, () => {
    const ips = getLocalIPs();
    console.log(`Servidor iniciado em http://${host}:${portToTry}`);
    console.log('Acesse pelo navegador local: http://localhost:' + portToTry);

    if (ips.length > 0) {
      console.log('Acesse pela rede local usando o IP do dispositivo:');
      ips.forEach(ip => console.log(`  http://${ip}:${portToTry}`));
    } else {
      console.log('Nenhum IP de rede local encontrado.');
    }
  });
}

startServer(preferredPort);
