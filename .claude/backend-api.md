# Backend API — pointer (no mantener a mano)

**Este archivo YA NO documenta endpoints.** Era copy-paste manual del back y se podría.

La fuente de verdad vive en el workspace raíz:

| Querés saber | Leé |
|---|---|
| Contrato general (auth, BaseResponse, errores, paginación, money) | `../../docs/API-CONTRACT.md` |
| Endpoints y DTOs por módulo (actualizados) | `../../docs/backend-mirror/modules/<mod>.md` |
| Lo más fresco sin pasar por mirror | `../../backend/docs/modules/<mod>.md` |
| Roles, schema DB, env vars, flujos | `../../docs/backend-mirror/CONTEXT-GLOBAL.md` |
| Reglas inmutables del back (R1-R24) | `../../docs/backend-mirror/CHANGELOG-DESIGN.md` |

## Cómo actualizar

1. Pedile a Claude: **"sincronizá los docs del back"** — corre el skill `sync-backend-docs`
2. El skill hace `git pull` en `backend/` y refresca `docs/backend-mirror/`
3. Reporta qué módulos cambiaron — revisá `src/types/` y `src/api/` por si hay que ajustar
