const https = require('https');

const CDN_URLS = [
  'https://jsdelivr.b-cdn.net',
  'https://cdn.jsdmirror.com',
  'https://cdn.iocdn.cc',
  'https://jsd.cdn.zzko.cnt',
  'https://cdn.statically.io',
];

function checkCDN(cdnUrl) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const testUrl = `${cdnUrl}/npm/jquery@3.6.0/dist/jquery.min.js`;

    https.get(testUrl, (res) => {
      res.resume();
      const endTime = Date.now();
      resolve({ url: cdnUrl, responseTime: endTime - startTime });
    }).on('error', () => {
      resolve({ url: cdnUrl, responseTime: Infinity });
    }).setTimeout(5000, () => {
      resolve({ url: cdnUrl, responseTime: Infinity });
    });
  });
}

async function findFastestCDN() {
  const results = await Promise.all(CDN_URLS.map(checkCDN));
  return results.reduce((fastest, current) =>
    current.responseTime < fastest.responseTime ? current : fastest
  ).url;
}

module.exports = async (req, res) => {
  const fullUrl = `https://${req.headers.host}${req.url}`;
  const url = new URL(fullUrl);

  try {
    const fastestCDN = await findFastestCDN();

    const redirectURL = `${fastestCDN}${url.pathname}${url.search}`;

    res.statusCode = 302;
    res.setHeader('Location', redirectURL);
    res.end();
  } catch (error) {
    console.error('Error finding fastest CDN:', error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Error finding a working CDN');
  }
};
