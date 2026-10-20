# Cargar el proyecto al repositorio Git

## 1. Preparar el proyecto

Descomprime `autoamerica-react-git.zip`. La carpeta `autoamerica-react` contiene la raíz del proyecto: allí están `package.json`, `src/`, `public/` y `docs/`. Conserva también los archivos `.gitignore` y `.gitattributes`.

Instala Git y una versión de Node.js compatible con Vite 7; el proyecto documenta Node.js 22.12 o posterior compatible. npm debe estar disponible. Ejecuta en PowerShell o en tu terminal, desde la raíz del proyecto:

```powershell
npm ci
npm run typecheck
npm run build
npm run dev
```

Abre `http://localhost:4173`. No abras `index.html` directamente desde el explorador de archivos. La compilación estática queda en `dist/`; puedes revisarla con `npm run preview` después de compilar.

El CMS se abre desde «Propuesta interactiva → CMS de mercadeo → Abrir administración de vehículos» o desde «Administrar catálogo» en el pie de página. Sus cambios son temporales y se reinician al recargar.

## 2. Si el repositorio remoto está vacío

Esta opción presupone que el remoto no tiene commits, ni siquiera un README inicial. En la carpeta descomprimida:

```powershell
git init -b main
git add .
git commit -m "Base del proyecto web Autoamerica con catalogo, CMS demo y visor 3D"
git remote add origin "URL_DE_TU_REPOSITORIO"
git push -u origin main
```

Sustituye `URL_DE_TU_REPOSITORIO` por la URL HTTPS o SSH real. La autenticación se realiza con el mecanismo de tu proveedor Git; no guardes tokens dentro del proyecto ni en la URL del remoto. Si Git solicita identidad, configura tu nombre y correo de trabajo antes del commit.

Si tu organización protege `main`, publica una rama y crea una solicitud de integración con el flujo del equipo.

## 3. Si el repositorio remoto ya tiene contenido

Trabaja sobre su historial existente. Desde una carpeta de trabajo:

```powershell
git clone "URL_DE_TU_REPOSITORIO" autoamerica-repo
cd autoamerica-repo
git switch -c feature/autoamerica-web
```

Copia el contenido de la carpeta exportada dentro de este clon. Si el repositorio ya contiene una aplicación, elige una carpeta de destino para este proyecto y fusiona deliberadamente los archivos compartidos, especialmente README y .gitignore. Conserva la carpeta `.git` del clon.

Revisa y guarda los cambios:

```powershell
git status
git diff
git add .
git diff --cached --stat
git commit -m "Incorporar propuesta web Autoamerica"
git push -u origin feature/autoamerica-web
```

Crea un Pull Request o Merge Request desde esa rama. No necesitas forzar el push ni reemplazar el historial del repositorio.

## 4. Qué se versiona

- `src/`: aplicación, CMS de demostración, visor y estilos.
- `public/`: todos los activos y datos de muestra. Es necesario conservarlo porque el catálogo importa `public/used-vehicles.json`.
- `docs/`: alcance, arquitectura, revisión del sitio, inventario y validación.
- Archivos de configuración y dependencias: package.json, package-lock.json, tsconfig, vite.config.ts, index.html, .gitignore y .gitattributes.

Las dependencias instaladas, compilaciones y secretos se excluyen mediante `.gitignore`. No se requiere `.env` para ejecutar esta versión.

## 5. Compilación en tu plataforma

Los comandos del proyecto son:

| Propósito | Comando |
| --- | --- |
| Instalar las versiones fijadas | `npm ci` |
| Comprobar TypeScript | `npm run typecheck` |
| Construir el sitio | `npm run build` |
| Directorio de salida | `dist/` |
| Ejecutar desarrollo | `npm run dev` |
| Revisar la compilación local | `npm run preview` |

La exportación no incluye un pipeline que despliegue automáticamente ni credenciales de nube. Se puede añadir el flujo de CI/CD del proveedor que utilice tu repositorio cuando se defina ese destino.
