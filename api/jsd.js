const https = require('https');

const CDN_URLS = [
  'https://cdn.jsdelivr.net',
  'https://cdn.statically.io',
  'https://jsd.cdn.zzko.cnt',
  'https://cdn.statically.io',
  'https://vercel.jsd.nmmsl.top',
  'https://jsd.yanjie233.top',
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
  const { pathname } = new URL(req.url, `http://${req.headers.host}`);

  if (pathname.startsWith('/jsd/')) {
    try {
      const fastestCDN = await findFastestCDN();
      // 将 '/jsd' 替换为 '/gh'，而不是简单地删除
      const originalPath = pathname.replace('/jsd', '/gh');

      const redirectURL = `${fastestCDN}${originalPath}`;

      res.statusCode = 302;
      res.setHeader('Location', redirectURL);
      res.end();
    } catch (error) {
      console.error('Error finding fastest CDN:', error);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Error finding a working CDN');
    }
  } else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Not Found');
  }
};
