import fs, { fdatasync } from "fs";
import mkdirp from "mkdirp";
import readline from "readline";

const ifc = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const creatFile = async (path, fileName, content) => {
  let location;
  if (path) {
    await mkdirp(path);
    location = `${path}/${fileName}`;
  } else location = fileName;

  fs.writeFile(location, content, (err) => {
    if (err) throw err;

    console.log(`${location} created!`);
  });
};

const addViteConfig = async (content) => {
  fs.readFile("./vite.config.js", async (err, data) => {
    if (err) throw err;
    let fileContent = data.toString();
    const token = "// DON'T REMOVE THIS COMMENT! IT IS USED BY newpage SCRIPT";

    fileContent = fileContent.replace(
      token,
      `${content}
        ${token}`
    );

    fs.writeFile("vite.config.js", fileContent, (err) => {
      if (err) throw err;
      console.log("vite.config.js updated!");
    });
  });
};

ifc.question("Page Name: ", async (pageName) => {
  const pageHTML = `
  <!DOCTYPE html>
  <html lang="en" data-theme="emerald">
    <head>
      <meta charset="UTF-8" />
      <link rel="icon" type="icon" href="/fav.ico" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${pageName}</title>
    </head>
    <body class="${pageName}">
  
      <script defer type="module" src="./script.js"></script>
    </body>
  </html>
  `;
  const scriptJS = `import "@styles/${pageName}/${pageName}.scss";
  import Alpine from "alpinejs";

  window.Alpine = Alpine;

  Alpine.start();
`;
  const sassContent = `
  @import "@styles/baseConfig";
  @import "@styles/baseStyles";

  .${pageName} {}`;

  creatFile(pageName, "index.html", pageHTML);
  creatFile(pageName, "script.js", scriptJS);
  creatFile(`src/styles/${pageName}`, `${pageName}.scss`, sassContent);
  addViteConfig(`${pageName}: resolve(__DIR__, "${pageName}/index.html"),`);
  ifc.close();
});
