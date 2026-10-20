# Validación del export consolidado

Fecha: 20/10/2026. Este informe describe esta ejecución, no las anteriores.

## Pruebas ejecutadas

| Prueba | Resultado | Alcance real |
|---|---|---|
| Pruebas automatizadas Node | 132 aprobadas, 0 fallidas | 113 existentes + 8 contratos de integración 360 + 11 casos del importador local |
| Archivos TS/TSX | 37 sin diagnósticos sintácticos | TypeScript transpileModule 5.8.3 disponible en el laboratorio |
| Archivos CSS | 10 analizados sin errores de sintaxis | PostCSS del laboratorio |
| Imports relativos del código fuente | 0 rutas locales ausentes | Existencia; no prueba la semántica de bibliotecas externas |
| Integrador | 15 escenarios aprobados | Git temporal: aplicación, restauración, idempotencia, conflictos, CRLF y preservación de archivos del usuario |
| Archivos críticos preservados | 15 iguales a Landing Motion | Incluye dependencias, Docker, CMS/tour, filtros, comparador, mapas y renderer |

Entorno de prueba: Node.js 22.16.0, npm 10.9.2. Para ejecutar los tests TS en
este Node se usó `NODE_OPTIONS=--experimental-strip-types` solo en el proceso
de prueba. No se modificó `package.json` para el laboratorio.

Las pruebas de integración del visor son contratos de código y rutas, no una
prueba visual. Las del importador usan cabeceras JPEG sintéticas fuera del
export; esos archivos no representan vehículos ni se distribuyen como fotos.

## No completado en este entorno

`npm ci --ignore-scripts --no-audit --no-fund --fetch-retries=0 --fetch-timeout=12000`
no pudo obtener dependencias. El log interno de npm reportó `EAI_AGAIN` al
resolver `registry.npmjs.org` y terminó con `Exit handler never called!`.
No se cambiaron versiones ni se sustituyó React para aparentar un build correcto.

Por ello NO están aprobados aquí el typecheck completo, el build React/Vite,
la interfaz real en navegador, WebGL, Docker ni Maps externo. Ejecuta esas
validaciones en tu equipo antes del commit. Los resultados de un build
anterior del usuario no certifican este conjunto consolidado.

Las fotografías 360° no están disponibles en este entorno; el usuario verificó
36 archivos de 1600x606 en su equipo. Es necesaria su importación local para
probar el giro real. Los videos siguen sin archivos ni registros configurados.

## Evidencia

- `evidencias-consolidado/pruebas-unitarias.txt`: ejecución de los 132 casos.
- `evidencias-consolidado/analisis-estatico.json`: sintaxis e imports.
- `evidencias-consolidado/integracion-restauracion.json`: escenarios del integrador.
- `evidencias-consolidado/preservacion.json`: igualdad de archivos críticos.
- `evidencias-consolidado/instalacion-dependencias.txt`: fallo de instalación.

## Criterio de aceptación local

Typecheck, tests y build finalizan sin error; las rutas admiten F5; el enlace
Exterior 360° abre el visor en la ficha; las 36 imágenes se cargan y se
pueden recorrer; filtros, comparador, cotización y tour mantienen su operación.
Los archivos de trabajo del equipo deben revisarse antes de publicar en main.
