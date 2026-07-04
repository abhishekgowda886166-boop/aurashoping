const https = require('https');
const fs = require('fs');

function getSVG(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function run() {
  console.log('Fetching SVGs...');
  const gpay = await getSVG('https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/googlepay.svg');
  const phonepe = await getSVG('https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/phonepe.svg');
  const paytm = await getSVG('https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/paytm.svg');

  const getPath = svg => {
    const match = svg.match(/<path d="([^"]+)"/);
    return match ? match[1] : '';
  };

  const content = `import React from 'react';

export const GPayIcon = ({ size = 24, color = 'currentColor', style = {} }) => (
  <svg role="img" viewBox="0 0 24 24" width={size} height={size} fill={color} style={style} xmlns="http://www.w3.org/2000/svg">
    <title>Google Pay</title>
    <path d="${getPath(gpay)}" />
  </svg>
);

export const PhonePeIcon = ({ size = 24, color = 'currentColor', style = {} }) => (
  <svg role="img" viewBox="0 0 24 24" width={size} height={size} fill={color} style={style} xmlns="http://www.w3.org/2000/svg">
    <title>PhonePe</title>
    <path d="${getPath(phonepe)}" />
  </svg>
);

export const PaytmIcon = ({ size = 24, color = 'currentColor', style = {} }) => (
  <svg role="img" viewBox="0 0 24 24" width={size} height={size} fill={color} style={style} xmlns="http://www.w3.org/2000/svg">
    <title>Paytm</title>
    <path d="${getPath(paytm)}" />
  </svg>
);
`;

  fs.writeFileSync('src/components/PaymentLogos.jsx', content, 'utf8');
  console.log('PaymentLogos.jsx generated successfully!');
}

run().catch(console.error);
