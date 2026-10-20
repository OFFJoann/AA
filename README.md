> **EXPORT CONSOLIDADO 20/10/2026:** [guía vigente](autoamerica-react/docs/exportacion-consolidada.md). Incluye Landing Motion, rutas independientes y el visor fotográfico Corolla Cross con el ID corregido. Las imágenes 360 locales y videos oficiales no están en este ZIP. La documentación posterior se conserva como historial.

> **Actualización 20/10/2026: páginas separadas y fichas por sistemas.** Consulte [autoamerica-react/docs/entornos-y-cinematica.md](autoamerica-react/docs/entornos-y-cinematica.md) y las limitaciones de validación de esta entrega. La documentación anterior se conserva como historial.

> **Entrega Red & Black (20/10/2026):** [qué cambió](autoamerica-react/docs/entrega-red-black.md), [cómo editarlo](autoamerica-react/docs/guia-penalver-cambios.md) y [validación pendiente de compilación](autoamerica-react/docs/validacion-red-black.md). Los usados admiten cualquier marca.

# Autoamérica — experiencia interactiva

Aplicación React, TypeScript y Three.js con catálogo, explorador 3D de cinco vehículos y CMS de demostración.

## Ejecutar con Docker

Desde esta carpeta, con Docker Desktop iniciado:

```powershell
docker compose -f autoamerica-react/compose.yaml up -d --build
```

Abre [http://localhost:4173](http://localhost:4173). Para detenerla:

```powershell
docker compose -f autoamerica-react/compose.yaml down
```

El proyecto completo está en [autoamerica-react](autoamerica-react/README.md). El explorador permite elegir Prado, Corolla Cross, Hilux, Yaris Cross y RAV4, cambiar el acabado, girar el vehículo y separar sus sistemas.

Las carrocerías son aproximaciones visuales originales; los componentes mecánicos son esquemáticos. Consulta el alcance y las instrucciones de desarrollo en la documentación del proyecto.


Actualizacion Landing Motion: consultar `autoamerica-react/docs/landing-motion-y-360.md`. Videos y modelo 3D Toyota original NO incluidos; ver limites y validacion antes de publicar.
