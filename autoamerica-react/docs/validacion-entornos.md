# Validación de esta entrega

## Ejecutado

- 78 pruebas reales de lógica con Node 22 y `--experimental-strip-types`, incluidos los 47 casos previos. Pruebas nuevas: rutas, URL, datos por versión, procedencia y curvas de animación. Cero fallos.
- Análisis sintáctico/transpilación de los TS/TSX con TypeScript local. Cero diagnósticos sintácticos. No es una comprobación semántica de tipos con las dependencias reales.
- 29 comprobaciones de interfaz en Chromium con los componentes modificados y una capa de compatibilidad. Incluye aislamiento de áreas, enlaces, carrusel, avance/retroceso de capítulos, versiones, tabla, comparador compartido, apertura de cotización/CMS, mapa bajo activación, menú móvil y movimiento reducido.
- Comparación de archivos preservados y cuerpos de las funciones existentes. Veinte verificaciones de preservación correctas.
- Actualizador: consultar updater.json; pruebas locales de comprobación, aplicación, repetición, restauración, versiones diferentes y archivos locales modificados.

## Límites concretos

La instalación real de dependencias no estuvo disponible en este entorno; la prueba de caché npm terminó con ENOTCACHED. No se ejecutó con éxito `npm run typecheck` ni `npm run build` para esta nueva entrega. La compilación aprobada por el usuario para 6f8b45e corresponde a la versión anterior, no a esta.

Las pruebas de interfaz usaron React 18.2 y ReactDOM de compatibilidad instalados con Jupyter, no React 19.2 del proyecto. Los iconos y Three.js fueron sustituidos SOLO en el banco de pruebas; no se sustituyen en los archivos entregados. Se inyectaron localmente CSS, código transpilado y fotos para la vista sin red. Las políticas del navegador impidieron abrir el servidor HTTP del entorno: se simuló History/location y se comprobó la actualización de rutas en memoria. Esto NO valida navegación HTTP, recarga F5, CDN, botones nativos de historial, Google Maps externo ni WebGL real. Las capturas son vistas de compatibilidad, no una web desplegada.

## Validación pendiente en Windows, antes del commit

Desde `C:\Desarrollo\Autoamerica\AA\autoamerica-react`, PowerShell de usuario normal:

```powershell
npm run typecheck
```

Si termina sin errores:

```powershell
npm test
```

Si aprueba las pruebas:

```powershell
npm run build
```

El paquete no modifica package.json ni lock. Con dependencias ya instaladas no se solicita actualizar versiones. Para una copia limpia, primero `npm ci`. No usar npm audit fix --force.

Luego iniciar una vista del BUILD, no solamente el servidor de desarrollo:

```powershell
.\node_modules\.bin\vite.cmd preview --host 127.0.0.1 --port 4173 --strictPort
```

Abrir http://127.0.0.1:4173/ . Probar también rutas directas `/nuevos`, `/nuevos/prado`, `/usados`, `/posventa`, `/sedes`, `/posventa/repuestos`; F5 en cada una; atrás/adelante nativos; abrir ficha en nueva pestaña. Verificar que los filtros guardados en URL vuelvan al usar Atrás, el menú móvil, la tabla técnica y que el visor no se descargue antes de entrar a repuestos.

Comprobar consola y Network, cotización, simulador con precio conocido desde usados, tour del CMS, crear/publicar/retirar un usado multimarca, mantenerlo al navegar y advertencia de reinicio al recargar. Los 78 tests no sustituyen estas pruebas funcionales.

Para el servidor final: probar rutas con el Dockerfile existente y su Nginx, sin editar producción para hacer la prueba. Confirmar reescritura SPA y archivos estáticos. Medir rendimiento móvil y accesibilidad antes del lanzamiento.
