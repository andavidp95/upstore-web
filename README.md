# ELECTRO iP - Frontend Web ⚡

Sitio web oficial, catálogos y Landing Pages de ELECTRO iP Ecuador.
Construido con Astro 🚀 y Tailwind CSS.

## 🏗️ Arquitectura Actual (Migración 2026)
- **JAMstack Puro:** Anteriormente este proyecto consumía una API en Render con PostgreSQL. Actualmente, toda la base de datos de productos y servicios se ha migrado a **Content Collections (Markdown)** locales para garantizar latencia cero, máxima seguridad y costos de servidor nulos.
- **El Backend Original** se mantiene respaldado en GitHub pero suspendido en la nube, ya que la arquitectura actual no requiere renderizado del lado del servidor (SSR) ni llamadas a base de datos externa.
- **Preparado para Subdominios:** El proyecto está modularizado para separar "UPStore", "Servicios IT", "Power" y "Tech" en subdominios independientes a futuro mediante configuración de Vercel.