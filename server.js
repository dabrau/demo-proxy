var http = require('http'),
    httpProxy = require('http-proxy');
    url = require("url");


var proxy = httpProxy.createProxyServer({secure: false});

const allowedOrigins = ['localhost'];

proxy.on('proxyRes', (proxyRes, req, res) => {
  let allowedOrigin = false;
  if (req.headers.origin) {
    const originHostName = url.parse(req.headers.origin).hostname;
    if (originHostName && allowedOrigins.some(o => o === originHostName)) {
      res.setHeader('access-control-allow-origin', req.headers.origin);
      res.setHeader('access-control-allow-credentials', 'true');
      allowedOrigin = true;
    }
  }

  if (req.headers['access-control-request-method']) {
    res.setHeader('access-control-allow-methods', req.headers['access-control-request-method']);
  }

  if (req.headers['access-control-request-headers']) {
    res.setHeader('access-control-allow-headers', req.headers['access-control-request-headers']);
  }

  if (allowedOrigin) {
    res.setHeader('access-control-max-age', 60 * 60 * 24 * 30);
    if (req.method === 'OPTIONS') {
      //res.send(200);
      res.end();
    }
  }
});


var server = http.createServer(function(req, res) {
  proxy.web(req, res, { target: 'https://magma.ucsf.edu' });
});

console.log("listening on port 5050")
server.listen(5050);