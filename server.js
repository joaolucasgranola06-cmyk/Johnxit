const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const port = process.env.PORT || 8080;
const host = '0.0.0.0';
const publicDir = path.resolve(__dirname);

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

const server = http.createServer((req, res) => {
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

server.listen(port, host, () => {
  const ips = getLocalIPs();
  console.log(`Servidor iniciado em http://${host}:${port}`);
  console.log('Acesse pelo navegador local: http://localhost:' + port);

  if (ips.length > 0) {
    console.log('Acesse pela rede local usando o IP do dispositivo:');
    ips.forEach(ip => console.log(`  http://${ip}:${port}`));
  } else {
    console.log('Nenhum IP de rede local encontrado.');
  }
});
