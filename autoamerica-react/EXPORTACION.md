# Exportación portable para Git

Fecha: 19 de octubre de 2026.

## Origen

Commit de la propuesta: `4da47250c2b45ad0346dd287ef5aa97378b8767e`.

El código fuente, recursos y documentación se copiaron del estado versionado y limpio de la propuesta. Se conservaron 53 archivos del origen; se agregó documentación de importación y configuración de finales de línea.

## Ajustes realizados únicamente en esta exportación

- Se excluyó `.openai/hosting.json`, que vinculaba la propuesta a su despliegue administrado.
- Se retiró de `vite.config.ts` el host `terminal.local`, utilizado para la vista previa del entorno anterior. Se conservan los controles predeterminados de Vite.
- Se amplió `.gitignore` para ignorar configuraciones del entorno anterior, registros y cobertura.
- Se agregó `.gitattributes` para facilitar el trabajo entre Windows y Linux.
- Se actualizó la introducción del README y se agregó `GIT_IMPORT.md`.

No se cambió el comportamiento funcional del catálogo, visor 3D o panel de mercadeo. El archivo de bloqueo de npm se conserva íntegro.

## Contenido del paquete

Incluye código React/TypeScript, configuración Vite, package.json y package-lock.json, recursos de public/, fotografías, manifiestos de procedencia, datos de muestra, documentación, inventario público y capturas.

El ZIP no contiene `.git/`, dependencias instaladas, compilaciones, cachés ni credenciales. `node_modules/` se reconstruye con `npm ci` y `dist/` con `npm run build`.

## Alcance del proyecto exportado

El CMS permite crear, editar, publicar y retirar fichas en memoria de la pestaña. Todavía no existe un backend Strapi, autenticación efectiva, base de datos, integración Quiter/Hathor ni almacenamiento persistente. Esas capacidades están especificadas en docs/cms-mercadeo.md y docs/plan-del-proyecto.md.

La escena 3D y su alternativa vectorial utilizan geometría conceptual. El paquete no contiene un CAD oficial Toyota ni catálogos OEM. Los formularios son simulados y las fichas de usados son datos de referencia. Las fuentes de imágenes están documentadas en public/assets/asset-manifest.json.

La aplicación usa rutas públicas desde `/`. Un alojamiento en la raíz de un dominio puede servir `dist/` directamente. Publicarla bajo una subruta exige adaptar esas rutas y la configuración base de Vite. La página conserva `noindex,nofollow` porque es una propuesta; el lanzamiento real requiere completar SEO, datos y flujos productivos.

## Verificación de esta entrega

Se realizó una instalación limpia desde la caché de npm y se ejecutaron correctamente `npm run typecheck` y `npm run build` en la carpeta exportada, con Node.js 24.19.0 y npm 11.9.0. La compilación utilizó Vite 7.3.7.

Se compararon los archivos con el commit de origen: el código funcional, los recursos, los datos y package-lock.json permanecen iguales. Los únicos ajustes a archivos existentes son los descritos arriba para README, .gitignore y vite.config.ts.

El ZIP se comprueba por integridad y por coincidencia de contenido con los archivos de entrega. Esta verificación corresponde a instalación, TypeScript, compilación y empaquetado; los recorridos de interfaz y sus límites están registrados en docs/validacion.md.
