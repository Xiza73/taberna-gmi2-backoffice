# Backoffice Frontend — Ecommerce

## Contexto del proyecto

Frontend del panel de administración (backoffice) para un proyecto grande de ecommerce.
Este repositorio cubre **exclusivamente** la interfaz de administración: gestión de productos,
pedidos, usuarios, inventario, reportes y configuración de la tienda. Se comunica con un
backend existente que ya implementa autenticación y expone una API REST.

## Usuarios y alcance (MVP)

**Usuarios objetivo:** Administradores y operadores internos del ecommerce.

**Features MVP:**

- Login / logout (consumiendo auth del backend)
- Dashboard con métricas clave (ventas, pedidos, stock)
- CRUD de productos (nombre, precio, stock, imágenes, categorías)
- Gestión de pedidos (listado, detalle, cambio de estado)
- Gestión de usuarios / roles
- Configuración básica de la tienda

**Fuera del MVP (fase 2+):** reportes avanzados, notificaciones push, gestión de cupones/descuentos, integraciones con logística.

## Stack y herramientas

| Capa            | Tecnología                          |
| --------------- | ----------------------------------- |
| Framework       | React 19                            |
| Lenguaje        | TypeScript (strict)                 |
| Bundler         | Vite                                |
| Testing unit    | Vitest                              |
| Testing E2E     | Playwright                          |
| Linter          | ESLint (flat config)                |
| Formatter       | Prettier                            |
| Estilos         | Tailwind CSS 4 + shadcn/ui (Radix primitives) |
| Animaciones     | Motion (framer-motion)              |
| State management| TanStack Query (server state) + React context (UI state) |
| HTTP client     | fetch nativo (via TanStack Query)   |
| Router          | TanStack Router                     |
| Formularios     | React Hook Form                     |
| Charts          | Recharts                            |
| Iconos          | Lucide React                        |
| Notificaciones  | Sonner (toasts)                     |

## Comandos clave

```bash
# Desarrollo
npm run dev          # Vite dev server con HMR

# Build
npm run build        # Build de producción (tsc + vite build)
npm run preview      # Preview del build local

# Testing
npm run test         # Vitest en modo watch
npm run test:ci      # Vitest run (CI, sin watch)
npm run test:e2e     # Playwright tests

# Calidad
npm run lint         # ESLint
npm run lint:fix     # ESLint --fix
npm run format       # Prettier --write
npm run format:check # Prettier --check
npm run typecheck    # tsc --noEmit
```

## Convenciones de código

### Commits — Conventional Commits

Formato: `tipo(scope): descripción corta`

Tipos permitidos: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `ci`, `build`.

Scopes sugeridos: `auth`, `products`, `orders`, `users`, `dashboard`, `config`, `ui`, `api`, `router`.

Ejemplos:
- `feat(products): add product creation form with image upload`
- `fix(orders): correct status filter not resetting on page change`
- `chore(deps): upgrade React to 19.1`

### Estilo de código

- Nombres de componentes: PascalCase (`ProductList.tsx`)
- Nombres de hooks: camelCase con prefijo `use` (`useProducts.ts`)
- Nombres de utilidades: camelCase (`formatCurrency.ts`)
- Tipos/interfaces: PascalCase, preferir `interface` sobre `type` para objetos
- Constantes globales: UPPER_SNAKE_CASE
- Archivos de test junto al archivo que testean: `Component.test.tsx`
- Un componente por archivo; exportar como `export default` solo el componente principal de la ruta
- Imports absolutos con alias `@/` apuntando a `src/`

### Estructura de componentes

```tsx
// 1. Imports
// 2. Types / interfaces
// 3. Constantes locales
// 4. Componente (function declaration, no arrow para componentes de ruta)
// 5. Hooks internos / funciones auxiliares (si las hay)
```

## Estructura del repositorio

```
backoffice-frontend/
├── public/                  # Assets estáticos
├── src/
│   ├── api/                 # Funciones de llamada al backend (endpoints)
│   ├── components/          # Componentes reutilizables (UI)
│   │   └── ui/              # Componentes base (Button, Input, Modal…)
│   ├── features/            # Módulos por dominio (products/, orders/, users/…)
│   │   └── [feature]/
│   │       ├── components/  # Componentes específicos del feature
│   │       ├── hooks/       # Hooks del feature
│   │       ├── types.ts     # Tipos del feature
│   │       └── index.ts     # Barrel export
│   ├── hooks/               # Hooks globales reutilizables
│   ├── layouts/             # Layouts de página (Sidebar, Header…)
│   ├── pages/               # Componentes de ruta (1 por ruta)
│   ├── router/              # Configuración de TanStack Router
│   ├── store/               # Estado global (context / zustand)
│   ├── styles/              # Estilos globales, tokens, theme
│   ├── types/               # Tipos compartidos / DTO del backend
│   ├── utils/               # Utilidades puras
│   ├── App.tsx
│   └── main.tsx
├── .claude/                 # Configuración de Claude Code
│   └── ui-design/           # Código de diseño inicial / mockups
├── CLAUDE.md                # ← este archivo
└── ...config files
```

## Integraciones externas

- **API REST del backend:** URL base configurable via `VITE_API_BASE_URL`. Auth por tokens (JWT) gestionada por el backend.
- Más integraciones se añadirán cuando se tenga documentación del backend.

## Reglas de trabajo con Claude

### Hacer

- Leer este archivo completo al inicio de cada sesión.
- Ejecutar `npm run typecheck` y `npm run lint` antes de dar por terminado un cambio.
- Mantener tests actualizados: cada componente nuevo lleva al menos un test básico.
- Usar los tipos del backend (`src/types/`) — no inventar shapes ad-hoc.
- Respetar la estructura de carpetas; preguntar antes de crear carpetas nuevas en `src/`.
- Escribir mensajes de commit en inglés siguiendo Conventional Commits.

### NO hacer

- No modificar configuración de Vite/ESLint/TS sin confirmar antes.
- No instalar dependencias nuevas sin aprobación (proponer y esperar OK).
- No crear archivos fuera de `src/` sin razón justificada.
- No usar `any` — si no conoces el tipo, usa `unknown` y refina.
- No hacer mocks del backend en tests sin antes verificar si hay un mock server configurado.
- No commitear código que no pase typecheck o lint.
