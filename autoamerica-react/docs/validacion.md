# Validación de la propuesta

Fecha: 19 de octubre de 2026. Esta comprobación corresponde al prototipo de React y sus datos de muestra.

## Resultado

La comprobación TypeScript y la compilación de producción finalizaron sin errores. La página principal y el explorador se cargan en paquetes separados; el visor se solicita al aproximarse a su sección.

Se revisaron visualmente el escritorio (aproximadamente 1.349 × 926 px) y una vista contenida de 390 × 844 px. Esta última comprueba el diseño adaptable; no sustituye pruebas en dispositivos físicos ni reproduce todas las condiciones de un navegador móvil.

| Recorrido | Comprobación realizada |
| --- | --- |
| Portada y navegación | Fotografía, tipografía, botones y navegación por anclas; menú móvil abre y cierra al navegar |
| Catálogo | El filtro Híbridos muestra Corolla Cross HEV, Yaris Cross HEV y RAV4 HEV |
| Comparación | Selección de dos gamas, apertura del resumen y limpieza de la selección |
| Despiece | Ensamblado y despiece completo; selección de frenos actualiza el panel de información; con seguimiento activo, desplazar la página elevó el nivel de 32 % a 92 % |
| Giro | Los controles modifican la proyección visible del vehículo |
| Vista móvil | Navegación al explorador y control Despiece al 100 %; sin desbordamiento horizontal del documento en la vista comprobada |
| Usados | Presupuesto de hasta $150 millones devuelve tres registros; búsqueda RAV4 devuelve uno |
| Sedes | Seleccionar Oriente actualiza ubicación, servicios, horario y enlace de mapa |
| Solicitud | Datos de prueba y sede Sur generan una confirmación simulada; no se realiza envío, reserva ni persistencia |
| Propuesta | Las pestañas de experiencia, arquitectura y fuentes cambian de contenido dentro del diálogo |
| CMS: creación y publicación | Se creó una ficha nueva con imagen como borrador; quedó fuera del catálogo. Al publicar apareció también en el filtro Híbridos |
| CMS: retiro | Retirar la ficha nueva la ocultó del catálogo y conservó el registro administrativo |
| CMS: edición de usados | Cambiar el precio de RAV4 a un valor de prueba actualizó la tarjeta pública de la demostración |
| CMS: imagen local | Se cargó un archivo WebP existente mediante el selector de archivos; la vista previa mostró la imagen leída localmente |
| CMS: unidad vendida | Marcar RAV4 como vendido y guardar lo retiró del catálogo |
| CMS: restablecimiento | El control devolvió la muestra a sus nueve registros originales |
| CMS: pantalla pequeña | Se comprobó la disposición del panel en la vista de 390 × 844 px |

Durante la comprobación se corrigió la creación de identificadores en navegadores sin `crypto.randomUUID` y se normalizaron las variantes de motorización/categoría del editor para los filtros públicos. El panel mantiene los cambios solo en memoria; estas comprobaciones no acreditan un CMS productivo con autenticación o persistencia.

## Alcance gráfico

El navegador de comprobación informa que WebGL está deshabilitado. Se verificó la vista alternativa SVG: conserva proyección tridimensional, giro, despiece y selección de sistemas. La escena Three.js está implementada y pasó la compilación, pero **su representación WebGL no pudo verificarse visualmente en este entorno**.

Antes de un lanzamiento deben comprobarse la escena WebGL y su recuperación ante pérdida de contexto en navegadores con aceleración gráfica, el rendimiento en teléfonos de gama media y el comportamiento con movimiento reducido. Las imágenes `preview-despiece.jpg` y `preview-home.jpg` documentan la presentación observada.

## Actualización del explorador — 20 de octubre de 2026

Se verificó la escena WebGL en Chrome del equipo local, servida por el contenedor Docker. Esta comprobación amplía la validación SVG del 19 de octubre descrita arriba.

- El selector carga Prado, Corolla Cross HEV, Hilux, Yaris Cross HEV y RAV4 HEV; el nombre accesible del visor cambia con el vehículo.
- Se revisaron las cinco carrocerías; Hilux incluye doble cabina y platón abierto, y los crossover tienen proporciones, cristales, ópticas y pasos de rueda propios.
- Se comprobó el acabado rojo, el despiece al 100 %, el giro manual y la selección de motor/transmisión. Cambiar de modelo restablece el ensamblado y conserva el acabado.
- No aparecieron errores o advertencias de renderizado en la consola durante la revisión. La compilación `tsc -b && vite build` finalizó correctamente.
- Se corrigió el registro Git de la carpeta del proyecto: pasa de un enlace de submódulo sin configuración a archivos normales, para que el repositorio incluya código, documentación, recursos y Docker.

La comprobación nueva corresponde al navegador de escritorio del equipo; no sustituye una prueba de rendimiento en teléfonos ni convierte los modelos visuales en geometrías técnicas.

La captura [preview-modelos-3d.png](preview-modelos-3d.png) documenta la Hilux ensamblada y el selector de modelos en la versión WebGL.

## Validaciones pendientes del producto definitivo

El prototipo no valida inventario en tiempo real, integración Quiter/Hathor, CRM, pagos, reservas, acceso al CMS, exactitud de un catálogo técnico ni derechos de uso de activos para publicación comercial. Tampoco constituye una auditoría de seguridad, una prueba de carga ni una certificación de accesibilidad.

La geometría del SUV es conceptual. Para un catálogo de repuestos deberán verificarse modelo, año, versión, VIN, identificadores OEM y correspondencia entre cada malla y la referencia comercial. La interfaz no presenta esta geometría como instrucciones de reparación.
