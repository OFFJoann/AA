> **EXPORT CONSOLIDADO 20/10/2026:** [guía vigente](docs/exportacion-consolidada.md). Incluye Landing Motion, rutas independientes y el visor fotográfico Corolla Cross con el ID corregido. Las imágenes 360 locales y videos oficiales no están en este ZIP. La documentación posterior se conserva como historial.

> **Actualización 20/10/2026: páginas separadas y fichas por sistemas.** Consulte [docs/entornos-y-cinematica.md](docs/entornos-y-cinematica.md) y las limitaciones de validación de esta entrega. La documentación anterior se conserva como historial.

> **Actualización Red & Black, 20/10/2026.** Consulta primero [la entrega actual](docs/entrega-red-black.md) y [sus pruebas y limitaciones](docs/validacion-red-black.md). El contenido posterior es la documentación histórica de la base; sus verificaciones de compilación no certifican esta actualización. No se modificaron dependencias ni Docker.

# Autoamérica — Tu próximo camino

Proyecto portable en **React + TypeScript + Three.js**, construido con Vite. Contiene la propuesta navegable de Autoamérica y su CMS de demostración. Fecha de referencia: 19 de octubre de 2026.

Para cargarlo a tu repositorio, sigue [GIT_IMPORT.md](GIT_IMPORT.md). Esta exportación funciona sin una cuenta de Sites y sin variables de entorno. [EXPORTACION.md](EXPORTACION.md) registra su versión de origen y los ajustes de portabilidad.

## Qué incluye

- Portada editorial con fotografía oficial de Autoamérica.
- Cinco modelos destacados, filtros por categoría, fichas y comparación general entre dos gamas.
- SUV conceptual 3D, despiece controlado por desplazamiento y deslizador, selección de cinco sistemas, colores y giro.
- Vista alternativa cuando el navegador no dispone de WebGL.
- Cuatro usados tomados del catálogo público, con filtros, ordenación y favoritos durante la sesión.
- Posventa, acceso a páginas oficiales y sedes con esquema de ubicación.
- Formularios simulados sin envío ni persistencia de datos.
- Panel «Propuesta interactiva» con visión, arquitectura objetivo, ruta y fuentes.
- Administración de mercadeo con creación, edición, imagen principal, publicación y retiro de nuevos/usados. Los cambios se reflejan en el catálogo de esta pestaña.

## Probar la administración

Abre **Propuesta interactiva → CMS de mercadeo → Abrir administración de vehículos**, o el enlace **Administrar catálogo** del pie de página. Crea una ficha, guárdala como borrador, publícala y usa la vista del sitio para comprobar el cambio. Retirar un vehículo lo oculta del catálogo sin eliminar su registro de la demo.

Este panel demuestra el flujo editorial. Los cambios y las imágenes seleccionadas solo permanecen en memoria de la pestaña: se reinician al recargar. No es un CMS productivo ni simula un inicio de sesión seguro. Persistencia, usuarios, permisos de servidor, galerías completas e integraciones corresponden al alcance descrito en `docs/cms-mercadeo.md`.

## Ejecutar en un equipo de desarrollo

**Prerrequisitos:** Node.js 22.12 o posterior compatible con Vite 7, npm y acceso a su registro. No se requieren credenciales AWS, CMS ni bases de datos para esta demo.

En Bash, PowerShell o una terminal compatible, desde la raíz de este proyecto y con un usuario sin privilegios administrativos:

```bash
npm ci
npm run dev
```

La aplicación se sirve en el puerto 4173. El script de desarrollo escucha en `0.0.0.0`; en un entorno compartido, limitarlo a `127.0.0.1` si no se necesita acceso desde otros equipos. No es un servidor de producción.

Comprobación TypeScript y compilación estática:

```bash
npm run typecheck
npm run build
```

La compilación deja el sitio en `dist/`. `package-lock.json` fija las versiones resueltas. Las fuentes tipográficas tienen alternativas del sistema y se solicitan a Google Fonts.

## Estructura

| Ruta | Responsabilidad |
| --- | --- |
| `src/App.tsx` | Navegación, catálogo, experiencia de repuestos, sedes, modales y propuesta |
| `src/data.ts` | Modelos, sistemas, sedes y fuentes públicas |
| `src/components/VehicleScene.tsx` | Escena WebGL y despiece conceptual |
| `src/components/VehicleFallback.tsx` | Proyección interactiva para navegadores sin WebGL |
| `src/catalog.ts` | Tipos, muestra inicial y publicación del catálogo |
| `src/components/AdminCMS.tsx` | Administración de vehículos de demostración |
| `src/styles.css` | Diseño adaptable y movimiento reducido |
| `public/used-vehicles.json` | Muestra de cuatro usados, con fecha y enlace oficial |
| `public/assets/asset-manifest.json` | Origen, dimensiones y notas de cada activo |
| `public/assets/existing-360.json` | Experiencias externas identificadas en el sitio actual |
| `public/project-review.json` | Cobertura pública y fuentes de la revisión |
| `docs/inventory.csv` | 373 URLs declaradas en 13 sitemaps |
| `docs/revision-publica.md` | Hallazgos y limitaciones de la revisión |
| `docs/cms-mercadeo.md` | Modelo editorial, roles, campos y reglas de sincronización |
| `docs/plan-del-proyecto.md` | Piloto, arquitectura objetivo, hitos y dependencias |
| `docs/validacion.md` | Recorridos comprobados y límites de la validación |

