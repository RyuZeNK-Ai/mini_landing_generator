const fs = require("fs");
const path = require("path");

// Leer contenido
const data = JSON.parse(fs.readFileSync("content.json", "utf8"));

// Crear carpeta docs si no existe
if (!fs.existsSync("docs")) fs.mkdirSync("docs");

// === GENERAR HTML ===
let template = fs.readFileSync("index.html", "utf8");

// Reemplazar placeholders básicos
let htmlOutput = template
  .replace(/{{TITLE}}/g, data.title)
  .replace(/{{DESCRIPTION}}/g, data.description)
  .replace(/{{CTA}}/g, data.cta)
  .replace(/{{SOCIALS}}/g, data.socials)
  .replace(/{{LOGO_ALT}}/g, data.logoAlt || "Logo")
  .replace(/{{POPUP_MESSAGE}}/g, data.popupMessage || "¡Solicitud enviada! Te avisaremos pronto.")
  .replace(/{{ERROR_MESSAGE}}/g, data.errorMessage || "Ingresa un correo válido: gmail.com, hotmail.com o yahoo.com");

// Reemplazar validDomains en el script (si existe en content.json)
if (data.validDomains) {
  htmlOutput = htmlOutput.replace(/const validDomains = \[.*?\];/, `const validDomains = ${data.validDomains};`);
}

fs.writeFileSync("docs/index.html", htmlOutput);

// === GENERAR CSS ===
let cssTemplate = fs.readFileSync("style.css", "utf8");
let cssOutput = cssTemplate
  .replace(/{{BUTTON_COLOR}}/g, data.buttonColor)
  .replace(/{{BUTTON_HOVER}}/g, data.buttonHover)
  .replace(/{{TEXT_COLOR}}/g, data.textColor)
  .replace(/{{BG_IMAGE}}/g, data.bgImage || "tattoo-bg.png");

// Si tienes gradiente personalizado en content.json
if (data.background) {
  cssOutput = cssOutput.replace(/radial-gradient\([^)]+\)/g, data.background);
}

fs.writeFileSync("docs/style.css", cssOutput);

// === COPIAR ARCHIVOS ESTÁTICOS ===
const staticFiles = [
  "responsive.css",
  "logo.png",
  "tattoo-bg.png"
];

staticFiles.forEach(file => {
  if (fs.existsSync(file)) {
    fs.copyFileSync(file, path.join("docs", file));
    console.log(`📁 Copiado: ${file}`);
  } else {
    console.log(`⚠️ No encontrado: ${file}`);
  }
});

console.log("✅ Landing generada en /docs/");