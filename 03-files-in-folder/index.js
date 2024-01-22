const path = require('path');
const { readdir, stat } = require('fs').promises;

const pathToFolder = path.join(__dirname, '/secret-folder');

readdir(pathToFolder)
  .then((files) => {
    files.forEach(async (file) => {
      const pathToFile = path.join(pathToFolder, file);
      const statFile = await stat(pathToFile);
      if (statFile.isFile()) {
        const dotLastIndex = file.lastIndexOf('.');

        console.log(
          `${file.slice(0, dotLastIndex)} - ${file.slice(
            dotLastIndex + 1,
          )} - ${`${(statFile.size / 1000).toFixed(3)}kb`}`,
        );
      }
    });
  })
  .catch((err) => console.log(err.message));
