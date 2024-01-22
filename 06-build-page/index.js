const fs = require('fs/promises');
const path = require('path');

async function copyDirectory(source, destination) {
  const entries = await fs.readdir(source, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(source, entry.name);
    const destinationPath = path.join(destination, entry.name);

    if (entry.isDirectory()) {
      await fs.mkdir(destinationPath, { recursive: true });
      await copyDirectory(sourcePath, destinationPath);
    } else {
      await fs.copyFile(sourcePath, destinationPath);
    }
  }
}

async function buildPage() {
  const projectDistPath = path.join(__dirname, 'project-dist');
  await fs.mkdir(projectDistPath, { recursive: true });

  const templatePath = path.join(__dirname, 'template.html');
  let templateContent = await fs.readFile(templatePath, 'utf-8');

  const templateTags = templateContent.match(/{{\w+}}/g) || [];

  for (const tag of templateTags) {
    const componentName = tag.slice(2, -2);
    const componentPath = path.join(
      __dirname,
      'components',
      `${componentName}.html`,
    );

    try {
      const componentContent = await fs.readFile(componentPath, 'utf-8');
      templateContent = templateContent.replace(tag, componentContent);
    } catch (error) {
      console.error(`Error reading component file: ${componentPath}`);
    }
  }

  const indexHtmlPath = path.join(projectDistPath, 'index.html');
  await fs.writeFile(indexHtmlPath, templateContent);

  const stylesPath = path.join(__dirname, 'styles');
  const styleFiles = await fs.readdir(stylesPath);
  const styleContent = styleFiles
    .filter((file) => path.extname(file) === '.css')
    .map((file) => fs.readFile(path.join(stylesPath, file), 'utf-8'));

  const stylePath = path.join(projectDistPath, 'style.css');
  await fs.writeFile(stylePath, (await Promise.all(styleContent)).join('\n'));

  const assetsPath = path.join(__dirname, 'assets');
  const projectAssetsPath = path.join(projectDistPath, 'assets');
  await copyDirectory(assetsPath, projectAssetsPath);

  console.log('Page built successfully.');
}

buildPage().catch((error) => {
  console.error('Error building page:', error);
});
