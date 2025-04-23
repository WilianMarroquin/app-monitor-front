# 🚀 Proyecto Nuxt 3 — Sysbase

Bienvenido a **Sysbase**, una aplicación base moderna desarrollada con Nuxt 3.
Diseñada como punto de partida para nuevos proyectos web, Sysbase ofrece una arquitectura limpia, escalable y eficiente, ideal para acelerar el desarrollo con las mejores prácticas del ecosistema Vue.
---

> ⚠️ **Importante:** Este proyecto frontend **debe ejecutarse en el mismo dominio** que el backend para garantizar el correcto manejo de cookies y sesiones.

---

## ⚡ Requisitos

Asegurate de tener instalado lo siguiente:

- Node.js >= 18
- pnpm >= 8

Para instalar pnpm globalmente:

```bash
npm install -g pnpm
```


---

## 📥 Clonar el repositorio

Cloná el proyecto desde GitHub y accedé al directorio del proyecto:

```bash
git clone https://github.com/WilianMarroquin/sysbase-nuxt-3.git
cd sysbase-nuxt-3
```

---

## 📦 Instalar dependencias

Instalá todas las dependencias necesarias:

```bash
pnpm install
```

---

## ⚙️ Configurar variables de entorno

Este proyecto requiere un archivo `.env`.  
Copiá el archivo de ejemplo y completá los valores:

```bash
cp .env.example .env
```

# .env (Ejemplo)
```bash
NUXT_PUBLIC_API_BASE_URL=https://api.tuDominio.com
```

⚠️ No subas este archivo al repositorio. Es solo para uso local.

---

## 🚀 Ejecutar el proyecto

Iniciá el servidor de desarrollo:

```bash
pnpm dev --host = TuDominio
```

La aplicación estará disponible en:

http://TuDominio:3000

---

## 🧠 Estructura del proyecto

📦 sysbase/
┣ 📁 assets/           → Archivos estáticos como imágenes o estilos  
┣ 📁 components/       → Componentes Vue reutilizables  
┣ 📁 composables/      → Funciones personalizadas (hooks)  
┣ 📁 layouts/          → Estructuras de layout para las páginas  
┣ 📁 middleware/       → Middleware personalizado  
┣ 📁 pages/            → Rutas automáticas basadas en archivos  
┣ 📁 plugins/          → Plugins para ampliar funcionalidades  
┣ 📁 public/           → Archivos públicos accesibles desde el navegador  
┣ 📁 stores/           → Stores de Pinia (gestión de estado)  
┣ 📄 nuxt.config.ts    → Configuración principal del proyecto  
┣ 📄 .env              → Variables de entorno  
┗ 📄 README.md         → Este archivo

---


## ✨ Autor

Desarrollado con 💚 por (https://github.com/WilianMarroquin)

---

Este código es propiedad privada. No se permite su distribución, copia ni uso sin autorización expresa del propietario.

