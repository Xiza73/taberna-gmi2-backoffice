---
description: "Revisión de código — analiza calidad, tipos, tests y convenciones del proyecto"
allowed-tools: Read, Bash, Edit
---

# /revision — Revisión de código

Realiza una revisión completa del código cambiado o del archivo/carpeta indicado.

## Pasos

1. **Identificar cambios:** Ejecuta `git diff --cached` (si hay staged) o `git diff` para ver los cambios actuales. Si el usuario indica un archivo o carpeta, enfócate ahí.

2. **Verificar tipos:** Ejecuta `npx tsc --noEmit` y reporta errores de TypeScript.

3. **Verificar lint:** Ejecuta `npm run lint` y lista las violaciones encontradas.

4. **Revisar convenciones:**
   - Nombres de archivos y componentes siguen la convención del proyecto (ver CLAUDE.md).
   - No hay `any` — debe ser `unknown` si el tipo no se conoce.
   - Imports usan alias `@/` (no rutas relativas largas).
   - Los componentes nuevos tienen al menos un test básico.

5. **Revisar lógica:**
   - ¿Hay edge cases no manejados?
   - ¿Se manejan correctamente los estados de loading/error?
   - ¿Los hooks respetan las reglas de React (dependencias de useEffect, etc.)?

6. **Generar reporte:** Resume hallazgos en categorías: 🔴 Bloqueo, 🟡 Sugerencia, 🟢 OK.

## Input esperado

$ARGUMENTS — ruta de archivo/carpeta o "staged" para revisar cambios en staging.
