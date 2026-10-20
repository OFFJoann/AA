# Plan del proyecto · Autoamérica

**Base:** propuesta de octubre de 2026, revisión pública y resumen del equipo. Este documento define el siguiente desarrollo; no constituye una cotización ni autoriza cambios en producción.

## 1. Objetivo y resultado esperado

Construir una plataforma digital de Autoamérica con una experiencia visual diferenciada para vehículos nuevos, búsqueda eficiente de usados y exploración de sistemas y repuestos mediante un vehículo tridimensional. **El CMS de mercadeo es un entregable central del MVP:** debe permitir cargar, agregar, modificar, publicar y retirar vehículos nuevos y usados sin intervención del desarrollador. El resultado debe facilitar la elección y el contacto comercial y conservar trazabilidad sobre contenido, precios, disponibilidad y compatibilidad.

La propuesta preserva los recorridos observados: [modelos Toyota](https://autoamerica.com.co/home/), [usados](https://autoamerica.com.co/usados-toyota/), [posventa](https://autoamerica.com.co/servicios-posventa/), [repuestos](https://autoamerica.com.co/repuesto/) y [sedes](https://autoamerica.com.co/sedes-y-horarios/). La migración debe inventariar también formularios, pagos, financiación, contenidos legales, campañas y enlaces externos.

## 2. Demostración actual y producto definitivo

| Demostración entregada | Desarrollo necesario para producción |
| --- | --- |
| React, TypeScript y Vite; fotografías oficiales y contenido local | Frontend productivo, gestión editorial y estrategia SEO |
| Panel AdminCMS de prueba; cambios mantenidos en el estado React de la pestaña | CMS persistente, acceso autenticado, roles, flujo editorial, auditoría y restauración |
| Cinco modelos destacados y cuatro usados de una captura pública | Catálogo normalizado, sincronizado y con vigencia visible |
| SUV conceptual; giro, cambio de acabado, despiece y cinco sistemas | Modelo autorizado y validado para una configuración comercial específica |
| Alternativa SVG cuando WebGL no está disponible | Validación gráfica y de rendimiento en dispositivos reales |
| Comparación general y solicitud simulada | Versiones comparables, leads trazables y conexión con canales comerciales |
| Enlaces hacia servicios existentes | Integraciones acordadas y pruebas funcionales de cada recorrido |

La muestra de usados corresponde al 19 de octubre de 2026 y no acredita disponibilidad actual. El formulario no envía ni conserva información. El AdminCMS es una simulación funcional: sus cambios viven en memoria durante la pestaña y se reinician al recargar; no hay login real, permisos de servidor ni Strapi desplegado. El despiece conceptual no identifica referencias OEM ni proporciona instrucciones de reparación. Las comprobaciones y sus limitaciones están registradas en `validacion.md`.

### Administración incluida en el MVP

El catálogo de **nuevos** se organizará por gama/modelo, año y versión; el de **usados**, por unidad de inventario con identificador estable. Mercadeo administrará descripciones, galerías, imagen principal, características verificadas, destacados, orden, enlaces y SEO. Una ficha nueva podrá comenzar en borrador antes de completar su vínculo con el sistema empresarial.

Se definirán los roles **editor**, **publicador** y **administrador**, con estados **borrador → publicado → retirado**. Retirar será una baja editorial reversible, con motivo y autor. Restaurar recuperará el contenido como borrador; no reactivará automáticamente la publicación ni acreditará disponibilidad.

Precio y stock conservarán una fuente de verdad declarada por campo y tipo de vehículo. Quiter/Hathor no sobrescribirán textos, galerías u otros campos propiedad de mercadeo. Un retiro manual persistirá aunque la integración vuelva a importar la unidad; su republicación requerirá actuación explícita del publicador. El alcance de campos, flujo y aceptación se desarrolla en `cms-mercadeo.md`.

## 3. Piloto: un vehículo, un año y una versión

Seleccionar conjuntamente con ventas y posventa **una configuración exacta**. Prado puede evaluarse como candidato visual; la decisión depende de disponibilidad de activos y datos técnicos, no solo de preferencia comercial.

El piloto abarcará carrocería, motor y transmisión, frenos, suspensión y sistema eléctrico. Dentro de cada sistema se acordará una lista cerrada de componentes identificables. “Cinco sistemas” no significa modelar todas las piezas del vehículo.

El recorrido será: elegir configuración, observar el vehículo, abrir progresivamente sus conjuntos con scroll o controles manuales, seleccionar una pieza, consultar su descripción y solicitar asesoría con ese contexto. El usuario podrá continuar la navegación sin completar la animación.

Antes de modelar se necesitan:

- Archivos CAD o modelos 3D con autorización de uso, modificación y distribución web; alcance territorial y comercial documentado.
- Catálogo técnico o fuente autorizada que relacione piezas, referencias y configuraciones compatibles.
- Criterio de validación por VIN y responsable de resolver sustituciones de referencia, variantes y excepciones.
- Responsable de posventa para aprobar la correspondencia visual y técnica; responsable comercial para aprobar textos y conversión.

El [concesionario virtual actual](https://autoamerica.com.co/concesionario-virtual/) incluye recorridos externos de SpinCar. Estos recursos no acreditan la existencia de modelos CAD desmontables; cualquier reutilización requiere revisar versión, contrato y derechos.

## 4. Relación entre geometría y catálogo

Mantener identificadores independientes del nombre visible y del archivo gráfico:

**Malla → pieza canónica → referencia OEM → compatibilidad → inventario.**

| Nivel | Información y validación requerida |
| --- | --- |
| Malla | Identificador estable del objeto, versión del activo, sistema y punto seleccionable |
| Pieza canónica | Identificador interno, nombre, descripción y relación con su conjunto |
| Referencia OEM | Código autorizado, fabricante y relaciones de sustitución documentadas |
| Compatibilidad | Modelo, año, versión y reglas aplicables; comprobación por VIN cuando corresponda |
| Inventario | Fuente, sede, disponibilidad, precio, moneda y fecha de sincronización |

Una malla puede relacionarse con varias referencias según la configuración. La API resolverá esa relación; el parecido visual no determinará compatibilidad. Si faltan datos, la interfaz mostrará “requiere validación” y permitirá consultar al asesor. No habilitará una reserva o compra automática sin verificar la referencia y su disponibilidad.

## 5. Arquitectura objetivo

Se propone **React con Next.js** para el portal productivo, con contenido indexable y carga gradual del visor. El adaptador y alojamiento del frontend se validarán antes de cerrar el diseño. Cloudflare cubrirá el perímetro y distribución de contenido; los activos 3D e imágenes usarán almacenamiento y caché con versiones.

**Strapi será el CMS central del MVP**, con administración de vehículos nuevos y usados, galerías, versiones, características, campañas, sedes y SEO. Sus roles y flujo editorial se aplicarán en el servidor. La persistencia separará datos empresariales de contenido editorial, con reglas explícitas de propiedad de campos. Se implementarán auditoría, historial y restauración; la edición y licencias de Strapi requeridas se confirmarán. Mercadeo no editará credenciales ni sustituirá silenciosamente precios o inventario sincronizados.

Una **API propia** expondrá catálogo, compatibilidad y solicitudes. Los adaptadores **Quiter y Hathor** consolidarán la información en PostgreSQL, según los contratos e interfaces que se confirmen. No se presupone que estas dos fuentes aporten referencias de repuestos o validación VIN: esa capacidad debe verificarse separadamente.

AWS alojaría API, CMS e integraciones en contenedores, con ECR, ECS Fargate y RDS PostgreSQL. EventBridge iniciaría sincronizaciones; se definirán reintentos, cola de errores, alertas y reconciliación. Secrets Manager, permisos por componente y registros operativos protegerían el acceso y permitirían seguimiento. La conectividad privada y la combinación Cloudflare Tunnel/Access se probarán con el diseño real.

Un fallo de sincronización conservará el último dato válido con su antigüedad visible. Las operaciones que dependan de disponibilidad vigente deberán revalidarla. Desarrollo, pruebas y producción tendrán datos, secretos y almacenamiento separados.

## 6. Hitos y criterios de aceptación

| Hito | Evidencia necesaria para avanzar |
| --- | --- |
| Alcance aprobado | Inventario de rutas y recorridos; responsables; configuración piloto y lista de piezas; fuentes y permisos identificados |
| Experiencia validada | Ventas, mercadeo y posventa completan catálogo, comparación, exploración y solicitud en escritorio y móvil |
| Piloto 3D aprobado | Cada pieza seleccionable resuelve el identificador esperado; geometría y compatibilidad aprobadas; controles manuales y alternativa gráfica utilizables |
| Integraciones disponibles | Altas, cambios, retiro de inventario, errores y datos vencidos producen el resultado acordado, con evidencia y alertas |
| CMS de mercadeo listo | Crear/modificar/retirar/restaurar nuevos y usados; galerías y versiones; roles aplicados por servidor; auditoría; importaciones preservan cambios editoriales y retiros manuales |
| Lanzamiento autorizado | Migración SEO, formularios, accesibilidad, rendimiento, respaldos, observabilidad y rollback verificados en el ambiente acordado |

La validación incluirá navegadores con WebGL, pérdida de contexto gráfico, movimiento reducido y teléfonos representativos. Antes de aprobar el piloto se fijarán presupuestos de descarga, memoria y fluidez, y se medirán con activos reales. La publicación se realizará por etapas, conservando un procedimiento probado de retorno al portal anterior.

## 7. Presupuesto y cronograma por definir

Cotizar y calendarizar después de confirmar número de modelos, versiones, piezas y acabados; estado y licencia de los activos; trabajo de modelado y optimización; volumen editorial; usuarios y licenciamiento del CMS, aprobaciones y retención de auditoría; alcance SEO; contratos y límites de las APIs; catálogo VIN/OEM; CRM y formularios; pagos o reservas; idiomas; disponibilidad requerida y soporte posterior.

El cálculo de infraestructura incorporará tráfico, peso de imágenes y modelos, caché, almacenamiento, transferencia, sincronizaciones, tareas permanentes, base de datos, respaldos, registros y conectividad saliente. El plan Cloudflare existente no demuestra que todos los servicios propuestos estén incluidos.

El siguiente compromiso es aprobar el piloto y reunir activos, documentación y responsables. Con esas dependencias comprobadas se elaborarán una estimación desglosada, entregas y criterios de cierre; las cifras previas se conservarán como antecedentes de planeación.
