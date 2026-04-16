---
name: deploy
description: "Skill de despliegue para el frontend del backoffice — ejecuta validaciones, build de producción con Vite, y genera reporte de bundle"
trigger: "Cuando se mencione deploy, despliegue, poner en producción, build de producción, o publicar"
---

# Deploy Skill — Backoffice Frontend

Automatiza el proceso de build y validación previo al despliegue.

## Proceso

### Fase 1 — Validación

```bash
npm run typecheck      # TypeScript sin errores
npm run lint           # ESLint limpio
npm run test:ci        # Tests pasan
npm run format:check   # Formato consistente
```

Si cualquier paso falla, detener y reportar el error. No continuar al build.

### Fase 2 — Build

```bash
npm run build
```

Verificar que `dist/` contiene:
- `index.html`
- Assets JS (bundled, minificado)
- Assets CSS
- Archivos estáticos de `public/`

### Fase 3 — Análisis

- Reportar tamaño total del bundle.
- Listar los chunks más grandes (> 100KB).
- Advertir si el bundle JS total supera 500KB gzipped.
- Verificar que no hay source maps expuestos en producción.

### Fase 4 — Preview (opcional)

```bash
npm run preview
```

Confirmar que la app carga sin errores de consola.

## Output

Reporte con:
- Estado de cada validación (✅ / ❌)
- Tamaño del bundle desglosado
- Advertencias (si las hay)
- Build listo para deploy: Sí / No
