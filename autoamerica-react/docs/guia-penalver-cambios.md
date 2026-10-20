# Guía de Peñalver: probar y editar la entrega

## 1. Dónde trabajar

Windows / PowerShell de VS Code / usuario estándar. Proyecto local: `C:\Desarrollo\Autoamerica\AA\autoamerica-react`.

Mantén el ZIP completo como copia independiente de referencia. Para incorporar cambios a tu repositorio, usa el paquete `AA-actualizacion-segura.zip`: valida primero y no sobrescribe archivos que hayan cambiado desde la base. Extrae ese paquete fuera de `AA`.

Detén Vite con Ctrl+C antes de aplicar. Guarda los archivos y no los edites mientras corre el actualizador. Si Docker ya ocupa 4173, detén solamente el entorno de desarrollo o elige otro puerto; no detengas servicios de producción.

## 2. Dependencias y validación

Desde la carpeta que contiene `package.json`, sin elevación administrativa:

```powershell
Set-Location "C:\Desarrollo\Autoamerica\AA\autoamerica-react"
node --version
npm --version
```

La base de ustedes utiliza Node 24. Conserva esa familia y el lockfile. No hay dependencias nuevas. Si ya está instalado correctamente `node_modules`, puedes ir a las pruebas. En una copia nueva ejecuta `npm ci`; requiere acceso al registro de npm, descarga paquetes y ejecuta sus scripts de instalación. No ejecutes `npm audit fix --force` ni regeneres el lockfile para resolver un error de directorio.

Ejecuta por separado y no sigas si alguno falla:

```powershell
npm run typecheck
```

```powershell
npm test
```

```powershell
npm run build
```

Esperado: TypeScript sin errores, 47 pruebas aprobadas y compilación en `dist`. Esta compilación está pendiente de confirmar en un entorno con todas las dependencias.

Para iniciar en tu equipo sin exponer Vite en la LAN, desde la misma carpeta:

```powershell
.\node_modules\.bin\vite.cmd --host 127.0.0.1 --port 4173 --strictPort
```

Abre la URL impresa. Si 4173 está ocupado puedes usar 4174 y esa URL. No hagas apertura de puertos del firewall o router para probar localmente.

## 3. Verificaciones visuales

| Prueba | Resultado esperado |
|---|---|
| Inicio | Prado real, fondo oscuro, titular grande y acentos rojos; no salto automático al carrusel. |
| Nuevos | Flechas/miniaturas cambian el modelo; la foto, textos y acciones corresponden a la selección. RAV4 se presenta con imagen pendiente. |
| Conocer modelo | Abre ficha por fragmento de URL; scroll cambia suavemente las escenas; ficha técnica accesible sin recorrer todo. |
| Usados | Marca/modelo dependientes; combina rangos y transmisión; el contador y tarjetas coinciden. Rangos invertidos dan advertencia. |
| Compartir | Copia URL con parámetros `u_`; al abrirla en otra pestaña conserva filtros, no datos nuevos creados en el CMS. |
| Favoritos | Se conservan en ese navegador si admite almacenamiento; los favoritos no se comparten como inventario. |
| Comparar | Dos tarjetas generan tabla; mostrar diferencias oculta atributos iguales. |
| Tema | Alterna claro/oscuro; conserva elección local. Coordina estas variables con Johan. |
| Sedes | Seleccionar una tarjeta cambia dirección y enlaces; cargar mapa inicia Google. Verifica manualmente el punto. |
| Tour y crédito | Siguen abriendo desde CMS y tarjetas. No constituyen integraciones reales. |
| Móvil | En DevTools, 390 px; filtros en panel, flechas accesibles y sin desbordamiento horizontal de página. |

## 4. Mapa de archivos

| Lo que quieres editar | Archivo |
|---|---|
| Titular, texto, CTA y Prado de portada | `src/components/vehicles/LandingHero.tsx` |
| Colores y tokens compartidos | `src/styles/brand.css` |
| Carrusel/escenas/tabla y puntos de ruptura | `src/styles/vehicles.css` |
| Navegación del carrusel | `src/components/vehicles/NewVehicleCarousel.tsx` |
| Narrativa y escenas de ficha | `src/components/vehicles/VehicleStory.tsx` |
| Comparación y atributos | `src/components/vehicles/VehicleCompare.tsx` |
| UI usados: panel, tarjetas, chips, páginas | `src/components/used-vehicles/UsedVehicleCatalog.tsx` |
| Reglas de filtros/orden/URL | `src/lib/usedSearch.ts` |
| Diseño usados y sedes | `src/styles/used-vehicles.css` |
| Campos del inventario y CMS | `src/catalog.ts`, `src/components/AdminCMS.tsx` |
| Muestra inicial de usados | `public/used-vehicles.json` |
| Gamas nuevas y direcciones | `src/data.ts` |
| Enlaces de Google | `src/lib/mapLinks.ts` |
| Reacción a movimiento reducido | `src/hooks/useMotionPreference.ts` |
| Preferencia claro/oscuro | `src/components/ThemeSwitch.tsx` |
| Composición e integración general | `src/App.tsx` |

No edites `dist`: se regenera. No edites `node_modules`: contiene librerías instaladas. No modifiques las imágenes dudosas sin reemplazos comprobados.

## 5. Primera modificación que puedes hacer solo

Abre `LandingHero.tsx` con Ctrl+P. Busca `No sigas` con Ctrl+F. Cambia solo el texto dentro de la etiqueta, no los nombres de variables ni las llaves. Guarda con Ctrl+S y verifica la portada. En Git, `git diff -- autoamerica-react/src/components/vehicles/LandingHero.tsx` desde la raíz AA muestra exactamente tu cambio.

Para cambiar el rojo, modifica `--aa-red` y `--aa-red-hover` de `brand.css`. Son variables: los componentes que usan `var(--aa-red)` reciben el nuevo valor. No reemplaces todos los colores del archivo; los estados de error, textos y bordes tienen otras funciones.

En `usedSearch.ts`, `.filter()` devuelve los registros que coinciden. Las selecciones dentro de una categoría se combinan con OR; distintas categorías con AND. `useState` de UsedVehicleCatalog mantiene la selección del usuario y vuelve a dibujar resultados al cambiar. El código de pruebas muestra casos de modelos dependientes y valores desconocidos.

## 6. Usados multimarca

En Administrar catálogo, crea una unidad usada. Completa **marca y modelo por separado**, año, km, combustible, transmisión, precio, sede, descripción y fotografía real de esa unidad. Al publicarla, su marca aparece automáticamente en filtros; no agregues la marca manualmente en JSX. No marques certificación sin documentación.

La demo se reinicia al recargar: documenta los registros reales antes de cerrar. Para persistencia se requiere el CMS productivo, fuera de esta entrega.

## 7. Trabajo de tres personas en main

Desde `C:\Desarrollo\Autoamerica\AA`, revisa `git status -sb` antes de editar. Si está limpio, `git pull --ff-only origin main` actualiza sin fusión automática. Si falla, no uses `reset --hard` ni `push --force`.

Antes de subir, prueba y revisa `git diff --stat` y `git diff`. El paquete de actualización incluye `archivos-cambiados.txt` para seleccionar solamente los archivos previstos. Haz un commit pequeño; si hay cambios remotos, `git pull --rebase origin main` puede detenerse por conflictos. No continúes ni hagas push con conflictos: consulta al equipo. Después del rebase exitoso repite TypeScript, pruebas y build antes de `git push origin main`.

Resultado de cierre: nueva interfaz funcionando localmente, compilación aprobada, diff revisado, respaldo y commit identificable. El actualizador nunca publica por ti.
