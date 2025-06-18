# 🎨 Configuración de Frontend

## 📝 Introducción

Para el frontend al principio se usó CSS puro, pero para facilitar el desarrollo he decidido usar Tailwind CSS, aprovechando para inicializar el código Node. Es probable que en poco tiempo deba usar D3.js, así que ya tenemos todo listo para entonces.

## 🚀 Instalación del Entorno

### Node Version Manager (NVM)

Instalo NVM (Node Version Manager) con:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```

### Node.js y NPM

Luego instalo Node LTS con:

```bash
nvm install --lts
```

Ya tenemos Node y NPM instalados, y gracias a NVM podemos gestionar fácilmente las versiones.

## 🛠️ Configuración de Tailwind CSS

### Inicialización del proyecto

Iniciamos con:

```bash
npm init -y
```

### Instalación de Tailwind

Instalamos Tailwind siguiendo la documentación oficial:

```bash
npm install tailwindcss @tailwindcss/cli
```

### Configuración básica

Configuramos Tailwind escribiendo en un archivo `input.css`:

```css
@import "tailwindcss";
```

### Compilación y watch mode

Luego compilamos y monitorizamos cambios con:

```bash
npx @tailwindcss/cli -i ./static/input.css -o ./static/output.css --watch
```

## ✅ Resultado

¡Listo! Tenemos Tailwind funcionando correctamente.