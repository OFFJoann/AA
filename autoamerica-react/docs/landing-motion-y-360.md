# Landing Motion y referencia Toyota 360

Fecha de revisión: 20/10/2026. Base: AA-entornos-cinematica.zip disponible en esta conversación, no un checkout verificado del GitHub privado.

## Estado exacto

Implementado: landing con tres accesos grandes e independientes, fondo fotográfico animado, pausa; reproductor decorativo MP4/WebM por modelo, difuminado sin afectar a los textos; alternativa estática en móvil, ahorro de datos, movimiento reducido o error; referencias externas a vistas oficiales verificadas de Corolla Cross y RAV4. Se mantienen las rutas y la ficha cinematográfica anteriores.

NO incorporado: archivos de video oficiales, un visor Toyota embebido, secuencia exterior 360 de Toyota descargada, panorama interior descargado, un modelo Toyota editable, geometría exacta de piezas de Toyocar, inventario exhaustivo ni nueva animación de despiece. Los registros de video permanecen en `null`; el visor conceptual existente no se reemplaza ni se presenta como un original Toyota.

La solicitud corregida identifica `toyota.com` como referencia del visor, NO Autoamérica. El renderer conceptual de Javi se conserva para evitar borrar su trabajo. Los enlaces externos son referencias; no sustituyen el visor integrado que se quiere construir.

## Archivos de interfaz

- `src/pages/HomePage.tsx`: tres tarjetas/enlaces completos: Nuevos, Usados y Posventa. No requiere desplazarse por todos los catálogos.
- `src/styles/motion-landing.css`: tarjetas con fondos rojo, blanco y grafito; tipografía; contraste; presentación para portátil y móvil; capas desenfocadas; movimiento reducido.
- `src/components/vehicles/VehicleMotionBackground.tsx`: reproductor independiente por modelo/versión. Antes de ser visible no crea el video. Se detiene si cambia de página, queda fuera de vista o la pestaña se oculta. Rechazo de autoplay o error conserva el póster.
- `src/components/vehicles/NewVehicleCarousel.tsx`: aplica el fondo al modelo activo, conservando la foto nítida delante y la cotización/comparación.
- `src/components/vehicles/VehicleStory.tsx`: slot de video para la cabecera de ficha, filtrado por identificador exacto de versión. No altera la ficha técnica ni el resto de capítulos.
- `src/components/vehicles/OfficialVehicleTours.tsx`: enlaces que avisan que abren el sitio externo de Toyota EE. UU. No carga un iframe ni extrae su código.
- `src/data/vehicleBackgrounds.ts`, `src/lib/vehicleBackground.ts`, `public/media/vehicle-backgrounds.json`: registro y validación documental. No realizan reconocimiento automático de modelos.

No se modifican dependencias, Docker, CMS, tour, cálculos del simulador, filtros, comparador, mapas ni geometría 3D.

## Video por modelo

No usar una página HTML o un enlace de YouTube como `src` de un `<video>`. Se requiere un archivo local autorizado. El registro solo acepta MP4/WebM dentro de `/media/videos/`, fuente oficial, año, versión, revisor y referencia de autorización. La correspondencia con Colombia y la autorización son declaraciones humanas, no verificaciones automáticas del software.

El clip debe revisarse completo: mismo modelo/generación/versión/equipamiento, sin precios de otro mercado o afirmaciones no aplicables. El desenfoque NO corrige una versión incorrecta ni sustituye una licencia. Recomendación editorial: clip corto, sin voz ni audio de fondo, compresión revisada y una imagen alternativa correcta. No se ha exportado ningún clip en esta entrega.

`registrar-video.mjs` inspecciona el encabezado del contenedor y el tamaño, no prueba el códec, duración ni contenido. El navegador se prueba después. No sobreescribe un video registrado distinto sin `--replace`, guarda respaldo del registro fuera del repositorio y no publica a GitHub.

Ejemplo de estructura de comando (PowerShell, usuario normal, carpeta autoamerica-react, Node.js 24 ya instalado; sustituir los valores en mayúscula por evidencia REAL):

```powershell
node .\scripts\registrar-video.mjs --model prado --file "RUTA_REAL_DEL_CLIP.mp4" --source-page "URL_OFICIAL_DE_ORIGEN" --year 2027 --variant "ID_EXACTO_DE_VERSION" --reviewer "NOMBRE_DEL_REVISOR" --approval "REFERENCIA_DE_AUTORIZACION"
```

Sin `--apply` solo valida. Con `--apply` copia el clip y actualiza el registro. No usar valores inventados para forzar la validación. Para una cabecera de ficha, `variant` debe coincidir literalmente con el id de `technicalProfiles.ts`. En el carrusel se usa el video revisado de la gama; la leyenda sigue siendo de referencia.

Para quitar un clip, conservar respaldo, establecer su entrada `video` a `null`, comprobar que se recupera el póster y retirar del repositorio el archivo huérfano solo después de verificar que no se usa en otros lugares. No colocar material confidencial ni comprobantes con datos personales en `public/`.

## Verificaciones de esta entrega

113 pruebas automatizadas de lógica y metadatos GLB aprobadas. Se incluyen las pruebas heredadas; ninguna prueba afirma que un modelo Toyota real esté cargado. Las nuevas pruebas de inspector usan GLB sintéticos y las del reproductor un MP4 sintético de laboratorio, que no se entrega como video comercial.

21 comprobaciones de interfaz aprobadas en Chromium con React 18.2 de compatibilidad, imágenes locales insertadas, navegación/datos simulados e iconos sustitutos. Se comprobó que los tres accesos caben en la vista de 1366x768 y 390x844, pausa de fotografía/video, cambios de modelo, rutas de acceso, ausencia de overflow móvil, preferencia de movimiento reducido y ausencia de excepciones JS en las pruebas realizadas.

El navegador de laboratorio bloquea HTTP local (`ERR_BLOCKED_BY_ADMINISTRATOR`). La vista se probó con HTML en memoria, no un servidor Vite. `npm ci --offline --ignore-scripts` no pudo terminar por `ENOTCACHED` y el acceso de red del contenedor no resolvió los dominios consultados. Por tanto, `npm run typecheck`, build React 19/Vite, Docker, reproducción de un video oficial, recarga directa de rutas, WebGL y modelos reales siguen pendientes de validación local.

## Fuentes verificadas

- https://www.toyota.com/corollacross/ : vista exterior rotatoria y acceso al interior.
- https://www.toyota.com/corollacross/interior-tour/ : acabados e interior de versiones estadounidenses.
- https://www.toyota.com/rav4/ y https://www.toyota.com/rav4/interior-tour/ : referencia de vistas de RAV4.
- https://www.toyota.com/vehicles/landcruiser/2027 : referencia del Land Cruiser estadounidense, no equivalencia automática a Prado CO.
- https://www.toyota.com/support/legal-terms/ : revisar autorización aplicable para reutilización, adaptación y alojamiento comercial. No se presume que la autorización del concesionario alcance todo material de Toyota EE. UU.

Las especificaciones técnicas colombianas de la entrega anterior no se reemplazaron con información de EE. UU.
