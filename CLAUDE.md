# Backoffice Frontend — Ecommerce GMI2

> Este `CLAUDE.md` **extiende** las reglas compartidas en `../CLAUDE.md` (raíz del workspace)
> y `../docs/FRONTEND-CONVENTIONS.md` + `../docs/API-CONTRACT.md`. Leer primero la raíz.
> Acá sólo van overrides y cosas específicas del backoffice.

---

## Rol del frontend

Panel de administración para **staff** del ecommerce. Consume endpoints `/staff/auth/*` y
`/admin/*` del back. Tres niveles de rol — ver tabla en `../docs/API-CONTRACT.md`.

**Usuarios**: super_admin, admin, user.

---

## Convención: copy en español neutro

**TODO el copy visible al usuario** va en **español neutro** (forma "tú"),
NO en voseo rioplatense. Aplica a:

- Labels de UI, títulos, descripciones, placeholders, hints
- Toast messages (sonner)
- Error messages y validaciones
- ARIA labels y title attributes
- También comentarios de código y JSDoc (para consistencia)

**Por qué**: el negocio puede vender en cualquier país hispanohablante.
El voseo se entiende solo en Río de la Plata + algunas regiones. El
neutro funciona en LATAM + España.

### Patrones a EVITAR / equivalentes

| Voseo (NO usar) | Neutro (usar) |
|---|---|
| tenés, tené | tienes, ten |
| ingresá, agregá, contá | ingresa, agrega, cuenta |
| iniciá, usá, andá | inicia, usa, ve |
| podés, dudás | puedes, dudas |
| cerrá, abrí | cierra, abre |
| confirmá, seleccioná | confirma, selecciona |
| intentá, revisá, probá | intenta, revisa, prueba |
| mirá, decí, hacé | mira, di, haz |
| reintentá, terminá, seguí | reintenta, termina, sigue |
| fijate (sin tilde) | fíjate (con tilde) |
| vos (pronombre) | tú |

Si una nueva PR introduce voseo, **rechazar en review** y pedir cambio.

(Lista completa de reemplazos en el commit `chore(i18n): neutralize Spanish copy` cuando se hizo el sweep inicial.)

---

## Scope MVP

- Login / logout (staff auth con refresh rotation)
- Dashboard con métricas clave (ventas, pedidos, stock)
- CRUD de productos (nombre, precio centavos PEN, stock, imágenes via Cloudinary, categorías)
- Gestión de pedidos (listado, detalle, cambio de estado, registrar shipment)
- Gestión de staff (invitar, listar, cambiar rol — solo super_admin/admin)
- Gestión de clientes (read-only inicialmente)
- Categorías, banners, cupones (CRUD)
- Reviews (aprobación)
- Configuración básica de tienda

**Fuera del MVP** (fase 2+): reportes avanzados, notifs push, integraciones logística.

**Fuera de scope siempre**: el POS va en repo separado (`pos-frontend/`, offline-first).

---

## Comandos del proyecto

```bash
pnpm dev               # Vite dev server con HMR
pnpm build             # tsc -b && vite build (producción)
pnpm preview           # Preview del build
pnpm test              # Vitest watch
pnpm test:ci           # Vitest run (CI)
pnpm test:e2e          # Playwright
pnpm lint              # ESLint
pnpm lint:fix          # ESLint --fix
pnpm format            # Prettier --write
pnpm typecheck         # tsc --noEmit
```

---

## Scopes de Conventional Commits (específicos del backoffice)

`auth`, `dashboard`, `products`, `categories`, `orders`, `customers`, `staff`, `banners`,
`coupons`, `reviews`, `shipping`, `uploads`, `settings`, `ui`, `layout`, `router`, `api`.

Ejemplos:
- `feat(products): add product creation form with image upload`
- `fix(orders): correct status filter not resetting on page change`

---

## Layout & navegación

- `RootLayout` en `src/layouts/` — sidebar permanente + header
- Rutas autenticadas bajo route group `_auth` (guard verifica JWT staff)
- Login/logout fuera del `_auth` group

---

## Diseño visual

Mockups y theme inicial en `.claude/ui-design/` (gitignored — local only).
**Solo para referencia visual.** La lógica interna se moldea con TanStack + las libs definidas
en la raíz, no se copia el código del mockup tal cual.

---

## Integraciones externas específicas del backoffice

- **Cloudinary** (imágenes de productos): el back devuelve un upload signature, el front sube
  directo desde el navegador. Ver `../docs/backend-mirror/modules/uploads.md`.

---

## Backend API reference

**No hay un `backend-api.md` mantenido a mano.** La fuente de verdad son los docs del back en:

- `../docs/backend-mirror/` (espejo refrescable)
- `../backend/docs/modules/` (siempre lo más fresco — `git pull` + skill `sync-backend-docs`)

Antes de implementar un endpoint nuevo: refrescar el mirror y leer `modules/<mod>.md`.

---

## Override del estilo de código

Hereda todo de `../CLAUDE.md` y `../docs/FRONTEND-CONVENTIONS.md`. Sin overrides al día de hoy.
