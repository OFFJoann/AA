# Autoamérica: navegación por áreas y fichas por sistemas

Fecha: 20/10/2026. Base: paquete AA-completo-red-black.zip que el usuario informó haber publicado como 6f8b45e. No se leyó ni modificó el repositorio privado en vivo. La compatibilidad del actualizador se determina por contenido, no por suponer que el repositorio remoto no cambió.

## Lo implementado

| Ruta | Contenido montado |
|---|---|
| `/` | Portada y accesos a nuevos, usados y posventa; sin catálogos ocultos más abajo. |
| `/nuevos` | Carrusel de todos los nuevos publicados en el CMS. |
| `/nuevos/prado` | Perfil de Prado: tres configuraciones de referencia 2027. |
| `/nuevos/hilux` | Perfil de doble cabina SRV/SRX diésel 2027. |
| `/nuevos/corolla-cross` | Resumen 2027 separado de dos configuraciones del archivo 2026. |
| `/nuevos/rav4` | RAV4 HEV XLE/Limited 2026: cobertura parcial. |
| `/nuevos/:id` | Ficha de referencia anterior para otros nuevos; mensaje de no publicado si falta el modelo. |
| `/usados` | Buscador multimarca, filtros, favoritos y comparación. |
| `/posventa` | Accesos a taller, citas, repuestos, sedes y pagos externos. |
| `/posventa/repuestos` | Explorador 3D existente, extraído de App sin modificar el cuerpo de la función. |
| `/sedes` | Componente existente de ubicaciones y Google Maps bajo activación. |

Los enlaces tienen `href` reales. Se usa History API dentro de React para cambiar la página sin recargar la aplicación. El código de nuevos, usados, posventa, sedes, ficha y explorador tiene fronteras lazy/Suspense. El administrador y el comparador siguen siendo diálogos compartidos. No son aplicaciones, dominios, bases de datos ni fronteras de seguridad independientes.

Los marcadores antiguos `#modelos`, `#usados`, `#servicios`, `#repuestos`, `#sedes` y `#vehiculo/...` se traducen a las rutas actuales conservando los parámetros de consulta. La traducción es cliente; no es una redirección HTTP 301. Hay vista de ruta desconocida, no un estado HTTP 404 emitido por servidor.

## Cinemática

Siete capítulos: exterior, interior/conectividad, motor, transmisión/tracción, chasis/frenos, seguridad y dimensiones. El escenario se fija con CSS sticky mientras progresa el desplazamiento. Las capas se funden con una curva suave y movimiento horizontal sutil. La progresión es reversible; cada escena conserva tiempo de lectura. No es una rotación 3D real ni una simulación de cámara dentro del automóvil.

Se puede saltar de capítulo, consultar directamente la tabla o abrir cotización sin terminar el recorrido. La tabla es buscable, separa versiones y enlaza la fuente de cada dato. Las imágenes se muestran completas con object-fit:contain. No se agregó GSAP ni otra dependencia: en esta entrega se utiliza requestAnimationFrame y CSS. Las vistas sin foto coincidente muestran un panel de datos expresamente identificado, no una foto de otro sistema.

Modo lectura manual, preferencia del sistema de movimiento reducido y lectura automática en ventanas de poca altura (hasta 680 px). Los datos nunca se deducen del aspecto de una foto. Un registro editado en el CMS queda como marketing y no hereda un perfil técnico solo por conservar el mismo ID.

## Preservación

Sin cambios en package.json/package-lock, Dockerfile/compose/nginx, AdminCMS, VehicleScene, VehicleCompare, LocationMap, tipos de catálogo, inventario y la lógica de filtros. QuoteForm, CreditSimulator, Modal y Proposal conservan su cuerpo original. Explorer se trasladó sin cambios de cuerpo. Consulte evidencias-entornos/preservation.json.

No se publica ni cambia GitHub. El CMS sigue siendo de demostración en memoria: recargar la pestaña reinicia sus ediciones. El simulador conserva su fórmula anterior sin intereses ni cargos; el recorrido no le asigna un precio de una versión no confirmado. Los formularios no envían solicitudes reales. Los pagos y citas ocurren fuera de esta aplicación mediante enlaces al portal oficial.

## Publicación y SEO

El alojamiento debe servir index.html cuando una URL de página no corresponda a un archivo. El nginx.conf recibido YA tiene `try_files $uri $uri/ /index.html;`, por eso no se modificó. Se asume despliegue en la raíz del dominio, no en `/AA/`. No trasladar directamente a un alojamiento que no admita fallback SPA. Probar acceso directo y F5 en todas las rutas antes de desplegar. No se configuraron CDN, DNS, AWS ni Cloudflare.

Se actualiza el título del documento por ruta. Esta entrega no incluye SSR/SSG, sitemap por vehículo ni redirecciones HTTP de la web anterior: pendientes para la migración SEO productiva.

## Dónde editar

- Landing y accesos: `src/pages/HomePage.tsx`.
- Posventa y enlaces oficiales: `src/pages/AftersalesPage.tsx`.
- Rutas: `src/lib/routes.ts`; enlaces y restauración de posición: `src/navigation/SiteNavigation.tsx`.
- Escenas: `src/components/vehicles/VehicleStory.tsx`.
- Matemática de la transición: `src/lib/cinematic.ts`.
- Datos por año/versión y fuentes: `src/data/technicalProfiles.ts`.
- Diseño: `src/styles/entornos.css` y `src/styles/cinematic.css`.

No cambiar una propiedad `year` para hacer coincidir dos documentos: crear una configuración distinta con su fuente. Para incorporar fotos, confirmar modelo, generación, año, acabado visible y derecho de uso; agregar un objeto media con variantes permitidas. No usar fotografías de motor o interiores genéricas.
