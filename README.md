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
