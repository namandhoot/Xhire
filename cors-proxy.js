// Simple CORS proxy server using cors-anywhere
const cors_proxy = require('cors-anywhere');

// Listen on a specific host and port
const host = 'localhost';
const port = 8080;

// Create server
cors_proxy.createServer({
  originWhitelist: [], // Allow all origins
  requireHeader: ['origin', 'x-requested-with'],
  removeHeaders: [
    'cookie',
    'cookie2',
    // Strip "x-cors-headers" header from the request
    // to avoid leaking information
    'x-cors-headers'
  ],
  redirectSameOrigin: true,
  httpProxyOptions: {
    // Do not add X-Forwarded-For, etc. headers, because they
    // can give away that the request is proxied
    xfwd: false,
  },
}).listen(port, host, function() {
  console.log('CORS Anywhere proxy server running at http://' + host + ':' + port);
  console.log('To use this for Twitter API calls:');
  console.log('1. Keep this terminal window running');
  console.log('2. Access Twitter API through http://localhost:8080/https://api.twitter.com/2/...');
  console.log('3. Make sure to include the Authorization header with your Bearer token');
}); 