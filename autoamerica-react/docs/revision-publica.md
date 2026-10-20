# Autoamérica: revisión del contenido público y enlaces de la propuesta

Fecha de la revisión: **19 de octubre de 2026**. Dominio: [autoamerica.com.co](https://autoamerica.com.co/).

## Alcance y evidencia

Se recuperaron `robots.txt`, el índice de sitemaps y sus **13 submapas**, con **375 entradas y 373 URLs únicas**. Se revisó el HTML de **112 páginas**, incluidas las **19 fichas de modelos** declaradas en los sitemaps. Las 112 páginas respondieron HTTP 200 durante la revisión. Los enlaces a 55 fichas de vehículos usados se observaron en páginas de catálogo; esas fichas no se validaron individualmente.

Los archivos `inventory.csv` y `audit-summary.json`, ubicados junto a este documento, conservan el inventario y el resumen. `public/project-review.json` expone exclusivamente un resumen de fuentes públicas y cobertura para la propuesta.

La revisión se realizó mediante lecturas GET de contenido público. No se accedió a administración, sesiones privadas, Quiter, Hathor, bases de datos ni código interno. No se enviaron formularios ni se ejecutaron pagos, reservas o cambios. Una respuesta HTTP 200 confirma que se recibió una página; no demuestra que todos sus flujos funcionen. No se midieron Core Web Vitals ni se ejecutó una auditoría de seguridad.

## Estructura encontrada

| Área | Evidencia pública | Consecuencia para el diseño |
| --- | --- | --- |
| Entrada y modelos | La raíz ofrece acceso a Toyota y usados; [home](https://autoamerica.com.co/home/) contiene el catálogo principal. | La propuesta reúne la entrada comercial con accesos directos a tareas frecuentes. |
| Usados | [Usados Toyota](https://autoamerica.com.co/usados-toyota/) presenta fichas con precio, año, kilometraje, transmisión y sede. | Los ejemplos son una captura del catálogo, no una integración de inventario en vivo. |
| Repuestos | [Repuestos](https://autoamerica.com.co/repuesto/) solicita VIN y fotografía para cotizar por WhatsApp. | El explorador 3D debe ayudar a identificar el sistema y conducir a validación de compatibilidad. |
| Servicio | [Posventa](https://autoamerica.com.co/servicios-posventa/) reúne citas, estado del vehículo, mantenimiento, asistencia, repuestos, accesorios, pagos y sedes. | Los accesos de servicio deben seguir siendo fáciles de encontrar. |
| Financiación | [Planes vigentes](https://autoamerica.com.co/planes-vigentes/) y [financiación](https://autoamerica.com.co/financiacion/) figuran en la navegación. | Una implementación productiva necesita fuentes autorizadas para condiciones y simulaciones. |
| Otros contenidos | Flotas, Kinto, boutique, blog, historia, PQR, ética y políticas aparecen en las páginas y sitemaps revisados. | El proyecto de migración debe definir su conservación, organización y redirecciones. |

Se observaron recursos de WordPress, Astra, Elementor y WooCommerce; enlaces a PlaceToPay; fotografías de usados servidas desde `peugeot.automotora.com.co`; y enlaces 360 de SpinCar/Impel en [concesionario virtual](https://autoamerica.com.co/concesionario-virtual/). Su presencia no verifica contratos, licencias, vigencia ni funcionamiento integral.

## Comprobación de enlaces literales del prototipo

Se compararon `src/App.tsx` y `src/data.ts` con el inventario y las respuestas HTML ya capturadas. Este documento registra el estado observado antes de aplicar las correcciones indicadas; no modifica esos archivos.

| Enlace o uso observado | Resultado | Acción recomendada |
| --- | --- | --- |
| `/nuestra-historia/` en el pie | No figura en el inventario ni en las páginas recuperadas; no se comprobó su estado HTTP. | Usar la página verificada [historia](https://autoamerica.com.co/historia/), con HTTP 200 y canonical coincidente. No se afirma que la ruta original devuelva 404. |
| Las cinco propiedades `vehicles[].url` apuntan a `/home/` | Destino existente, pero genérico. | Reemplazar cada destino por su ficha exacta de la tabla siguiente. |
| `/pide-tu-cita/` | HTTP 200, sitemap y canonical coincidentes. | Conservar. No se envió una solicitud de cita. |
| `/compramos-tu-usado/` | HTTP 200, sitemap y canonical coincidentes. | Conservar. No se envió información de retoma o venta. |
| `/terminos-y-condiciones/` | HTTP 200, sitemap y canonical coincidentes. | Conservar. |
| `/sistema-sedes-y-horarios/` | HTTP 200 y canonical coincidente; también existe `/sedes-y-horarios/`. | Preferir [sedes y horarios](https://autoamerica.com.co/sedes-y-horarios/) para el acceso comercial. La ruta de sistema no se considera rota. |
| `/todos-los-usados/` | HTTP 200 y canonical coincidente. | Conservar para explorar el catálogo general. Añadir `/usados-toyota/` como fuente concreta de la muestra de cuatro vehículos. |
| `/pagos/` | Figura en el sitemap y en los enlaces oficiales. Se excluyó su lectura del alcance transaccional. | Conservar el enlace al portal oficial, sin afirmar una validación del pago. |
| `/contacto/`, `/taller/`, `/repuesto/`, `/planes-vigentes/`, `/flotas-toyota-autoamerica/` y `/politica-tratamiento-de-datos-personales/` | HTTP 200, sitemap y canonical coincidentes. | Conservar. |

El enlace dinámico de búsqueda en Google Maps y el enlace telefónico no se validaron mediante navegación o llamada en esta revisión.

## Fichas exactas de los cinco modelos destacados

Todos los destinos de esta tabla respondieron HTTP 200 y declararon el mismo URL como canonical durante la lectura.

| Modelo | URL oficial |
| --- | --- |
| Corolla Cross HEV | [https://autoamerica.com.co/vehiculo/corolla-cross-hv/](https://autoamerica.com.co/vehiculo/corolla-cross-hv/) |
| Land Cruiser Prado | [https://autoamerica.com.co/vehiculo/toyota-prado/](https://autoamerica.com.co/vehiculo/toyota-prado/) |
| Hilux | [https://autoamerica.com.co/vehiculo/toyota-hilux/](https://autoamerica.com.co/vehiculo/toyota-hilux/) |
| Yaris Cross HEV | [https://autoamerica.com.co/vehiculo/yaris-cross/](https://autoamerica.com.co/vehiculo/yaris-cross/) |
| RAV4 HEV | [https://autoamerica.com.co/vehiculo/rav4-hev-2/](https://autoamerica.com.co/vehiculo/rav4-hev-2/) |

## Límite del alcance 3D

La presencia de una página [360 Yaris](https://autoamerica.com.co/360-yaris/) y de enlaces a experiencias 360 externas no demuestra disponibilidad de modelos CAD/GLB, geometría separada por piezas, referencias OEM o derechos de reutilización.

El prototipo debe identificar su vehículo y sus sistemas como una demostración conceptual. Para convertirlo en un catálogo de repuestos comercial se requieren activos autorizados, correspondencia entre geometría y referencia, y validación de compatibilidad por VIN, modelo, año, versión y motorización. Estos requisitos no se resolvieron mediante la lectura del sitio público.

## Migración y limitaciones

Los sitemaps incluyen rutas de sistema y de agradecimiento. Se requiere decidir cuáles conservar, redirigir o excluir de indexación. `mantenimiento-express/` y `tienda/` aparecen duplicadas entre sitemaps, por lo que las 375 entradas corresponden a 373 URLs únicas.

La revisión no garantiza encontrar contenido sin enlaces, no indexado, privado o generado mediante interacciones. El resumen del proyecto aportado por el equipo sirve como contexto, pero sus datos de infraestructura, tráfico, integración y costos no fueron comprobados mediante este inventario. Tampoco se confirma precio o disponibilidad vigente de vehículos más allá del momento de la captura.

**Criterio de uso de la evidencia:** distinguir el inventario de 373 URLs, la revisión temática de 112 páginas prioritarias y la ampliación automática detallada a continuación. No presentarlo como validación funcional integral del portal.

## Ampliación automática del inventario público

Finalización: 2026-10-19T23:24:16.598103+00:00. Se conservaron las 112 lecturas prioritarias y se intentó recuperar el HTML de otras **247 URLs** pendientes: **247 legibles**, **0 bloqueadas** y **0 con otros errores o respuestas no HTML**. Se excluyeron **14 rutas** por corresponder a transacciones, cuentas, seguimiento, acciones sobre datos personales o integraciones internas. El inventario contabiliza las **373 URLs** entre lecturas y exclusiones; no afirma que todas hayan sido leídas o validadas funcionalmente.

El total de páginas HTML legibles es **359**. Las 112 páginas iniciales tienen revisión temática prioritaria. La ampliación registra automáticamente título, H1, canonical y estado de respuesta; no revisa funcionalmente los flujos. El CSV distingue los H1 capturados en la ampliación, los recuperados de HTML local y los que no están disponibles por separado. Las exclusiones, bloqueos y errores individuales constan en `audit-summary.json`.

### Precisión de destinos y encabezados

De las **359 URLs con HTML legible**, **9 terminaron en otro URL** tras redirección. Se observaron **350 destinos finales distintos**. Por ejemplo, varias categorías de producto terminan en `/home/`; una respuesta 200 final no confirma que permanezca el contenido originalmente asociado a esa categoría. Los saltos intermedios no se registraron y no se afirma si fueron 301 o 302.

Se recuperó el H1 desde HTML ya guardado para **10 páginas prioritarias**, sin nuevas solicitudes. Para **102 páginas iniciales** no se dispone del H1 por separado; el CSV lo indica. Las **247 lecturas de ampliación** sí separan H1, título y canonical.
