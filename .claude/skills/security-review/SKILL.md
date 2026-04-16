---
name: security-review
description: "Revisa el código frontend en busca de vulnerabilidades comunes: XSS, inyección, exposición de tokens, CORS, y malas prácticas de seguridad en React"
trigger: "Cuando se mencione seguridad, vulnerabilidades, XSS, inyección, tokens expuestos, o revisión de seguridad"
---

# Security Review — Frontend

Analiza el código del proyecto buscando vulnerabilidades de seguridad comunes en aplicaciones React + TypeScript.

## Checklist de seguridad

### 1. XSS (Cross-Site Scripting)
- Buscar uso de `dangerouslySetInnerHTML` — debe tener sanitización previa.
- Verificar que inputs de usuario no se renderizan sin escapar.
- Revisar que URLs dinámicas no permiten `javascript:` protocol.

### 2. Tokens y credenciales
- Verificar que tokens JWT no se almacenan en localStorage (preferir httpOnly cookies).
- Buscar secrets hardcodeados en el código (API keys, tokens).
- Verificar que las variables de entorno sensibles usan `VITE_` correctamente y no exponen secretos del servidor.

### 3. Comunicación con el backend
- Verificar que todas las llamadas a la API usan HTTPS.
- Revisar que los headers de autenticación se envían correctamente.
- Verificar manejo de errores 401/403 (redirect a login, limpieza de tokens).

### 4. Dependencias
- Ejecutar `npm audit` y reportar vulnerabilidades conocidas.
- Verificar que no hay dependencias obsoletas con CVEs conocidos.

### 5. Buenas prácticas React
- Verificar que `key` props no usan index en listas que mutan.
- Revisar que `useEffect` no tiene cleanup leaks (suscripciones, timers).
- Verificar que no hay state derivado innecesario que pueda causar race conditions.

## Output

Genera un reporte con severidad por hallazgo: 🔴 Crítico, 🟡 Medio, 🟢 Bajo / Informativo.
