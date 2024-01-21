const path = require('path');
const fs = require('fs');

const pathToFile = path.join(__dirname, 'text.txt');

const input = fs.createReadStream(pathToFile, 'utf-8');

let data = '';
input.on('data', (chunk) => (data += chunk));
input.on('end', () => console.log(data));
input.on('error', (err) => console.log('Error', err.message));
