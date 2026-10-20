# Guía del export consolidado - Autoamérica

**Corte:** 20/10/2026. **Entrega:** AA-export-completo-consolidado.zip.

## 1. Qué se consolidó

Se tomó la última aplicación completa `AA-landing-motion-completo.zip`,
que ya integra Red & Black, las páginas separadas y Landing Motion. Encima se
incorporaron el componente y CSS del parche de visor 360°. No hay que instalar
ninguno de los parches previos.

**Corrección necesaria:** el parche comparaba `vehicle.id === 'corolla-cross'`,
pero el catálogo y las rutas usan `new:corolla-cross`. Se normaliza el ID con
`modelKey`, conservando la exclusión de contenido editado en mercadeo. Se agregó
un acceso `Exterior 360°` al inicio de la ficha que lleva al visor integrado.

No se cambiaron `package.json`, `package-lock.json`, Dockerfile, compose.yaml,
nginx.conf, el CMS, el tour, filtros, comparador o renderer 3D respecto a la
última base completa. Los hashes se registran en `evidencias-consolidado/`.
No se consultó el GitHub privado: modificaciones del equipo no adjuntadas aquí
no están incorporadas.

## 2. Alcance real

| Funcionalidad | Estado |
|---|---|
| Landing roja y negra, accesos protagonistas | Incluida |
| Páginas Inicio / Nuevos / Usados / Posventa / Sedes | Incluidas |
| Carrusel y fichas cinematográficas | Incluidos; datos y fotos con cobertura parcial |
| Filtros multimarca y comparador | Incluidos |
| Cotización y simulador existentes | Conservados; no servicio financiero conectado |
| CMS y tour | Incluidos, memoria de la pestaña sin persistencia |
| Mapa y enlaces Google | Incluidos, puntos exactos pendientes de validación |
| 360 fotográfico Corolla Cross | Integrado; importa tus 36 JPEG |
| 360 de Prado / Hilux / Yaris Cross / RAV4 | Secuencias no incorporadas |
| Videos oficiales | NO incluidos; `vehicle-backgrounds.json` mantiene `video: null` |
| Despiece 3D | Conceptual, igual que la base, sin piezas OEM reconstruidas |
| Inventario de referencias 360 | Dos secuencias Corolla Cross en URLs; otros modelos pendientes |

Las 36 fotografías validadas por el usuario (1600 × 606) no fueron adjuntadas
a esta conversación. El ZIP no incluye fotogramas de reemplazo. El inspector
GLB y las referencias de Toyocar no crean por sí mismos un modelo desmontable.

## 3. Probar sin tocar AA

**Windows / PowerShell de VS Code. Usuario normal.** Extrae en
`C:\Desarrollo\Autoamerica\Revisiones` y abre `AA-consolidado` en otra ventana.
La carpeta propuesta es nueva; tu repositorio real sigue en
`C:\Desarrollo\Autoamerica\AA`.

```powershell
Set-Location "C:\Desarrollo\Autoamerica\Revisiones\AA-consolidado\autoamerica-react"
```

### Importar tus imágenes ya descargadas

El origen confirmado en esta conversación es:
`C:\Desarrollo\Autoamerica\Recursos360\imagenes\2026-corollacross-hybridse-HD`.
El destino se calcula dentro de ESTA copia de la aplicación; no se toca AA.

Primero, solo lectura:

```powershell
node .\scripts\importar-360-local.mjs --source "C:\Desarrollo\Autoamerica\Recursos360\imagenes\2026-corollacross-hybridse-HD"
```

Comprueba 36 cabeceras JPEG, dimensiones 1600x606, hashes y posibles conflictos.
La validación de cabecera no certifica nitidez, continuidad, versión ni derechos.
Cuando indique que están completas, copia con:

```powershell
node .\scripts\importar-360-local.mjs --source "C:\Desarrollo\Autoamerica\Recursos360\imagenes\2026-corollacross-hybridse-HD" --apply
```

Es una copia local: no descarga, no elimina los originales, no sobrescribe
fotografías distintas y no hace Git. Repetirla conserva las imágenes idénticas.

### Dependencias y pruebas

Usa el Node.js 24 que ya tienes instalado. El lockfile se conserva. No copies
`node_modules` de otra versión ni ejecutes `npm audit fix --force`.
Ejecuta uno por uno y detente si alguno falla:

```powershell
npm ci
```

```powershell
npm run typecheck
```

```powershell
npm test
```

```powershell
npm run build
```

Inicia esta copia en un puerto distinto para no confundirte con el Vite de AA:

```powershell
.\node_modules\.bin\vite.cmd --host 127.0.0.1 --port 4174 --strictPort
```

Abre `http://127.0.0.1:4174/nuevos/corolla-cross`. Pulsa **Exterior 360°**
al inicio. Debe aparecer el Corolla Cross, contador 36/36 tras la precarga,
giro con mouse/dedo y flechas. Prueba pantalla completa y retorno con Escape
cuando el navegador lo permita. La muestra USA está identificada como tal.

