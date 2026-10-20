# Revisión de imágenes: Toyota en nuevos, usados multimarca

Fecha: 20/10/2026. La revisión utilizó los archivos del ZIP, su manifiesto heredado, decodificación y observación visual. La página oficial del lanzamiento Prado sigue disponible. No fue posible descargar nuevamente todos los archivos de origen para comparar bytes. Por ello **procedencia registrada no equivale a verificación independiente completa ni a licencia de redistribución**.

## Decisiones aplicadas

| Recurso | Decisión |
|---|---|
| `hero.webp`, `hero-road.webp`, `prado-interior.webp` | Reutilizados del ZIP; procedencia registrada de Autoamérica / Prado 250. Se señalan como material comercial de referencia de lanzamiento, no fotografía de una versión 2026 confirmada. |
| `prado.webp`, `corolla-cross.webp`, `hilux.webp`, `yaris-cross.webp` | Material de producto heredado con fuente Autoamérica. No se mezclan interiores ni se añaden acabados por IA. Año/versión y derechos requieren aprobación de mercadeo. |
| `rav4.webp` | Retirado de las referencias activas: no se confirmó correspondencia visual con RAV4. `photo-pending.svg` lo sustituye en nuevos y selector del visor. |
| `used-rav4.webp`, `used-fortuner.webp` | Archivos idénticos con imagen genérica, no fotos demostrables de dos unidades diferentes. Las tarjetas muestran una reserva de fotografía, no un Toyota arbitrario. |
| `used-yaris.webp`, `used-corolla.webp` | Fotografías heredadas enlazadas al origen de las unidades del inventario de muestra. No se comprobó vigencia de esos anuncios. |
| Logos, taller y repuestos | Se conservan fuentes originales en el manifiesto; ninguna fuente heredada supone autorización comercial nueva. |
| `photo-pending.svg` | Icono y texto originales, sin representar un vehículo ficticio. |

Los archivos dudosos permanecen en el archivo histórico por trazabilidad, pero `safeImage` bloquea sus rutas y el selector de imágenes comerciales ya no los ofrece. Eliminarlos de la exportación no era necesario y habría dificultado revisar el cambio.

**Usados:** se admiten Toyota, Mazda, Renault u otras marcas reales. La regla es que la fotografía sea la unidad anunciada y cuente con permiso de uso. Una foto oficial de un modelo nuevo no identifica el estado real de un usado. No se añadieron marcas ficticias a la muestra para simular inventario.

**Nuevos y portada:** mantener Toyota y fotografías oficiales autorizadas del modelo, generación y mercado correctos. Una revisión automática de una URL no determina la marca de lo que contiene: la aprobación de mercadeo sigue siendo necesaria.

Consulta `public/assets/asset-review.json`: hash local, uso, estado, origen registrado y tareas pendientes. El antiguo `asset-manifest.json` se conserva sin alterar como evidencia de la exportación original.

## Aprobación antes de publicación

Comprueba con Toyota/Autoamérica el modelo y la versión, el mercado colombiano, el permiso de uso y el texto alternativo. Para usados contrasta inventario e identificación interna sin publicar datos sensibles innecesarios. Registra revisor y fecha. Añade interiores propios para cada modelo, no interiores de Prado en una Hilux/RAV4.

Fuentes: página oficial https://autoamerica.com.co/nueva-land-cruiser-prado-250/ y URLs originales consignadas en el manifiesto del ZIP. Material fotográfico no generado por IA.
