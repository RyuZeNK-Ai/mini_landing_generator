const fs = require("fs");

// Leer contenido
const data = JSON.parse(fs.readFileSync("content.json", "utf8"));

// Crear carpeta docs si no existe
if (!fs.existsSync("docs")) fs.mkdirSync("docs");

// Generar HTML
let template = fs.readFileSync("index.html", "utf8");
let htmlOutput = template
  .replace(/{{TITLE}}/g, data.title)
  .replace(/{{DESCRIPTION}}/g, data.description)
  .replace(/{{CTA}}/g, data.cta)
  .replace(/{{SOCIALS}}/g, data.socials)
  // Insertar script de popup
  .replace(
    /<\/body>/,
    `<script>
      const form = document.getElementById('waitlist-form');
      if(form){
        const emailInput = form.querySelector('input[type="email"]');

        // Crear popup
        let popup = document.getElementById('popup');
        if(!popup){
          popup = document.createElement('div');
          popup.id = 'popup';
          popup.textContent = 'Solicitud enviada';
          document.body.appendChild(popup);
        }

        form.addEventListener('submit', function(e){
          e.preventDefault();
          const email = emailInput.value.trim().toLowerCase();
          const validDomains = ['gmail.com', 'hotmail.com', 'yahoo.com'];
          const parts = email.split('@');

          if(parts.length !== 2 || !validDomains.includes(parts[1])){
            alert('Ingresa un correo válido: gmail.com, hotmail.com o yahoo.com');
            return;
          }

          // Mostrar popup
          popup.style.display = 'block';
          setTimeout(() => { popup.style.display = 'none'; }, 2000);

          // Limpiar input
          emailInput.value = '';
        });
      }
    </script></body>`
  );

fs.writeFileSync("docs/index.html", htmlOutput);

// Generar CSS
let cssTemplate = fs.readFileSync("style.css", "utf8");
let cssOutput = cssTemplate
  .replace(/{{BACKGROUND}}/g, data.background)
  .replace(/{{TEXT_COLOR}}/g, data.textColor)
  .replace(/{{BUTTON_COLOR}}/g, data.buttonColor)
  .replace(/{{BUTTON_HOVER}}/g, data.buttonHover);

fs.writeFileSync("docs/style.css", cssOutput);

console.log("Landing generada 🚀 con logo, fondo tatuaje y popup");