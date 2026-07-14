# UPStore - Frontend Web ⚡

Tienda online especializada en sistemas UPS y respaldo energético en Ecuador.
Construido con Astro y Tailwind CSS.

## Arquitectura
- **JAMstack Puro:** Productos y servicios en Content Collections (Markdown).
- **Hosting:** Cloudflare Pages con adaptador `@astrojs/cloudflare`.
- **CMS:** Decap CMS con backend GitHub.

## Estructura
- `src/content/equipos/` — Productos UPS (Markdown)
- `src/content/promos/` — Promociones del mes
- `src/content/servicios/` — Servicios especializados
- `src/content/baterias/` — Catálogo de baterías
- `src/content/accesorios/` — Accesorios para UPS
- `public/images/` — Imágenes del sitio
- `public/admin/` — Panel Decap CMS

## Decap CMS — OAuth Setup (Producción)

Para que `/admin/` funcione en producción (Cloudflare Pages), necesitas un **GitHub OAuth App**:

### 1. Crear GitHub OAuth App
1. Ve a **GitHub → Settings → Developer settings → OAuth Apps → New OAuth App**
2. **Application name:** `UPStore CMS`
3. **Homepage URL:** `https://upstore.com.ec`
4. **Authorization callback URL:** `https://upstore.com.ec/.netlify/identity/callback`
   - Si usas Cloudflare Pages sin Netlify: usa tu propio callback URL o un proxy como `https://decap-oauth.netlify.app/`
5. Guarda el **Client ID** y **Client Secret**

### 2. Configurar en Cloudflare Pages
En **Cloudflare Pages → Settings → Environment variables** agrega:
```
OAUTH_CLIENT_ID=tu_client_id
OAUTH_CLIENT_SECRET=tu_client_secret
```

### 3. Actualizar config.yml
Cambia `base_url` si usas un proxy OAuth:
```yaml
backend:
  name: github
  repo: upstore-ec/upstore-web
  branch: main
  base_url: "https://decap-oauth.netlify.app"  # o tu URL de proxy
```

### 4. Alternativa sin OAuth (desarrollo local)
Para desarrollo local, Decap CMS puede usar `npx decap-server` como proxy local:
```bash
npx decap-server
```
Esto levanta un servidor proxy en `http://localhost:8081` que evita necesitar OAuth.
