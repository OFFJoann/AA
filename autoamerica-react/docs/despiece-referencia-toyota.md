# Despiece: Toyota.com como referencia, Toyocar como fuente auxiliar

## Lo confirmado y lo que falta

El usuario corrigió que el visor objetivo es Toyota.com y no el visor de Autoamérica. Se verificaron vistas exteriores rotatorias y tours interiores de Toyota. No se obtuvo ni identificó un recurso editable GLB/FBX/OBJ en las páginas accesibles. Una imagen exterior referenciada por Corolla Cross termina en `5.png` dentro de `.../2026/corollacross/.../36/`; su descarga devolvió HTTP 403. Esto demuestra una referencia raster, no permite concluir toda la arquitectura del visor. No se eludió el bloqueo ni se extrajo una malla.

Es incorrecto afirmar que basta con añadir un deslizador al visor oficial: una secuencia de fotos exterior, un panorama de interior y un modelo geométrico desmontable son activos diferentes. Incluso un GLB exterior puede no contener motor, frenos, transmisiones o interiores ocultos.

El trabajo comercial correcto es obtener un activo de modelo/generación/año/versión aprobado para Autoamérica, o encargar/modelar una reproducción propia. Una reconstrucción desde fotos es interpretativa y debe identificarse como tal, no como CAD oficial, geometría exacta ni manual de reparación.

## Inventario Toyocar

Se consultaron categorías de Land Cruiser/Prado y Hilux. El sitio publica productos de años y versiones diferentes. Una categoría "Prado TX" no certifica compatibilidad con la Prado nueva.

Dos ejemplos registrados como referencias documentales, sin precios ni enlaces de compra en la interfaz:

- Cerradura trasera izquierda `69060-33120`: la publicación declara Prado TX 2010-2020 y 4Runner 2009-2013.
- Rejilla delantera `53112-0K160`: la publicación declara Hilux Revo 2015-2024.

No se asignó ninguna de ellas al modelo nuevo. No se importaron fotografías de Toyocar como geometría. La muestra de `modelos-3d-referencias.json` NO es un barrido exhaustivo del inventario, ni una homologación OEM.

Fuentes:
https://toyocar.com.co/categoria-producto/repuestos-para-land-cruiser/prado-tx/
https://toyocar.com.co/categoria-producto/hilux/revo/
https://toyocar.com.co/producto/cerradura-trasera-izquierda-toyota-prado-tx-10-20-4runner-09-13-69060-33120/
https://toyocar.com.co/producto/rejilla-de-bomper-toyota-hilux-revo-15-24-53112-0k160/

## Contrato para el modelo real

Entregar por modelo: identificador interno, año, mercado, versión, motor, unidad/escala, ejes y origen; archivo GLB con texturas autorizadas; objetos separables nombrados de forma estable; referencias de soporte de la geometría y permiso de modificación/redistribución web.

Cada pieza necesita: id, sistema, nombre visible, nodo/malla, transformación original, trayectoria de separación, nivel de detalle, fuente, validación de compatibilidad y referencia OEM solo cuando esté comprobada. No inferir piezas porque exista un nombre en una lista ni confundir los nodos gráficos con piezas físicas.

Jerarquía propuesta para revisar con posventa: carrocería y cierres; cristales; iluminación; asientos y tablero; climatización; motor y admisión; refrigeración; combustible; transmisión y tracción; frenos; dirección; suspensión; ruedas; electrónica e híbrido cuando aplique. Esta es taxonomía de trabajo, no inventario confirmado de Toyota ni del proveedor.

Primero separar conjuntos completos, después subconjuntos de un sistema. Cargar detalle por demanda; no cargar cientos de piezas de cuatro vehículos simultáneamente. Calcular el despiece desde posiciones originales y progreso absoluto para poder reensamblar sin deriva. Revisar pivotes, transparencias, jerarquías y colisiones. La secuencia visual NO indica un orden seguro de desmontaje real.

## Herramienta de inspección que sí se incluye

Con un GLB obtenido de una fuente autorizada, ejecuta en PowerShell/Windows, usuario normal, carpeta `autoamerica-react`:

```powershell
node .\scripts\inspeccionar-glb.mjs "RUTA_REAL_DEL_MODELO.glb"
```

Es de solo lectura. Imprime nodos/mallas, cantidad de primitivas, jerarquía, advertencias de nombres repetidos y referencias externas. No descarga archivos, no modifica el modelo, no copia activos, no crea un despiece y no certifica compatibilidad. `physicalPartsVerified` permanece en cero: tener muchos nodos no demuestra tener todas las piezas correctas.

El inspector verifica estructura básica GLB 2.0 y rechaza contenedores truncados e índices/ciclos inválidos. No es un validador glTF completo ni inspecciona superficies, textura, fidelidad, animaciones o datos de geometría comprimida.

Criterio de entrada para integrar el despiece: archivo real, permisos de uso, piezas nombradas, compatibilidad documentada y prueba gráfica con la versión de Three.js del proyecto. El renderer conceptual actual se conserva hasta entonces. No se ha sustituido por un Toyota copiado.
