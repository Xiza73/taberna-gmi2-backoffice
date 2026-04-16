---
description: "Checklist y pasos de despliegue del frontend del backoffice"
allowed-tools: Read, Bash
---

# /deploy — Despliegue

Ejecuta el checklist de pre-despliegue y genera el build de producción.

## Pasos

1. **Pre-checks:**
   - Ejecuta `npm run typecheck` — debe pasar sin errores.
   - Ejecuta `npm run lint` — debe pasar sin errores.
   - Ejecuta `npm run test:ci` — todos los tests deben pasar.
   - Ejecuta `npm run format:check` — código formateado correctamente.

2. **Build:**
   - Ejecuta `npm run build`.
   - Verifica que el directorio `dist/` se genera correctamente.
   - Reporta el tamaño del bundle (revisa salida de Vite).

3. **Verificación post-build:**
   - Ejecuta `npm run preview` para verificar que el build sirve correctamente.
   - Revisa que no hay errores en consola.

4. **Reporte:**
   - ✅ / ❌ por cada check.
   - Tamaño del bundle (JS, CSS, assets).
   - Advertencias encontradas (si las hay).
   - Comando sugerido para deploy según el entorno (por definir).

## Input esperado

$ARGUMENTS — entorno de destino: "staging" | "production" (default: staging).
