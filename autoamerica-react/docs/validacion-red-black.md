# Validación de la actualización Red & Black

## Estado de liberación

**Implementación entregada para integración y prueba local; no aprobada como build productivo.**

El contenedor de trabajo no pudo resolver/descargar paquetes de `registry.npmjs.org` (errores EAI_AGAIN). `npm ci` no completó la instalación. Los intentos posteriores de TypeScript/build fallaron por definiciones de dependencias ausentes. Esto no permite concluir que el proyecto compila en su entorno real. No se regeneró `package-lock.json`, ni se sustituyeron versiones del producto para ocultar esta limitación.

## Comprobaciones realizadas

| Comprobación | Resultado y alcance |
|---|---|
| Pruebas de lógica | **47 aprobadas**: 43 nuevas de filtros, rangos, normalización, orden, URL, presentación y mapas; 4 de despiece de la base. Ejecutadas con Node 22.16 y `--experimental-strip-types`, no con el Node 24 del usuario. |
| Lectura sintáctica TS/TSX | 25 archivos transpilan sin errores de sintaxis. No equivale a typecheck semántico con todas las dependencias. |
| CSS | 6 archivos analizados con PostCSS, sin error de análisis. |
| Navegación compatible | **19 comprobaciones** de componentes y 0 excepciones JS registradas, mediante Chromium y un entorno React 18.2 ya disponible. No se ejecutaron Vite/React 19 ni el renderer Three. |
| Actualizador | **10 escenarios** con repositorios Git temporales: lectura, aplicación, idempotencia, restauración, conflictos, cambios locales, dependencias modificadas, archivo nuevo en colisión, payload alterado y CRLF. Ejecutados en Linux; validación real en Windows pendiente. |
| Preservación | Coinciden los archivos de dependencias/Docker/tour/renderer y las funciones originales de cotización, crédito y explorador. |
| Integridad del ZIP | Verificada al empaquetar; contiene fuente, datos, documentos y pruebas, sin node_modules/dist/.git. |

Las 19 comprobaciones incluyen: portada sin salto inicial, avance del carrusel, comparación de dos modelos, solo diferencias, filtros de texto/precio/año, rango inválido, tema oscuro, simulador original, ficha individual y regreso, sedes por servicio, CMS, tour de seis pasos, alta de un usado de otra marca con filtros derivados, retiro de esa unidad, variables de scroll y movimiento reducido. Escritorio 1440x1000 y móvil 390x844; no constituyen una batería completa de navegadores/dispositivos.

## Pendiente antes de subir a main compartido

En Windows/PowerShell, usuario estándar, dentro de `autoamerica-react` y con las dependencias instaladas del lockfile, ejecuta por separado:

```powershell
npm run typecheck
```

```powershell
npm test
```

```powershell
npm run build
```

No continúes al comando siguiente si falla el anterior. Conserva el error exacto. No subas la actualización hasta corregir TypeScript/build y revisar la navegación en el Vite real.

También faltan: ejecución Docker, WebGL en hardware real, mapas/pins en conexión a Google, autorización de imágenes, WCAG/contraste formal, Lighthouse/Core Web Vitals, auditoría de seguridad, SEO y pruebas del inventario productivo. No se atribuyen tiempos de carga ni puntuaciones de rendimiento no medidos.

**Evidencias:** carpeta `evidencias-red-black`; capturas compatibles en `vistas-previas`. La imagen Mazda de la prueba era un archivo neutro de prueba, solo en memoria: no se agregó esa unidad al inventario del paquete.

Fuentes de ejecución: https://docs.npmjs.com/cli/v11/commands/npm-ci/ y https://vite.dev/config/server-options.html.
