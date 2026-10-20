# Sedes con Google Maps

## Implementación

`src/data.ts` contiene seis sedes con nombre, dirección, ciudad, servicios, horario y consulta `mapsQuery`. `LocationMap.tsx` ofrece selector, filtros por servicio, panel de datos y un iframe de Google Maps que se carga cuando el visitante lo solicita. No se obtiene su geolocalización.

`src/lib/mapLinks.ts` genera Maps URLs con `api=1` para búsqueda e indicaciones. Estas URLs oficiales no requieren API key. No se configuró una cuenta de Google Cloud, facturación, API de JavaScript ni servicios pagados. El origen de las indicaciones lo resuelve el visitante en Google Maps.

El iframe por dirección (`q`, `output=embed`) es una alternativa de compatibilidad. **No es la integración oficial de Maps Embed API con clave**. Google puede resolver la consulta a un punto general o rechazar ese formato; por ello siempre hay enlaces externos y conviene configurar enlaces de inserción exactos antes de producción.

## Referencias de ubicación

| Sede | Dirección de referencia |
|---|---|
| Palacé | Carrera 50 #38-50, Medellín |
| Sur | Carrera 48 #44 Sur-151, Envigado |
| Oriente | CC Jardines Llanogrande, sótano, Don Diego-Llanogrande km 8, Rionegro |
| Apartadó | Carrera 100 #77-502, Mall La 100 local 9, Apartadó |
| Usados Medellín | Carrera 46 #37-53, Glorieta San Diego, Medellín |
| Taller Apartadó | Carrera 103A #97-24, barrio Nuevo, Apartadó |

Las direcciones/horarios se contrastaron contra el directorio publicado por Autoamérica, también visible en su página de posventa y pie de página. **No se comprobó presencialmente ni en un Google Maps operativo el pin de las seis sedes**. No se incorporaron coordenadas ni Place IDs inventados. Consulta horarios vigentes antes de un desplazamiento.

## Validación exacta por sede (mercadeo)

Abre el establecimiento en Google Maps. Confirma nombre, dirección y entrada correcta. Usa Compartir / Insertar un mapa y copia solamente el valor `src` del iframe, no todo el HTML. En el registro de `src/data.ts`, agrega `googleEmbedUrl: 'URL_HTTPS_VERIFICADA'`. Solo se admite `www.google.com/maps/embed...`.

Si dispones del Place ID obtenido y validado con Google, agrega `googlePlaceId`. Esto precisa los enlaces externos; no lo inventes ni lo deduzcas de IDs de Waze. `googleEmbedUrl` fija la inserción, `googlePlaceId` precisa búsqueda/indicaciones: no son el mismo campo.

Prueba las seis sedes en escritorio y móvil. Verifica rótulo, pin y ruta, conserva captura y fecha de revisión. Una carga del iframe sin error no prueba que el punto sea correcto.

## Fuentes oficiales

- https://developers.google.com/maps/documentation/urls/get-started
- https://autoamerica.com.co/sistema-sedes-y-horarios/
- https://autoamerica.com.co/servicios-posventa/
- https://autoamerica.com.co/nueva-land-cruiser-prado-250/
