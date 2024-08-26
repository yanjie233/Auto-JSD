const https = require('https');

// CDN 列表，您可以在这里手动更新
const CDN_URLS = [
  'https://cdn.jsdelivr.net',
  'https://fastly.jsdelivr.net',
  'https://gcore.jsdelivr.net',
  // 可以添加更多 CDN
];

function checkCDN(cdnUrl) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const testUrl = `${cdnUrl}/npm/jquery@3.6.0/dist/jquery.min.js`;
    
    https.get(testUrl, (res) => {
      res.resume(); // 消耗响应数据以释放内存
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
      const originalPath = pathname.slice(4); // 移除 '/jsd' 前缀
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