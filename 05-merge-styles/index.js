const path = require('path');
const fsPromises = require('fs/promises');
const fs = require('fs');

const pathToStyles = path.join(__dirname, '/styles');
const pathToBundle = path.join(__dirname, '/project-dist', '/bundle.css');

async function readDirectory() {
  return await fsPromises.readdir(pathToStyles, { withFileTypes: true });
}

const writeToFile = fs.createWriteStream(pathToBundle.toString());

async function readAndCopy() {
  const styles = await readDirectory();
  for (const file of styles) {
    const fileName = file.name;
    const pathToFile = path.join(pathToStyles, fileName);
    const fileExtname = path.extname(pathToFile);
    if (file.isFile() && fileExtname === '.css') {
      const readStyles = fs.createReadStream(pathToFile);
      readStyles.on('data', (chunk) => {
        writeToFile.write(chunk);
      });
      readStyles.on('error', (err) => {
        console.log(err.message);
      });
      writeToFile.on('error', (err) => {
        console.log(err.message);
      });
    }
  }
}

async function run() {
  try {
    await readAndCopy();
    writeToFile.on('finish', () => {
      writeToFile.end();
    });
  } catch (err) {
    console.log(err.message);
  }
}
run();
