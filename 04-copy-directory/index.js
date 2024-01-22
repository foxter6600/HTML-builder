const path = require('path');
const fsPromises = require('fs/promises');

const pathToFolder = path.join(__dirname, '/files');
const pathToCopy = path.join(__dirname, '/files-copy');

async function createFolder() {
  await fsPromises.mkdir(pathToCopy, { recursive: true });
}

async function scanFolder() {
  return await fsPromises.readdir(pathToFolder);
}

async function unlinkFiles() {
  for (file of await fsPromises.readdir(pathToCopy)) {
    const pathToFile = await path.join(pathToCopy, file);
    await fsPromises.unlink(pathToFile);
  }
}

async function copyFile(file) {
  const pathToFile = path.join(pathToFolder, file);
  const pathToFileCopy = path.join(pathToCopy, file);
  await fsPromises.copyFile(pathToFile, pathToFileCopy);
}

async function copyDirectory() {
  try {
    await createFolder();
    const files = await scanFolder();
    await unlinkFiles();
    await Promise.all(files.map(copyFile));
    // const copyFiles = files.map(copyFile);
  } catch (err) {
    console.log(err.message);
  }
}

copyDirectory();
