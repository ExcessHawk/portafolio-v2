# Portafolio con playground

Sitio personal de Alfredo Mejía Rosales. Lo que lo separa de un portafolio normal es la
sección **Playground**: el visitante usa la aplicación completa dentro de la página y, abajo,
ve las peticiones reales que esa aplicación le hace a la API.

Astro 5 + Tailwind 4. Dos islas de React (`src/islands/`) y el resto HTML estático.

```bash
bun install
bun run dev      # http://localhost:4330
bun run build    # astro check + build
```

## Cómo está armado

| Carpeta | Qué hay |
|---|---|
| `src/data/` | El contenido: proyectos, experiencia, stack. Editas aquí, no en el markup. |
| `src/components/` | Piezas de Astro, sin JavaScript en el navegador. |
| `src/islands/` | Las dos piezas que sí necesitan React: el marco de demostración y la consola de API. |
| `src/styles/global.css` | Los tokens de color y tipografía. Todo sale de aquí. |

## Las dos piezas del playground

**`DemoFrame.tsx`** mete el marketplace en un iframe. El selector de rol cambia el `src` a
`/demo?rol=comprador|vendedor|admin`; esa ruta del marketplace pide una sesión y aterriza al
visitante en la pantalla que le toca. No hay registro ni contraseña de por medio.

**`ApiConsole.tsx`** dispara nueve peticiones reales contra la misma API, encadenadas: lo que
devuelve la búsqueda alimenta la ficha, y la sesión que entrega el paso 5 firma los pasos
siguientes. Tres de las nueve fallan a propósito, porque el tipo de falla es lo interesante:

| Paso | Respuesta | Qué enseña |
|---|---|---|
| Carrito sin sesión | 401 | El guard corta antes de tocar la base. |
| Panel de vendedor con sesión de comprador | 403 | El rol no alcanza; corta en la puerta. |
| Pedido de otra persona | 404 | Hay recurso de por medio, y no se delata que existe. |

Si la API no responde, la consola lo dice. Nunca inventa una respuesta.

## Variables de entorno

```bash
PUBLIC_DEMO_API=http://localhost:3102   # API del marketplace
PUBLIC_DEMO_WEB=http://localhost:5102   # frontend del marketplace
```

En producción apuntan al servidor donde viva la demostración. Son públicas por definición:
acaban en el JavaScript que llega al navegador, así que ahí no va nada secreto.

## Levantar la demostración en local

El playground necesita el marketplace corriendo. Desde `proyectos/02-marketplace`:

```bash
docker start marketplace_postgres marketplace_redis
cd backend  && bun run dev        # :3102, con DEMO_MODE=true en .env
cd frontend && bun run dev        # :5102
cd backend  && bun run demo:seed  # crea el mundo de demostración
```

El `.env` del backend tiene que traer `http://localhost:4330` en `CORS_ORIGINS`, o la consola
de API choca con CORS.

## Poner esto en un servidor

Tres piezas: el portafolio (estático), el frontend del marketplace (estático) y la API (Bun).

**1. El portafolio es estático.** `bun run build` deja `dist/`. Cualquier servidor sirve eso.

**2. El frontend del marketplace tiene que dejarse embeber.** Por omisión nadie puede meterlo
en un iframe. En nginx:

```nginx
server {
  server_name demo.tu-dominio.mx;
  root /var/www/marketplace;

  # Solo el portafolio puede embeberlo. Sin esto, el iframe sale en blanco.
  add_header Content-Security-Policy "frame-ancestors https://tu-dominio.mx" always;
  add_header X-Content-Type-Options nosniff always;

  location / { try_files $uri /index.html; }
}
```

`X-Frame-Options` no sirve aquí: su variante `allow-from` está muerta en los navegadores
modernos. `frame-ancestors` es la que mandan.

**3. La API necesita tres cosas en su `.env`:**

```bash
DEMO_MODE=true
CORS_ORIGINS=https://tu-dominio.mx,https://demo.tu-dominio.mx
DATABASE_URL=...   # una base dedicada a la demostración, nunca una con datos reales
```

**4. El reinicio por hora.** La página promete que los datos se reinician solos. Un cron:

```cron
0 * * * * cd /srv/marketplace/backend && DEMO_MODE=true bun run demo:refresh >> /var/log/demo.log 2>&1
```

`demo:refresh` borra lo que hicieron los visitantes y vuelve a sembrar el pedido de ejemplo.
Solo toca filas de cuentas `@demo.marketplace.mx`, y se niega a correr si `DEMO_MODE` no está
encendido.

## Lo que hay que tener claro antes de publicar la demostración

`POST /api/demo/session` **entrega una sesión sin contraseña**. Es un bypass de autenticación
puesto a propósito, con cuatro candados:

1. Solo existe si `DEMO_MODE=true`; el controlador ni siquiera se registra si está apagado.
2. El correo tiene que terminar en `@demo.marketplace.mx`.
3. La cuenta tiene que traer `is_demo = true` en la base.
4. `AuthService` repite las comprobaciones 1 y 2 por su cuenta, en otro archivo.

Aun así: **esa base nunca debe tener datos de personas reales.** La cuenta de administrador de
la demostración es administrador de verdad dentro de esa base.

## Pendientes

- Las ilustraciones de los productos son SVG dibujados a mano en `frontend/public/demo/`,
  porque la subida de imágenes todavía no existe.
- El playground solo cubre el marketplace. Los otros proyectos se enseñan con ficha, no con
  demostración.
