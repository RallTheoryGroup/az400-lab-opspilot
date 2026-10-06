const http = require('node:http');
const { createServer } = require('./index');

let server;
beforeAll((done) => {
  server = createServer();
  server.listen(0, '127.0.0.1', done);
});
afterAll((done) => {
  server.close(done);
});

test('server returns the OpsPilot health contract', async () => {
  const response = await new Promise((resolve, reject) => {
    const req = http.get({
      hostname: '127.0.0.1',
      port: server.address().port,
      path: '/'
    }, (res) => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => { body += chunk; });
      res.on('error', reject);
      res.on('end', () => resolve({
        status: res.statusCode,
        type: res.headers['content-type'],
        body
      }));
    });
    req.setTimeout(2000, () => req.destroy(new Error('Request timed out')));
    req.on('error', reject);
  });
  expect(response.status).toBe(200);
  expect(response.type).toContain('application/json');
  expect(JSON.parse(response.body)).toEqual({
    app: 'OpsPilotX', status: 'running', version: '1.0.0'
  });
});
