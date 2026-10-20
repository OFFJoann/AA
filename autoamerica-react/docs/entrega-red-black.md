# Autoamérica — entrega Red & Black

Fecha: 20 de octubre de 2026. Base: el archivo `AA-main.zip` proporcionado en esta conversación. No se accedió al estado actual de GitHub ni se hizo push a `main`.

## Resultado incorporado en el código

| Componente | Implementación |
|---|---|
| Portada | Hero fotográfico Prado, jerarquía editorial, acentos rojos, entradas suaves y accesos comerciales. |
| Identidad | Variables semánticas rojo/negro/blanco y fondos neutros; interruptor claro/oscuro con preferencia local. El rojo es una propuesta que mercadeo debe aprobar. |
| Nuevos | Carrusel de los cinco modelos de la base; categorías, flechas, teclado, gesto táctil, miniaturas, cotización y comparación. No obliga a recorrer todas las fichas. |
| Detalle | Ruta `#vehiculo/<id>`, escenas vinculadas al scroll, acceso directo a ficha, control de movimiento y botones comerciales existentes. |
| Usados | **Multimarca**; buscador, filtros combinados por marca/modelo/transmisión/combustible/carrocería/sede; rangos de precio, año y km; certificación explícita, favoritos, chips, orden, paginación y búsqueda compartible por URL. |
| Comparador | Hasta dos nuevos o usados; tabla, resaltado de diferencias, opción de mostrar solo diferencias, quitar selecciones y cotizar. No inventa atributos faltantes. |
| CMS | Se preservan CRUD y tour. Se añaden marca, modelo y estado de certificación; los filtros reciben esos datos. |
| Sedes | Selector y filtro por servicio, direcciones, horarios, iframe real de Google Maps bajo activación del visitante, botones de búsqueda y cómo llegar. |
| Recursos | Revisión de procedencia heredada y visual. Tres imágenes cuestionables se excluyen de los componentes comerciales. No se generaron vehículos con IA. |

El diseño de filtros es propio de Autoamérica. No usa código, logotipos ni interfaces copiadas de TuCarro.

## Alcance que no debe confundirse con producción

1. El inventario inicial sigue siendo **cinco nuevos y cuatro usados de muestra**. Los cuatro usados recibidos son Toyota, pero no hay una restricción Toyota en la búsqueda. Las otras marcas aparecen cuando se agregan registros reales. Los ejemplos Mazda/Renault solo existen en pruebas automatizadas.
2. CMS sin backend: guarda en la pestaña; al recargar se reinicia. Los favoritos y el tema se guardan en el navegador cuando este permite almacenamiento. No hay autenticación ni autorización de servidor.
3. Cotización y simulador originales conservados. No se envían solicitudes reales. La simulación original no incorpora tasas, seguros ni comisiones; no es oferta financiera ni aprobación de crédito.
4. El visor de Javi es conceptual. No se entrega geometría OEM, compatibilidad de repuestos validada, experto IA conectado ni integración Quiter/Hathor.
5. La ficha cinematográfica es fotográfica, no una filmación ni una cámara 3D real. Prado tiene exterior/interior propios. Otros modelos utilizan su exterior y enlazan a la galería; falta material interior autorizado para completar sus escenas.
6. La ficha muestra los campos realmente disponibles. Potencia/dimensiones/equipamiento por versión requieren el trabajo de Johan. No se incorporaron valores ni precios nacionales nuevos obtenidos de páginas ajenas a la muestra.
7. Google Maps: referencias por nombre/dirección, no coordenadas ni Place IDs inventados. El punto de cada sede debe validarse en Google Maps; ver su documento específico.
8. No hay despliegue productivo ni nueva URL publicada. El sitio previamente publicado no fue actualizado.
9. Esta entrega mantiene Vite y rutas de fragmento. SEO/SSR, analítica, consentimiento completo, servicios de datos y migración siguen pendientes. `noindex` permanece activado.

## Preservación del trabajo existente

`package.json`, `package-lock.json`, Dockerfile, compose, nginx y los archivos del tour y del renderer 3D no se sustituyeron. Las funciones `QuoteForm`, `CreditSimulator` y `Explorer` del archivo App se conservaron textualmente. La composición de App, los estilos y los datos sí cambiaron. Una coincidencia de hashes no equivale a una prueba de ejecución en Docker/WebGL.

Se utilizó CSS, IntersectionObserver y requestAnimationFrame para las escenas. No se agregaron GSAP ni nuevas dependencias. La escena que está fuera de vista no recalcula su geometría en cada desplazamiento.

## Paquetes

**Proyecto completo:** para revisar en una carpeta independiente. No contiene `.git`, `node_modules` ni `dist`. No reemplaces manualmente toda tu copia colaborativa.

**Actualización segura:** archivos modificados y nuevos, manifiesto con hashes y `actualizar-aa.mjs`. Por defecto valida sin escribir. Con `--apply`, exige `main` limpio, revisa que los archivos sean compatibles con la base o con la anterior entrega de mapas y conserva respaldo fuera del repositorio. No ejecuta GitHub, pull, commit, push ni npm.

Consulta `guia-penalver-cambios.md` antes de editar y `validacion-red-black.md` antes de compartir con el equipo.