Prueba Inicio, Nuevos, Usados, Posventa y Sedes; utiliza Atrás/Adelante y F5
en las rutas. La tabla técnica, cotización, tema, filtros, comparación y tour
deben conservar su comportamiento. No introduzcas datos personales reales.
Conserva errores de consola, salidas de comandos y capturas sin datos sensibles.

## 4. Integrar en main (opcional, después de probar)

No uses `git init` ni borres `.git`; el repositorio ya existe. El ZIP no contiene
un historial nuevo de Git. No reemplaces AA completo mediante el Explorador.

Desde PowerShell, detén Vite y guarda los archivos. Comprueba:

```powershell
Set-Location "C:\Desarrollo\Autoamerica\AA"
git status -sb
```

El integrador admite las imágenes `frame-01.jpg` a `frame-36.jpg` sin seguimiento
en la carpeta de 360 porque no las modifica. Otros cambios locales pendientes
deben conservarse y resolverse con el equipo, no descartarse.

Con el directorio limpio puedes actualizar `main` mediante
`git pull --ff-only origin main`. Si falla o diverge, detente.

Comprueba la integración:

```powershell
node "C:\Desarrollo\Autoamerica\Revisiones\AA-consolidado\integrar-en-repo.mjs" --repo "C:\Desarrollo\Autoamerica\AA"
```

El programa compara cada archivo con los contenidos de las entregas conocidas.
**VERSION DIFERENTE** significa que no se ha escrito nada y hay que revisar las
modificaciones del equipo. No lo evites copiando encima.
Solo con compatibilidad, ejecuta:

```powershell
node "C:\Desarrollo\Autoamerica\Revisiones\AA-consolidado\integrar-en-repo.mjs" --repo "C:\Desarrollo\Autoamerica\AA" --apply
```

El respaldo se guarda en `C:\Desarrollo\Autoamerica\AA-respaldos\...`.
No se modifican HEAD, índice, ramas ni GitHub. Las fotos y otros archivos
fuera del manifiesto se conservan; no es una sincronización con borrado.

**Commit:** revisa `git diff` y `git status`; selecciona solo los archivos que
quieras compartir en VS Code, sin HAR, secretos, respaldos, node_modules o dist.
Repite typecheck, test y build en AA antes del commit.

```powershell
git --no-pager diff --cached --stat
git diff --cached --check
```

Solo con la revisión satisfactoria:

```powershell
git commit -m "feat: consolidar Autoamerica e integrar visor 360 Corolla Cross"
```

`git fetch origin` permite revisar `git status -sb` antes de publicar. Si solo
aparece `ahead`, usa `git push origin main`. Si también aparece `behind`, revisa
la integración de los commits con el equipo y vuelve a probar. No uses force.
El push puede disparar automatizaciones si existen; verifica su configuración.
Las fotos no se incorporan por el integrador: confirma previamente con mercadeo
la publicación y distribución del material estadounidense.

## 5. Restaurar una aplicación del integrador, antes del commit

Usa la ruta exacta que imprimió el programa. Reemplaza `RUTA_DEL_RESPALDO`:

```powershell
node "C:\Desarrollo\Autoamerica\Revisiones\AA-consolidado\integrar-en-repo.mjs" --repo "C:\Desarrollo\Autoamerica\AA" --restore "RUTA_DEL_RESPALDO"
```

Primero valida; añade `--apply` solo si indica restauración compatible. Se
restauran archivos respaldados y se eliminan exclusivamente los archivos nuevos
introducidos por este export que no fueron editados. No borra fotografías.
Se detiene si cambiaste archivos o HEAD desde la aplicación. Si ya hiciste
commit, coordina una reversión Git con el equipo; no uses reset --hard.

## 6. Carpeta de trabajo para Peñalver

| Ruta | Para qué sirve |
|---|---|
| src/pages/HomePage.tsx | Landing y accesos a cada entorno |
| src/components/vehicles/NewVehicleCarousel.tsx | Selección de nuevos |
| src/components/vehicles/VehicleStory.tsx | Capítulos cinematográficos y visor integrado |
| src/components/vehicles/Vehicle360Viewer.tsx | Giro fotográfico de 36 vistas |
| src/styles/vehicle-360.css | Apariencia del visor |
| src/components/used-vehicles/UsedVehicleCatalog.tsx | Filtros y resultados multimarca |
| src/components/vehicles/VehicleCompare.tsx | Comparador |
| src/styles/brand.css | Colores y temas |
| public/media/vehicle-backgrounds.json | Registro de videos (sin clips configurados) |
| scripts/importar-360-local.mjs | Copia validada de las fotos existentes |

La cobertura técnica sigue siendo parcial; conserva la identificación de año,
versión, mercado y fuente que trae la aplicación.
