# CMS para mercadeo · Alcance del MVP

## Objetivo y alcance de la demostración

Mercadeo debe poder **cargar, agregar, modificar y retirar vehículos nuevos y usados** desde un panel de administración. Esta capacidad pertenece al MVP, junto con la experiencia pública y las integraciones. El catálogo público actual de [nuevos](https://autoamerica.com.co/home/) y [usados](https://autoamerica.com.co/usados-toyota/) sirve como base de contenidos y recorridos; no se ha accedido a su administración privada.

**AdminCMS es una prueba funcional en React.** Los cambios se mantienen en memoria de la pestaña y se reinician al recargar. No hay login real, permisos de servidor, almacenamiento persistente ni Strapi desplegado. Roles, auditoría y sincronización descritos aquí son requisitos del producto definitivo, no capacidades productivas acreditadas por la demostración.

## Entidades y campos

**Vehículos nuevos:** gama/modelo, año y versión serán entidades relacionadas. Cada versión tendrá identificador estable, motorización, transmisión, tracción, características y ficha técnica verificadas. La presentación comercial incluirá título, descripción, galería ordenada, imagen principal, texto alternativo, destacados, llamadas a la acción y metadatos SEO. Precio y disponibilidad se asociarán a la versión y su fuente; un precio “desde” debe derivarse de las versiones vigentes aplicables.

**Vehículos usados:** cada registro representa una unidad de inventario, con identificador empresarial único. Tendrá marca, modelo, año, versión, kilometraje, transmisión, combustible, sede, precio, estado comercial y fotografías de esa unidad. Los identificadores internos para conciliación no se expondrán automáticamente al visitante. Un borrador editorial sin vínculo empresarial no acreditará stock disponible.

Ambos tipos tendrán estado editorial, autor, fechas, motivo de retiro, origen de los datos, versión de contenido y fechas de sincronización. Las imágenes conservarán orden, descripción y datos de autorización; los activos 3D tendrán versión y configuración de vehículo asociada.

## Matriz de propiedad de datos

| Campo o función | Mercadeo desde el CMS | Sistema empresarial / integración |
| --- | --- | --- |
| Texto comercial, SEO, destacados y orden | Crear y modificar | Conservar sin sobrescribir |
| Galería editorial e imagen principal | Cargar, ordenar, reemplazar y retirar | Fotografías importadas separadas; no borrar selecciones editoriales |
| Modelo, año, versión y características | Crear borradores; completar campos editoriales con soporte técnico | Datos sincronizados se corrigen en su fuente o mediante procedimiento autorizado |
| Precio, stock, reserva y venta | Consultar fuente y vigencia; solicitar corrección | Fuente de verdad para registros vinculados |
| Estado publicado/retirado | Publicador decide visibilidad editorial | Respeta retiro manual; aplica restricciones por baja comercial confirmada |
| Identificadores y vínculo externo | Consulta según rol | Administrador gestiona conciliación; no se alteran durante ediciones ordinarias |
| Credenciales, endpoints y reglas técnicas | Sin acceso editorial | Administración técnica con permisos separados |

Si una familia de nuevos requiere precio manual, se declarará expresamente esa fuente, con aprobación, vigencia y auditoría. No se mezclará con un precio sincronizado sin una regla de precedencia. Se confirmará qué aporta Quiter, qué aporta Hathor y qué información exige otra fuente.

## Roles y flujo editorial

- **Editor de mercadeo (rol personalizado):** crea borradores, carga galerías y modifica contenido; solicita revisión. No se utilizará sin ajustes el rol Editor incorporado de Strapi, que también permite publicar.
- **Publicador:** revisa exactitud y derechos, publica, retira y autoriza republicaciones.
- **Administrador:** configura usuarios, roles, esquemas y reglas de integración. Las tareas cotidianas de mercadeo no requieren este rol.

El flujo es **borrador → publicado → retirado**. La publicación comprobará campos obligatorios, imágenes, configuración y vínculo de inventario cuando aplique. Retirar ocultará la ficha con motivo registrado; no eliminará la unidad del sistema empresarial. Restaurar recuperará una revisión como borrador y requerirá una nueva aprobación para publicar.

La auditoría registrará actor, fecha, acción, campos anteriores/nuevos y motivo. Se acordarán retención y permisos de consulta. Restaurar una versión editorial no restaurará precios antiguos ni revertirá ventas o reservas del sistema de origen. Se verificará la edición y el licenciamiento de Strapi necesarios para implementar estas funciones.

La documentación oficial de Strapi distingue [permisos del panel](https://docs.strapi.io/cms/features/rbac), [borradores y publicación](https://docs.strapi.io/cms/features/draft-and-publish) y [funciones según plan](https://docs.strapi.io/cms/features). Content History requiere Growth o Enterprise; Review Workflows y Audit Logs requieren Enterprise. El historial editorial de Content Manager no registra por sí solo escrituras realizadas desde las APIs: la trazabilidad de las integraciones necesitará un mecanismo propio. Las aprobaciones avanzadas o alternativas personalizadas se incluirán en el presupuesto; alojamiento y licencia son decisiones separadas.

## Sincronización y conflictos

Separar datos importados, contenido editorial y control de visibilidad. Actualizar por identificador externo estable, con validaciones y ejecución idempotente. Una importación repetida no creará duplicados. Las galerías o textos editados por mercadeo no se reemplazarán con los valores de la siguiente importación.

El retiro manual mantendrá una restricción editorial persistente: importar nuevamente la unidad no la republicará. Una venta o baja comercial confirmada impedirá presentarla como disponible. La ausencia en una respuesta incompleta no se interpretará automáticamente como eliminación.

Ante fallo se conservará el último dato válido, mostrando su antigüedad y alertando a operación. Reservas y compras exigirán revalidar disponibilidad. El panel permitirá distinguir conflicto editorial, error de integración y dato pendiente de completar.

## Criterios de aceptación

1. Mercadeo crea un nuevo con versiones y un usado por unidad, carga galerías y solicita revisión sin intervención técnica.
2. El servidor rechaza publicación o cambios fuera del rol, incluso si se elude la interfaz.
3. Publicar y retirar actualiza catálogo, búsqueda y caché según el comportamiento acordado.
4. Una sincronización cambia precio/stock sin sobrescribir contenido editorial; una unidad retirada manualmente permanece retirada.
5. Restaurar recupera contenido como borrador, conservando el estado comercial vigente.
6. Cambios y errores quedan trazables; el catálogo nunca presenta una simulación, un borrador o un dato sin verificar como disponibilidad confirmada.
