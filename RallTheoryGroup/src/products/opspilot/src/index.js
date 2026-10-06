const http = require('node:http');

function createServer() {
  return http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      app: 'OpsPilot',
      status: 'running',
      version: '1.0.0'
    }));
  });
}

if (require.main === module) {
  const port = Number(process.env.PORT || 3000);
  createServer().listen(port, () => {
    console.log(`OpsPilot listening on port ${port}`);
  });
}

module.exports = { createServer };
