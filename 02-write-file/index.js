const path = require('path');
const fs = require('fs');
const readline = require('readline');
const { stdin, stdout } = process;

const pathToFile = path.join(__dirname, 'text.txt');
const writeToFile = fs.createWriteStream(pathToFile);

const rl = readline.createInterface({
  input: stdin,
  output: stdout,
});

function exit() {
  writeToFile.end();
  rl.close();
}

rl.output.write('Приветствую! Введите данные для сохранения в файл text.txt: ');
rl.on('line', (data) => {
  try {
    if (data === 'exit') {
      exit();
      rl.output.write('Данные сохранены в файл text.txt.');
    } else {
      writeToFile.write(data + ' ');
    }
  } catch (err) {
    exit();
    console.log(err.message);
  }
});
rl.on('SIGINT', () => {
  exit();
  rl.output.write('Данные сохранены в файл text.txt.');
});