## Alcance y límites

El modelo es una **geometría original de referencia visual**, inspirada en el exterior de la Land Cruiser Prado 250 de `public/assets/prado.webp` y la [galería de Autoamérica](https://autoamerica.com.co/vehiculo/toyota-prado/). Incluye carrocería perfilada, pasos de rueda angulares, ópticas, parrilla, cristales inclinados, neumáticos con banda de rodadura y rines de radios dobles. Conserva la selección de sistemas, acabados, giro y despiece progresivo.

El selector **Modelo** del explorador permite alternar entre Prado, Corolla Cross HEV, Hilux, Yaris Cross HEV y RAV4 HEV. Cada carrocería toma como referencia su fotografía del catálogo: Hilux incluye doble cabina y platón abierto; los crossover tienen distintas siluetas de techo, cristales, parrillas y ópticas. Al cambiar de modelo se ensambla el vehículo y se detiene el giro; se conserva el acabado elegido. `src/vehicleModels.ts` concentra las proporciones visuales y `src/components/vehicleExterior.ts` construye los exteriores adicionales. La consulta de repuestos incluye el modelo seleccionado.

Sin WebGL, Prado conserva su alternativa esquemática SVG; los otros modelos muestran su fotografía de referencia e indican que el giro y el despiece requieren WebGL.

El visor comienza ensamblado en modo manual. Incluye vistas 3/4, frontal, lateral y trasera, reinicio de cámara y comparación con la fotografía del catálogo. El despiece utiliza trayectorias compartidas en `src/components/explosionLayout.ts`: extracción lateral antes de elevar paneles, techo/capó antes de la mecánica y ruedas después de liberar la carrocería. La selección conserva los materiales exteriores y resalta suavemente los sistemas mecánicos. Prado e Hilux muestran una batería de 12 V esquemática; los HEV, un módulo compacto.

La sección de sedes incluye Google Maps por dirección, seis puntos de atención, enlaces de rutas y alternativa para abrir el mapa externamente. Las direcciones se contrastaron con [Sedes y horarios de Autoamérica](https://autoamerica.com.co/sedes-y-horarios/) el 20 de octubre de 2026. En Oriente se localiza el centro comercial Jardines Llanogrande, donde está el taller. La cartografía requiere internet y queda sujeta al servicio de Google; no se solicita geolocalización al visitante ni se inventan coordenadas.

En **Administrar catálogo → Iniciar tour asistido**, una guía de seis pasos acompaña la edición, las fotos, la vista previa y la publicación. Se puede cerrar con Escape, retroceder o terminar conservando la edición pendiente. El tour nunca guarda ni publica por sí solo. El CMS continúa siendo una demostración en memoria.

Para verificar las holguras de las trayectorias: `npm test` con Node 24. Las pruebas muestrean las separaciones relevantes; no son una simulación física ni una certificación de ausencia de intersecciones entre todas las mallas.

Es una aproximación visual, no un modelo CAD ni una reproducción exacta de una versión Toyota. La mecánica y su disposición siguen siendo esquemáticas: no valida referencias OEM, compatibilidad VIN, dimensiones, torques ni procedimientos. Su finalidad es validar interacción y diseño antes de adquirir o producir activos técnicos autorizados.

Los usados reflejan una captura pública, no una integración en vivo. Sus datos, fotografías, precios y disponibilidad deben confirmarse con el concesionario. No se realizan reservas ni pagos. Los formularios solo modifican estado en memoria; no transmiten datos.

Quiter, Hathor, Strapi, CRM, autenticación y servicios AWS/Cloudflare empresariales forman parte de la arquitectura objetivo del proyecto, no de esta demostración. El código no incluye secretos ni consultas a los sistemas privados.

Se inventariaron 373 URLs declaradas en 13 sitemaps: 359 produjeron HTML legible y 14 rutas transaccionales o internas se excluyeron. Dentro de esa cobertura se revisaron temáticamente 112 páginas prioritarias, incluidas 19 fichas de nuevos. Nueve URLs redirigen a otros destinos: se observaron 350 destinos finales distintos. No constituye auditoría de seguridad, validación de transacciones ni medición de rendimiento productivo.

## Evolución recomendada

1. Validar el concepto con mercadeo, ventas, posventa y usuarios de móvil.
2. Seleccionar un modelo, año y versión piloto; confirmar derechos y disponibilidad de CAD/GLB.
3. Separar mallas por piezas o sistemas, asignar identificadores estables y optimizar texturas/LOD.
4. Diseñar el catálogo de compatibilidad y el proceso de validación VIN. La animación debe representar referencias reales verificadas.
5. Implementar el CMS de mercadeo con alta/edición/publicación/retiro, roles efectivos, persistencia y medios; conectar API, adaptadores Quiter/Hathor, control de frescura y observabilidad. Las importaciones deben preservar contenidos editoriales y retiros manuales.
6. Preparar renderizado estático o de servidor para SEO, mapa de redirecciones y contenido estructurado.
7. Probar rendimiento, accesibilidad, analítica, formularios y disponibilidad antes de un lanzamiento gradual con rollback.

El presupuesto del documento aportado no fue validado ni convertido en una oferta comercial. Deben incluirse modelado, licencias, integraciones, nube y mantenimiento según alcance acordado.


Actualizacion Landing Motion: consultar `docs/landing-motion-y-360.md`. Videos y modelo 3D Toyota original NO incluidos; ver limites y validacion antes de publicar.
