---
description: "Workflow para investigar y resolver bugs reportados"
allowed-tools: Read, Bash, Edit, Write
---

# /fix-issue — Resolver un bug

Workflow guiado para investigar, diagnosticar y corregir un bug.

## Pasos

1. **Entender el bug:** Lee la descripción proporcionada por el usuario. Si falta información, pregunta:
   - ¿Qué comportamiento se esperaba vs. qué ocurrió?
   - ¿Pasos para reproducir?
   - ¿En qué página/componente ocurre?

2. **Localizar el código afectado:**
   - Busca en `src/` los archivos relacionados con el feature mencionado.
   - Revisa el componente de ruta en `src/pages/` y sus dependencias en `src/features/`.

3. **Diagnosticar:**
   - Lee el código relevante y traza el flujo de datos.
   - Identifica la causa raíz. Si hay múltiples posibilidades, listarlas ordenadas por probabilidad.

4. **Corregir:**
   - Aplica el fix mínimo necesario.
   - Asegúrate de que no rompe otros flujos (revisa usos del componente/función modificado).

5. **Verificar:**
   - Ejecuta `npm run typecheck` para confirmar que no hay errores de tipos.
   - Ejecuta `npm run test` para confirmar que los tests pasan.
   - Si existe test del componente afectado, verifica que cubre el caso del bug.
   - Si no existe test, crea uno que reproduzca el bug y confirme el fix.

6. **Reportar:** Describe qué se cambió, por qué, y qué test lo cubre.

## Input esperado

$ARGUMENTS — descripción del bug o ID de issue.
