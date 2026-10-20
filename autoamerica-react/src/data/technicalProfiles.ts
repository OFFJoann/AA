/** Reviewed source snapshots, not a live inventory or a repair manual.
 * Every row keeps its source and every variant its model year.
 * Update data only with a matching Colombian version document.
 */
export type TechnicalRow={label:string;value:string;source:string};
export type TechnicalGroup={id:string;title:string;rows:TechnicalRow[]};
export type TechnicalVariant={id:string;label:string;year:number;source:string;headline:string;groups:TechnicalGroup[]};
export type StoryMedia={id:string;src:string;alt:string;source:string;kind:string;note:string;status:'model-reviewed';rights:'pending'|'approved';variants?:string[]};
export type TechnicalProfile={id:string;name:string;kicker:string;summary:string;notice:string;sources:string[];variants:TechnicalVariant[];media:StoryMedia[]};
export type SourceRecord={title:string;url:string;date:string;type:string};

export const technicalSources:Record<string,SourceRecord> = {
  "prado-pdf": {
    "title": "Toyota Colombia - Land Cruiser Prado 2027",
    "url": "https://www.toyota.com.co/images/pdf/LANDCRUISER-PRADO.pdf",
    "date": "2026-06",
    "type": "pdf"
  },
  "hilux-pdf": {
    "title": "Toyota Colombia - Hilux 2027",
    "url": "https://www.toyota.com.co/images/pdf/FT_TOYOTA_HILUX.pdf",
    "date": "2026-05",
    "type": "pdf"
  },
  "cross-pdf": {
    "title": "Toyota Colombia - Corolla Cross, hoja de referencia 2026 (página 2)",
    "url": "https://www.toyota.com.co/images/pdf/FT-COROLLA-CROSS.pdf#page=2",
    "date": "2025-08 (hoja 2026)",
    "type": "pdf"
  },
  "rav4-aa": {
    "title": "Autoamérica - RAV4 HEV 2026",
    "url": "https://autoamerica.com.co/vehiculo/rav4-hev-2/",
    "date": "2026-10-20",
    "type": "web"
  },
  "prado-aa": {
    "title": "Autoamérica - Land Cruiser Prado",
    "url": "https://autoamerica.com.co/vehiculo/toyota-prado/",
    "date": "2026-10-20",
    "type": "web"
  },
  "cross-aa": {
    "title": "Autoamérica - Corolla Cross HEV",
    "url": "https://autoamerica.com.co/vehiculo/corolla-cross-hv/",
    "date": "2026-10-20",
    "type": "web"
  },
  "hilux-aa": {
    "title": "Autoamérica - Hilux",
    "url": "https://autoamerica.com.co/vehiculo/toyota-hilux/",
    "date": "2026-10-20",
    "type": "web"
  },
  "prado-gallery": {
    "title": "Galería local Autoamérica - origen en asset-manifest.json",
    "url": "https://autoamerica.com.co/vehiculo/toyota-prado/",
    "date": "2026-10-20",
    "type": "web"
  },
  "hilux-gallery": {
    "title": "Toyota Colombia - portal de ventas Hilux",
    "url": "https://www.sales.toyota.com.co/detail/hilux",
    "date": "2026-10-20",
    "type": "web"
  },
  "cross-gallery": {
    "title": "Toyota Colombia - portal de ventas Corolla Cross",
    "url": "https://www.sales.toyota.com.co/detail/corolla-cross",
    "date": "2026-10-20",
    "type": "web"
  }
};

export const technicalProfiles:TechnicalProfile[] = [
  {
    "id": "new:prado",
    "name": "Land Cruiser Prado",
    "kicker": "EL SIGUIENTE HORIZONTE",
    "summary": "La serie 250, por dentro y por fuera. Explora sus sistemas y consulta los datos de la versión seleccionada.",
    "variants": [
      {
        "id": "txl-24",
        "label": "TX-L 2.4 gasolina",
        "year": 2027,
        "source": "prado-pdf",
        "headline": "278 hp",
        "groups": [
          {
            "id": "carroceria",
            "title": "Carrocería y dimensiones",
            "rows": [
              {
                "label": "Carrocería",
                "value": "SUV de 5 puertas",
                "source": "prado-pdf"
              },
              {
                "label": "Pasajeros",
                "value": "7",
                "source": "prado-pdf"
              },
              {
                "label": "Distancia entre ejes",
                "value": "2.850 mm",
                "source": "prado-pdf"
              },
              {
                "label": "Tanque de combustible",
                "value": "80 L",
                "source": "prado-pdf"
              }
            ]
          },
          {
            "id": "motor",
            "title": "Motor",
            "rows": [
              {
                "label": "Cilindrada y arquitectura",
                "value": "2.393 cm³, turbo; 4 cilindros / 16 válvulas",
                "source": "prado-pdf"
              },
              {
                "label": "Combustible",
                "value": "Gasolina extra RON 95 o superior",
                "source": "prado-pdf"
              },
              {
                "label": "Potencia",
                "value": "278 hp a 6.000 rpm",
                "source": "prado-pdf"
              },
              {
                "label": "Torque",
                "value": "430 Nm entre 1.700 y 3.600 rpm",
                "source": "prado-pdf"
              },
              {
                "label": "Compresión",
                "value": "11,0:1",
                "source": "prado-pdf"
              }
            ]
          },
          {
            "id": "transmision",
            "title": "Transmisión y tracción",
            "rows": [
              {
                "label": "Caja",
                "value": "Automática secuencial de 8 velocidades + reversa",
                "source": "prado-pdf"
              },
              {
                "label": "Modo manual",
                "value": "Incluido",
                "source": "prado-pdf"
              },
              {
                "label": "Tracción",
                "value": "4WD permanente",
                "source": "prado-pdf"
              },
              {
                "label": "Selector",
                "value": "4H / 4L",
                "source": "prado-pdf"
              },
              {
                "label": "Reductora",
                "value": "Relación 2,566",
                "source": "prado-pdf"
              },
              {
                "label": "Diferencial central",
                "value": "Bloqueo manual y Torsen LSD",
                "source": "prado-pdf"
              }
            ]
          },
          {
            "id": "chasis",
            "title": "Chasis, frenos y dirección",
            "rows": [
              {
                "label": "Suspensión delantera",
                "value": "Independiente de doble horquilla y resortes helicoidales",
                "source": "prado-pdf"
              },
              {
                "label": "Suspensión trasera",
                "value": "Multilink de 4 enlaces y resortes helicoidales",
                "source": "prado-pdf"
              },
              {
                "label": "Frenos delanteros",
                "value": "Discos ventilados",
                "source": "prado-pdf"
              },
              {
                "label": "Frenos traseros",
                "value": "Discos ventilados",
                "source": "prado-pdf"
              },
              {
                "label": "Estacionamiento",
                "value": "Electrónico + Auto Hold",
                "source": "prado-pdf"
              },
              {
                "label": "Dirección",
                "value": "Piñón y cremallera con asistencia eléctrica",
                "source": "prado-pdf"
              }
            ]
          },
          {
            "id": "interior",
            "title": "Interior y conectividad",
            "rows": [
              {
                "label": "Pantalla multimedia",
                "value": "12,3 pulgadas",
                "source": "prado-pdf"
              },
              {
                "label": "Integración",
                "value": "Apple CarPlay y Android Auto; consultar modalidad de conexión en el PDF",
                "source": "prado-pdf"
              },
              {
                "label": "Climatización",
                "value": "Configuración por filas: consultar PDF de la versión",
                "source": "prado-pdf"
              }
            ]
          },
          {
            "id": "seguridad",
            "title": "Seguridad",
            "rows": [
              {
                "label": "Bolsas de aire",
                "value": "8; según PDF Toyota Colombia (la página del concesionario contiene cifras distintas)",
                "source": "prado-pdf"
              },
              {
                "label": "Frenado",
                "value": "ABS + EBD + BA",
                "source": "prado-pdf"
              },
              {
                "label": "Estabilidad y tracción",
                "value": "VSC + ATRC",
                "source": "prado-pdf"
              },
              {
                "label": "Asistencia en pendiente",
                "value": "HAC",
                "source": "prado-pdf"
              },
              {
                "label": "Sujeción infantil",
                "value": "ISOFIX",
                "source": "prado-pdf"
              },
              {
                "label": "Presión de llantas",
                "value": "TPMS",
                "source": "prado-pdf"
              }
            ]
          },
          {
            "id": "ruedas",
            "title": "Ruedas",
            "rows": [
              {
                "label": "Neumáticos",
                "value": "265/65 R18",
                "source": "prado-pdf"
              }
            ]
          }
        ]
      },
      {
        "id": "txl-28",
        "label": "TX-L 2.8 diésel",
        "year": 2027,
        "source": "prado-pdf",
        "headline": "201 hp",
        "groups": [
          {
            "id": "carroceria",
            "title": "Carrocería y dimensiones",
            "rows": [
              {
                "label": "Carrocería",
                "value": "SUV de 5 puertas",
                "source": "prado-pdf"
              },
              {
                "label": "Pasajeros",
                "value": "7",
                "source": "prado-pdf"
              },
              {
                "label": "Distancia entre ejes",
                "value": "2.850 mm",
                "source": "prado-pdf"
              },
              {
                "label": "Tanque de combustible",
                "value": "80 L",
                "source": "prado-pdf"
              }
            ]
          },
          {
            "id": "motor",
            "title": "Motor",
            "rows": [
              {
                "label": "Cilindrada y arquitectura",
                "value": "2.755 cm³, turbo; 4 cilindros / 16 válvulas",
                "source": "prado-pdf"
              },
              {
                "label": "Combustible",
                "value": "Diésel, cetano 48 o superior",
                "source": "prado-pdf"
              },
              {
                "label": "Potencia",
                "value": "201 hp entre 3.000 y 4.000 rpm",
                "source": "prado-pdf"
              },
              {
                "label": "Torque",
                "value": "500 Nm entre 1.600 y 2.800 rpm",
                "source": "prado-pdf"
              },
              {
                "label": "Compresión",
                "value": "15,6:1",
                "source": "prado-pdf"
              }
            ]
          },
          {
            "id": "transmision",
            "title": "Transmisión y tracción",
            "rows": [
              {
                "label": "Caja",
                "value": "Automática secuencial de 8 velocidades + reversa",
                "source": "prado-pdf"
              },
              {
                "label": "Modo manual",
                "value": "Incluido",
                "source": "prado-pdf"
              },
              {
                "label": "Tracción",
                "value": "4WD permanente",
                "source": "prado-pdf"
              },
              {
                "label": "Selector",
                "value": "4H / 4L",
                "source": "prado-pdf"
              },
              {
                "label": "Reductora",
                "value": "Relación 2,566",
                "source": "prado-pdf"
              },
              {
                "label": "Diferencial central",
                "value": "Bloqueo manual y Torsen LSD",
                "source": "prado-pdf"
              }
            ]
          },
          {
            "id": "chasis",
            "title": "Chasis, frenos y dirección",
            "rows": [
              {
                "label": "Suspensión delantera",
                "value": "Independiente de doble horquilla y resortes helicoidales",
                "source": "prado-pdf"
              },
              {
                "label": "Suspensión trasera",
                "value": "Multilink de 4 enlaces y resortes helicoidales",
                "source": "prado-pdf"
              },
              {
                "label": "Frenos delanteros",
                "value": "Discos ventilados",
                "source": "prado-pdf"
              },
              {
                "label": "Frenos traseros",
                "value": "Discos ventilados",
                "source": "prado-pdf"
              },
              {
                "label": "Estacionamiento",
                "value": "Electrónico + Auto Hold",
                "source": "prado-pdf"
              },
              {
                "label": "Dirección",
                "value": "Piñón y cremallera con asistencia eléctrica",
                "source": "prado-pdf"
              }
            ]
          },
          {
            "id": "interior",
            "title": "Interior y conectividad",
            "rows": [
              {
                "label": "Pantalla multimedia",
                "value": "12,3 pulgadas",
                "source": "prado-pdf"
              },
              {
                "label": "Integración",
                "value": "Apple CarPlay y Android Auto; consultar modalidad de conexión en el PDF",
                "source": "prado-pdf"
              },
              {
                "label": "Climatización",
                "value": "Configuración por filas: consultar PDF de la versión",
                "source": "prado-pdf"
              }
            ]
          },
          {
            "id": "seguridad",
            "title": "Seguridad",
            "rows": [
              {
                "label": "Bolsas de aire",
                "value": "8; según PDF Toyota Colombia (la página del concesionario contiene cifras distintas)",
                "source": "prado-pdf"
              },
              {
                "label": "Frenado",
                "value": "ABS + EBD + BA",
                "source": "prado-pdf"
              },
              {
                "label": "Estabilidad y tracción",
                "value": "VSC + ATRC",
                "source": "prado-pdf"
              },
              {
                "label": "Asistencia en pendiente",
                "value": "HAC",
                "source": "prado-pdf"
              },
              {
                "label": "Sujeción infantil",
                "value": "ISOFIX",
                "source": "prado-pdf"
              },
              {
                "label": "Presión de llantas",
                "value": "TPMS",
                "source": "prado-pdf"
              }
            ]
          },
          {
            "id": "ruedas",
            "title": "Ruedas",
            "rows": [
              {
                "label": "Neumáticos",
                "value": "265/65 R18",
                "source": "prado-pdf"
              }
            ]
          }
        ]
      },
      {
        "id": "tx-24",
        "label": "TX 2.4 gasolina",
        "year": 2027,
        "source": "prado-pdf",
        "headline": "278 hp",
        "groups": [
          {
            "id": "carroceria",
            "title": "Carrocería y dimensiones",
            "rows": [
              {
                "label": "Carrocería",
                "value": "SUV de 5 puertas",
                "source": "prado-pdf"
              },
              {
                "label": "Pasajeros",
                "value": "7",
                "source": "prado-pdf"
              },
              {
                "label": "Distancia entre ejes",
                "value": "2.850 mm",
                "source": "prado-pdf"
              },
              {
                "label": "Tanque de combustible",
                "value": "80 L",
                "source": "prado-pdf"
              }
            ]
          },
          {
            "id": "motor",
            "title": "Motor",
            "rows": [
              {
                "label": "Cilindrada y arquitectura",
                "value": "2.393 cm³, turbo; 4 cilindros / 16 válvulas",
                "source": "prado-pdf"
              },
              {
                "label": "Combustible",
                "value": "Gasolina extra RON 95 o superior",
                "source": "prado-pdf"
              },
              {
                "label": "Potencia",
                "value": "278 hp a 6.000 rpm",
                "source": "prado-pdf"
              },
              {
                "label": "Torque",
                "value": "430 Nm entre 1.700 y 3.600 rpm",
                "source": "prado-pdf"
              },
              {
                "label": "Compresión",
                "value": "11,0:1",
                "source": "prado-pdf"
              }
            ]
          },
          {
            "id": "transmision",
            "title": "Transmisión y tracción",
            "rows": [
              {
                "label": "Caja",
                "value": "Automática secuencial de 8 velocidades + reversa",
                "source": "prado-pdf"
              },
              {
                "label": "Modo manual",
                "value": "Incluido",
                "source": "prado-pdf"
              },
              {
                "label": "Tracción",
                "value": "4WD permanente",
                "source": "prado-pdf"
              },
              {
                "label": "Selector",
                "value": "4H / 4L",
                "source": "prado-pdf"
              },
              {
                "label": "Reductora",
                "value": "Relación 2,566",
                "source": "prado-pdf"
              },
              {
                "label": "Diferencial central",
                "value": "Bloqueo manual y Torsen LSD",
                "source": "prado-pdf"
              }
            ]
          },
          {
            "id": "chasis",
            "title": "Chasis, frenos y dirección",
            "rows": [
              {
                "label": "Suspensión delantera",
                "value": "Independiente de doble horquilla y resortes helicoidales",
                "source": "prado-pdf"
              },
              {
                "label": "Suspensión trasera",
                "value": "Multilink de 4 enlaces y resortes helicoidales",
                "source": "prado-pdf"
              },
              {
                "label": "Frenos delanteros",
                "value": "Discos ventilados",
                "source": "prado-pdf"
              },
              {
                "label": "Frenos traseros",
                "value": "Discos ventilados",
                "source": "prado-pdf"
              },
              {
                "label": "Estacionamiento",
                "value": "Electrónico + Auto Hold",
                "source": "prado-pdf"
              },
              {
                "label": "Dirección",
                "value": "Piñón y cremallera con asistencia eléctrica",
                "source": "prado-pdf"
              }
            ]
          },
          {
            "id": "interior",
            "title": "Interior y conectividad",
            "rows": [
              {
                "label": "Pantalla multimedia",
                "value": "8 pulgadas",
                "source": "prado-pdf"
              },
              {
                "label": "Integración",
                "value": "Apple CarPlay y Android Auto; consultar modalidad de conexión en el PDF",
                "source": "prado-pdf"
              },
              {
                "label": "Climatización",
                "value": "Automático dual, primera fila",
                "source": "prado-pdf"
              }
            ]
          },
          {
            "id": "seguridad",
            "title": "Seguridad",
            "rows": [
              {
                "label": "Bolsas de aire",
                "value": "8; según PDF Toyota Colombia (la página del concesionario contiene cifras distintas)",
                "source": "prado-pdf"
              },
              {
                "label": "Frenado",
                "value": "ABS + EBD + BA",
                "source": "prado-pdf"
              },
              {
                "label": "Estabilidad y tracción",
                "value": "VSC + ATRC",
                "source": "prado-pdf"
              },
              {
                "label": "Asistencia en pendiente",
                "value": "HAC",
                "source": "prado-pdf"
              },
              {
                "label": "Sujeción infantil",
                "value": "ISOFIX",
                "source": "prado-pdf"
              },
              {
                "label": "Presión de llantas",
                "value": "TPMS",
                "source": "prado-pdf"
              }
            ]
          },
          {
            "id": "ruedas",
            "title": "Ruedas",
            "rows": [
              {
                "label": "Neumáticos",
                "value": "245/70 R18",
                "source": "prado-pdf"
              }
            ]
          }
        ]
      }
    ],
    "sources": [
      "prado-pdf",
      "prado-aa"
    ],
    "notice": "Datos 2027 del PDF Toyota Colombia, elaborado en junio de 2026. Las fotografías de la gama no certifican el equipamiento de una unidad. El PDF indica 8 airbags; la página del concesionario contiene una cifra distinta en algunos textos.",
    "media": [
      {
        "id": "prado-stage",
        "src": "/assets/hero.webp",
        "alt": "Toyota Land Cruiser Prado serie 250, vista exterior",
        "source": "prado-gallery",
        "kind": "exterior",
        "note": "Imagen de referencia de la gama. El equipamiento y color pueden variar.",
        "status": "model-reviewed",
        "rights": "pending"
      },
      {
        "id": "prado-studio",
        "src": "/assets/prado.webp",
        "alt": "Land Cruiser Prado TX-L, exterior sobre fondo claro",
        "source": "prado-aa",
        "kind": "exterior",
        "note": "Imagen comercial TX-L gasolina de Autoamérica; no acredita el equipamiento de una unidad 2027.",
        "status": "model-reviewed",
        "rights": "pending",
        "variants": [
          "txl-24"
        ]
      },
      {
        "id": "prado-cabin",
        "src": "/assets/prado-interior.webp",
        "alt": "Habitáculo de Land Cruiser Prado serie 250",
        "source": "prado-gallery",
        "kind": "interior",
        "note": "Interior de referencia de la serie 250; no identifica año ni opcionales de la versión.",
        "status": "model-reviewed",
        "rights": "pending",
        "variants": [
          "txl-24",
          "txl-28"
        ]
      },
      {
        "id": "prado-console",
        "src": "/assets/prado-detail.webp",
        "alt": "Consola de transmisión de Land Cruiser Prado",
        "source": "prado-gallery",
        "kind": "detail",
        "note": "Vista de referencia del mando, no del motor ni del sistema interno.",
        "status": "model-reviewed",
        "rights": "pending"
      }
    ]
  },
  {
    "id": "new:hilux",
    "name": "Hilux",
    "kicker": "CARÁCTER QUE TRABAJA CONTIGO",
    "summary": "Cabina, fuerza y capacidad. Una lectura por sistemas de las versiones diésel de doble cabina.",
    "variants": [
      {
        "id": "srv-24",
        "label": "Doble cabina SRV 2.4 diésel AT",
        "year": 2027,
        "source": "hilux-pdf",
        "headline": "148 hp",
        "groups": [
          {
            "id": "carroceria",
            "title": "Carrocería y capacidades",
            "rows": [
              {
                "label": "Configuración",
                "value": "Doble cabina",
                "source": "hilux-pdf"
              },
              {
                "label": "Pasajeros",
                "value": "5",
                "source": "hilux-pdf"
              },
              {
                "label": "Largo",
                "value": "5.325 mm",
                "source": "hilux-pdf"
              },
              {
                "label": "Ancho",
                "value": "1.855 mm",
                "source": "hilux-pdf"
              },
              {
                "label": "Altura",
                "value": "1.815 mm",
                "source": "hilux-pdf"
              },
              {
                "label": "Distancia entre ejes",
                "value": "3.085 mm",
                "source": "hilux-pdf"
              },
              {
                "label": "Tanque",
                "value": "21 galones",
                "source": "hilux-pdf"
              },
              {
                "label": "Carga total",
                "value": "760 kg",
                "source": "hilux-pdf"
              }
            ]
          },
          {
            "id": "motor",
            "title": "Motor",
            "rows": [
              {
                "label": "Cilindrada",
                "value": "2.393 cm³",
                "source": "hilux-pdf"
              },
              {
                "label": "Combustible",
                "value": "Diésel, cetano 48 o superior",
                "source": "hilux-pdf"
              },
              {
                "label": "Cilindros",
                "value": "4 en línea",
                "source": "hilux-pdf"
              },
              {
                "label": "Válvulas",
                "value": "16",
                "source": "hilux-pdf"
              },
              {
                "label": "Compresión",
                "value": "15,6:1",
                "source": "hilux-pdf"
              },
              {
                "label": "Potencia",
                "value": "148 hp a 3.400 rpm",
                "source": "hilux-pdf"
              },
              {
                "label": "Torque",
                "value": "400 Nm entre 1.600 y 2.000 rpm",
                "source": "hilux-pdf"
              },
              {
                "label": "Tecnología",
                "value": "Turbo de geometría variable, intercooler y riel común",
                "source": "hilux-pdf"
              }
            ]
          },
          {
            "id": "transmision",
            "title": "Transmisión y tracción",
            "rows": [
              {
                "label": "Caja",
                "value": "Automática secuencial, 6 velocidades",
                "source": "hilux-pdf"
              },
              {
                "label": "Tracción",
                "value": "4WD conectable (part time)",
                "source": "hilux-pdf"
              },
              {
                "label": "Selector",
                "value": "4x2 / 4x4 con bajo",
                "source": "hilux-pdf"
              }
            ]
          },
          {
            "id": "chasis",
            "title": "Chasis y frenado",
            "rows": [
              {
                "label": "Suspensión delantera",
                "value": "Doble horquilla con resortes helicoidales",
                "source": "hilux-pdf"
              },
              {
                "label": "Suspensión trasera",
                "value": "Eje rígido con ballestas",
                "source": "hilux-pdf"
              },
              {
                "label": "Frenos delanteros",
                "value": "Discos ventilados",
                "source": "hilux-pdf"
              },
              {
                "label": "Frenos traseros",
                "value": "Tambor",
                "source": "hilux-pdf"
              },
              {
                "label": "Dirección",
                "value": "Piñón y cremallera, asistencia hidráulica",
                "source": "hilux-pdf"
              },
              {
                "label": "Neumáticos",
                "value": "265/65 R17",
                "source": "hilux-pdf"
              }
            ]
          },
          {
            "id": "seguridad",
            "title": "Seguridad",
            "rows": [
              {
                "label": "Bolsas de aire",
                "value": "7",
                "source": "hilux-pdf"
              },
              {
                "label": "Asistencia de frenado",
                "value": "ABS + EBD + BA",
                "source": "hilux-pdf"
              },
              {
                "label": "Asistencias de conducción",
                "value": "VSC + TRC + HAC + TSC",
                "source": "hilux-pdf"
              },
              {
                "label": "Estructura",
                "value": "GOA",
                "source": "hilux-pdf"
              }
            ]
          },
          {
            "id": "interior",
            "title": "Interior y conectividad",
            "rows": [
              {
                "label": "Multimedia",
                "value": "Pantalla táctil, Bluetooth, AM/FM y USB",
                "source": "hilux-pdf"
              },
              {
                "label": "Integración",
                "value": "Apple CarPlay / Android Auto",
                "source": "hilux-pdf"
              },
              {
                "label": "Instrumentación",
                "value": "Velocímetro y tacómetro análogos; pantalla TFT de 4,2 pulgadas",
                "source": "hilux-pdf"
              }
            ]
          }
        ]
      },
      {
        "id": "srx-28",
        "label": "Doble cabina SRX 2.8 diésel AT",
        "year": 2027,
        "source": "hilux-pdf",
        "headline": "201 hp",
        "groups": [
          {
            "id": "carroceria",
            "title": "Carrocería y capacidades",
            "rows": [
              {
                "label": "Configuración",
                "value": "Doble cabina",
                "source": "hilux-pdf"
              },
              {
                "label": "Pasajeros",
                "value": "5",
                "source": "hilux-pdf"
              },
              {
                "label": "Largo",
                "value": "5.325 mm",
                "source": "hilux-pdf"
              },
              {
                "label": "Ancho",
                "value": "1.855 mm",
                "source": "hilux-pdf"
              },
              {
                "label": "Altura",
                "value": "1.815 mm",
                "source": "hilux-pdf"
              },
              {
                "label": "Distancia entre ejes",
                "value": "3.085 mm",
                "source": "hilux-pdf"
              },
              {
                "label": "Tanque",
                "value": "21 galones",
                "source": "hilux-pdf"
              },
              {
                "label": "Carga total",
                "value": "720 kg",
                "source": "hilux-pdf"
              }
            ]
          },
          {
            "id": "motor",
            "title": "Motor",
            "rows": [
              {
                "label": "Cilindrada",
                "value": "2.755 cm³",
                "source": "hilux-pdf"
              },
              {
                "label": "Combustible",
                "value": "Diésel, cetano 48 o superior",
                "source": "hilux-pdf"
              },
              {
                "label": "Cilindros",
                "value": "4 en línea",
                "source": "hilux-pdf"
              },
              {
                "label": "Válvulas",
                "value": "16",
                "source": "hilux-pdf"
              },
              {
                "label": "Compresión",
                "value": "15,6:1",
                "source": "hilux-pdf"
              },
              {
                "label": "Potencia",
                "value": "201 hp entre 3.000 y 3.400 rpm",
                "source": "hilux-pdf"
              },
              {
                "label": "Torque",
                "value": "500 Nm entre 1.600 y 2.800 rpm",
                "source": "hilux-pdf"
              },
              {
                "label": "Tecnología",
                "value": "Turbo de geometría variable, intercooler y riel común",
                "source": "hilux-pdf"
              }
            ]
          },
          {
            "id": "transmision",
            "title": "Transmisión y tracción",
            "rows": [
              {
                "label": "Caja",
                "value": "Automática secuencial, 6 velocidades",
                "source": "hilux-pdf"
              },
              {
                "label": "Tracción",
                "value": "4WD conectable (part time)",
                "source": "hilux-pdf"
              },
              {
                "label": "Selector",
                "value": "4x2 / 4x4 con bajo",
                "source": "hilux-pdf"
              }
            ]
          },
          {
            "id": "chasis",
            "title": "Chasis y frenado",
            "rows": [
              {
                "label": "Suspensión delantera",
                "value": "Doble horquilla con resortes helicoidales",
                "source": "hilux-pdf"
              },
              {
                "label": "Suspensión trasera",
                "value": "Eje rígido con ballestas",
                "source": "hilux-pdf"
              },
              {
                "label": "Frenos delanteros",
                "value": "Discos ventilados",
                "source": "hilux-pdf"
              },
              {
                "label": "Frenos traseros",
                "value": "Tambor",
                "source": "hilux-pdf"
              },
              {
                "label": "Dirección",
                "value": "Piñón y cremallera, asistencia hidráulica",
                "source": "hilux-pdf"
              },
              {
                "label": "Neumáticos",
                "value": "265/60 R18",
                "source": "hilux-pdf"
              }
            ]
          },
          {
            "id": "seguridad",
            "title": "Seguridad",
            "rows": [
              {
                "label": "Bolsas de aire",
                "value": "7",
                "source": "hilux-pdf"
              },
              {
                "label": "Asistencia de frenado",
                "value": "ABS + EBD + BA",
                "source": "hilux-pdf"
              },
              {
                "label": "Asistencias de conducción",
                "value": "VSC + TRC + HAC + TSC",
                "source": "hilux-pdf"
              },
              {
                "label": "Estructura",
                "value": "GOA",
                "source": "hilux-pdf"
              }
            ]
          },
          {
            "id": "interior",
            "title": "Interior y conectividad",
            "rows": [
              {
                "label": "Multimedia",
                "value": "Pantalla táctil, Bluetooth, AM/FM y USB",
                "source": "hilux-pdf"
              },
              {
                "label": "Integración",
                "value": "Apple CarPlay / Android Auto",
                "source": "hilux-pdf"
              },
              {
                "label": "Instrumentación",
                "value": "Velocímetro y tacómetro análogos; pantalla TFT de 4,2 pulgadas",
                "source": "hilux-pdf"
              }
            ]
          }
        ]
      }
    ],
    "sources": [
      "hilux-pdf",
      "hilux-aa"
    ],
    "notice": "Datos de doble cabina 2027 del PDF Toyota Colombia, mayo de 2026. No se aplican a Hilux Chasis ni GR-S. Interiores y fotos del motor pendientes de una coincidencia documentada por versión.",
    "media": [
      {
        "id": "hilux-stage",
        "src": "/assets/hilux.webp",
        "alt": "Toyota Hilux doble cabina, vista exterior",
        "source": "hilux-aa",
        "kind": "exterior",
        "note": "Imagen de referencia de la gama. El equipamiento y color pueden variar.",
        "status": "model-reviewed",
        "rights": "pending"
      }
    ]
  },
  {
    "id": "new:corolla-cross",
    "name": "Corolla Cross HEV",
    "kicker": "DOS MOTORES. UNA HISTORIA.",
    "summary": "Conoce la arquitectura híbrida y separa las cifras del motor térmico, el eléctrico y el sistema combinado.",
    "variants": [
      {
        "id": "xei-27",
        "label": "XEI HEV 1.8",
        "year": 2027,
        "source": "cross-aa",
        "headline": "121 hp anunciados",
        "groups": [
          {
            "id": "carroceria",
            "title": "Identificación y carrocería",
            "rows": [
              {
                "label": "Año anunciado",
                "value": "2027",
                "source": "cross-aa"
              },
              {
                "label": "Estructura anunciada",
                "value": "TNGA",
                "source": "cross-aa"
              },
              {
                "label": "Dimensiones y capacidades",
                "value": "Pendientes de transcripción del documento de esta versión 2027",
                "source": "cross-aa"
              }
            ]
          },
          {
            "id": "motor",
            "title": "Sistema híbrido",
            "rows": [
              {
                "label": "Motorización",
                "value": "1,8 L + motor eléctrico",
                "source": "cross-aa"
              },
              {
                "label": "Potencia combinada anunciada",
                "value": "121 hp; no sumar los valores de cada motor",
                "source": "cross-aa"
              },
              {
                "label": "Torque anunciado",
                "value": "163 Nm; el resumen del concesionario no precisa a qué motor corresponde",
                "source": "cross-aa"
              }
            ]
          },
          {
            "id": "transmision",
            "title": "Transmisión y tracción",
            "rows": [
              {
                "label": "Caja",
                "value": "e-CVT",
                "source": "cross-aa"
              },
              {
                "label": "Tracción",
                "value": "4x2",
                "source": "cross-aa"
              }
            ]
          },
          {
            "id": "chasis",
            "title": "Frenado y ruedas",
            "rows": [
              {
                "label": "Asistencias de frenado",
                "value": "ABS + EBD + BA",
                "source": "cross-aa"
              },
              {
                "label": "Diámetro del rin",
                "value": "17 pulgadas",
                "source": "cross-aa"
              }
            ]
          },
          {
            "id": "interior",
            "title": "Interior y conectividad",
            "rows": [
              {
                "label": "Pantalla multimedia",
                "value": "10 pulgadas",
                "source": "cross-aa"
              },
              {
                "label": "Tapicería anunciada",
                "value": "Cuero con costuras",
                "source": "cross-aa"
              },
              {
                "label": "Techo corredizo",
                "value": "No",
                "source": "cross-aa"
              },
              {
                "label": "Integración",
                "value": "Apple CarPlay / Android Auto",
                "source": "cross-aa"
              }
            ]
          },
          {
            "id": "seguridad",
            "title": "Seguridad",
            "rows": [
              {
                "label": "Bolsas de aire",
                "value": "7",
                "source": "cross-aa"
              },
              {
                "label": "Control crucero",
                "value": "Convencional",
                "source": "cross-aa"
              },
              {
                "label": "Estabilidad",
                "value": "VSC",
                "source": "cross-aa"
              },
              {
                "label": "Arranque en pendiente",
                "value": "HAC",
                "source": "cross-aa"
              }
            ]
          }
        ]
      },
      {
        "id": "seg-27",
        "label": "SEG HEV 1.8",
        "year": 2027,
        "source": "cross-aa",
        "headline": "121 hp anunciados",
        "groups": [
          {
            "id": "carroceria",
            "title": "Identificación y carrocería",
            "rows": [
              {
                "label": "Año anunciado",
                "value": "2027",
                "source": "cross-aa"
              },
              {
                "label": "Estructura anunciada",
                "value": "TNGA",
                "source": "cross-aa"
              },
              {
                "label": "Dimensiones y capacidades",
                "value": "Pendientes de transcripción del documento de esta versión 2027",
                "source": "cross-aa"
              }
            ]
          },
          {
            "id": "motor",
            "title": "Sistema híbrido",
            "rows": [
              {
                "label": "Motorización",
                "value": "1,8 L + motor eléctrico",
                "source": "cross-aa"
              },
              {
                "label": "Potencia combinada anunciada",
                "value": "121 hp; no sumar los valores de cada motor",
                "source": "cross-aa"
              },
              {
                "label": "Torque anunciado",
                "value": "163 Nm; el resumen del concesionario no precisa a qué motor corresponde",
                "source": "cross-aa"
              }
            ]
          },
          {
            "id": "transmision",
            "title": "Transmisión y tracción",
            "rows": [
              {
                "label": "Caja",
                "value": "e-CVT",
                "source": "cross-aa"
              },
              {
                "label": "Tracción",
                "value": "4x2",
                "source": "cross-aa"
              }
            ]
          },
          {
            "id": "chasis",
            "title": "Frenado y ruedas",
            "rows": [
              {
                "label": "Asistencias de frenado",
                "value": "ABS + EBD + BA",
                "source": "cross-aa"
              },
              {
                "label": "Diámetro del rin",
                "value": "18 pulgadas",
                "source": "cross-aa"
              },
              {
                "label": "Estacionamiento",
                "value": "Electrónico + Auto Hold",
                "source": "cross-aa"
              }
            ]
          },
          {
            "id": "interior",
            "title": "Interior y conectividad",
            "rows": [
              {
                "label": "Pantalla multimedia",
                "value": "10 pulgadas",
                "source": "cross-aa"
              },
              {
                "label": "Tapicería anunciada",
                "value": "Cuero con costuras",
                "source": "cross-aa"
              },
              {
                "label": "Techo corredizo",
                "value": "Sí",
                "source": "cross-aa"
              }
            ]
          },
          {
            "id": "seguridad",
            "title": "Seguridad",
            "rows": [
              {
                "label": "Bolsas de aire",
                "value": "7",
                "source": "cross-aa"
              },
              {
                "label": "Control crucero",
                "value": "Adaptativo",
                "source": "cross-aa"
              },
              {
                "label": "Toyota Safety Sense",
                "value": "Precolisión, alerta de salida de carril y luces altas automáticas",
                "source": "cross-aa"
              }
            ]
          }
        ]
      },
      {
        "id": "xei-18",
        "label": "XEI HEV 1.8 (archivo 2026)",
        "year": 2026,
        "source": "cross-pdf",
        "headline": "121 hp combinados",
        "groups": [
          {
            "id": "carroceria",
            "title": "Dimensiones y capacidades",
            "rows": [
              {
                "label": "Largo",
                "value": "4.460 mm",
                "source": "cross-pdf"
              },
              {
                "label": "Ancho",
                "value": "1.825 mm",
                "source": "cross-pdf"
              },
              {
                "label": "Altura",
                "value": "1.620 mm",
                "source": "cross-pdf"
              },
              {
                "label": "Distancia entre ejes",
                "value": "2.640 mm",
                "source": "cross-pdf"
              },
              {
                "label": "Altura al piso",
                "value": "161 mm",
                "source": "cross-pdf"
              },
              {
                "label": "Peso vacío",
                "value": "1.385 kg",
                "source": "cross-pdf"
              },
              {
                "label": "Peso bruto",
                "value": "1.850 kg",
                "source": "cross-pdf"
              },
              {
                "label": "Carga total",
                "value": "465 kg",
                "source": "cross-pdf"
              },
              {
                "label": "Tanque",
                "value": "9,5 galones",
                "source": "cross-pdf"
              }
            ]
          },
          {
            "id": "motor",
            "title": "Sistema híbrido",
            "rows": [
              {
                "label": "Cilindrada térmica",
                "value": "1.798 cm³",
                "source": "cross-pdf"
              },
              {
                "label": "Cilindros / válvulas",
                "value": "4 en línea / 16",
                "source": "cross-pdf"
              },
              {
                "label": "Potencia del motor térmico",
                "value": "97 hp a 5.200 rpm",
                "source": "cross-pdf"
              },
              {
                "label": "Torque del motor térmico",
                "value": "142 Nm a 3.600 rpm",
                "source": "cross-pdf"
              },
              {
                "label": "Potencia del motor eléctrico MG2",
                "value": "71 hp",
                "source": "cross-pdf"
              },
              {
                "label": "Torque del motor eléctrico MG2",
                "value": "163 Nm",
                "source": "cross-pdf"
              },
              {
                "label": "Potencia del sistema combinado",
                "value": "121 hp (no sumar los máximos de cada motor)",
                "source": "cross-pdf"
              },
              {
                "label": "Relación de compresión",
                "value": "13,0:1",
                "source": "cross-pdf"
              }
            ]
          },
          {
            "id": "transmision",
            "title": "Transmisión y tracción",
            "rows": [
              {
                "label": "Caja",
                "value": "E-CVT + reversa",
                "source": "cross-pdf"
              },
              {
                "label": "Tracción",
                "value": "2WD",
                "source": "cross-pdf"
              }
            ]
          },
          {
            "id": "chasis",
            "title": "Chasis y frenado",
            "rows": [
              {
                "label": "Delantera",
                "value": "MacPherson con resortes helicoidales",
                "source": "cross-pdf"
              },
              {
                "label": "Trasera",
                "value": "Barra de torsión con resortes helicoidales",
                "source": "cross-pdf"
              },
              {
                "label": "Dirección",
                "value": "Piñón y cremallera, asistencia eléctrica",
                "source": "cross-pdf"
              },
              {
                "label": "Frenos delanteros",
                "value": "Discos ventilados",
                "source": "cross-pdf"
              },
              {
                "label": "Frenos traseros",
                "value": "Discos sólidos",
                "source": "cross-pdf"
              },
              {
                "label": "Estacionamiento",
                "value": "Electrónico + Auto Hold",
                "source": "cross-pdf"
              },
              {
                "label": "Neumáticos",
                "value": "215/60 R17",
                "source": "cross-pdf"
              }
            ]
          },
          {
            "id": "interior",
            "title": "Interior y conectividad",
            "rows": [
              {
                "label": "Pantalla multimedia",
                "value": "10 pulgadas",
                "source": "cross-pdf"
              },
              {
                "label": "Integración",
                "value": "Apple CarPlay / Android Auto",
                "source": "cross-pdf"
              },
              {
                "label": "Sonido",
                "value": "6 parlantes",
                "source": "cross-pdf"
              },
              {
                "label": "Puertos",
                "value": "USB; consultar ubicación y tipo en el PDF",
                "source": "cross-pdf"
              }
            ]
          },
          {
            "id": "seguridad",
            "title": "Seguridad",
            "rows": [
              {
                "label": "Bolsas de aire",
                "value": "7",
                "source": "cross-pdf"
              },
              {
                "label": "Asistencias de frenado",
                "value": "ABS + EBD + BA",
                "source": "cross-pdf"
              },
              {
                "label": "Asistencias de conducción",
                "value": "VSC + TRC + HAC",
                "source": "cross-pdf"
              },
              {
                "label": "Sujeción infantil",
                "value": "ISOFIX",
                "source": "cross-pdf"
              },
              {
                "label": "Toyota Safety Sense",
                "value": "No incluido en XEI en esta ficha 2026",
                "source": "cross-pdf"
              }
            ]
          }
        ]
      },
      {
        "id": "seg-18",
        "label": "SEG HEV 1.8 (archivo 2026)",
        "year": 2026,
        "source": "cross-pdf",
        "headline": "121 hp combinados",
        "groups": [
          {
            "id": "carroceria",
            "title": "Dimensiones y capacidades",
            "rows": [
              {
                "label": "Largo",
                "value": "4.460 mm",
                "source": "cross-pdf"
              },
              {
                "label": "Ancho",
                "value": "1.825 mm",
                "source": "cross-pdf"
              },
              {
                "label": "Altura",
                "value": "1.620 mm",
                "source": "cross-pdf"
              },
              {
                "label": "Distancia entre ejes",
                "value": "2.640 mm",
                "source": "cross-pdf"
              },
              {
                "label": "Altura al piso",
                "value": "161 mm",
                "source": "cross-pdf"
              },
              {
                "label": "Peso vacío",
                "value": "1.385 kg",
                "source": "cross-pdf"
              },
              {
                "label": "Peso bruto",
                "value": "1.850 kg",
                "source": "cross-pdf"
              },
              {
                "label": "Carga total",
                "value": "465 kg",
                "source": "cross-pdf"
              },
              {
                "label": "Tanque",
                "value": "9,5 galones",
                "source": "cross-pdf"
              }
            ]
          },
          {
            "id": "motor",
            "title": "Sistema híbrido",
            "rows": [
              {
                "label": "Cilindrada térmica",
                "value": "1.798 cm³",
                "source": "cross-pdf"
              },
              {
                "label": "Cilindros / válvulas",
                "value": "4 en línea / 16",
                "source": "cross-pdf"
              },
              {
                "label": "Potencia del motor térmico",
                "value": "97 hp a 5.200 rpm",
                "source": "cross-pdf"
              },
              {
                "label": "Torque del motor térmico",
                "value": "142 Nm a 3.600 rpm",
                "source": "cross-pdf"
              },
              {
                "label": "Potencia del motor eléctrico MG2",
                "value": "71 hp",
                "source": "cross-pdf"
              },
              {
                "label": "Torque del motor eléctrico MG2",
                "value": "163 Nm",
                "source": "cross-pdf"
              },
              {
                "label": "Potencia del sistema combinado",
                "value": "121 hp (no sumar los máximos de cada motor)",
                "source": "cross-pdf"
              },
              {
                "label": "Relación de compresión",
                "value": "13,0:1",
                "source": "cross-pdf"
              }
            ]
          },
          {
            "id": "transmision",
            "title": "Transmisión y tracción",
            "rows": [
              {
                "label": "Caja",
                "value": "E-CVT + reversa",
                "source": "cross-pdf"
              },
              {
                "label": "Tracción",
                "value": "2WD",
                "source": "cross-pdf"
              }
            ]
          },
          {
            "id": "chasis",
            "title": "Chasis y frenado",
            "rows": [
              {
                "label": "Delantera",
                "value": "MacPherson con resortes helicoidales",
                "source": "cross-pdf"
              },
              {
                "label": "Trasera",
                "value": "Barra de torsión con resortes helicoidales",
                "source": "cross-pdf"
              },
              {
                "label": "Dirección",
                "value": "Piñón y cremallera, asistencia eléctrica",
                "source": "cross-pdf"
              },
              {
                "label": "Frenos delanteros",
                "value": "Discos ventilados",
                "source": "cross-pdf"
              },
              {
                "label": "Frenos traseros",
                "value": "Discos sólidos",
                "source": "cross-pdf"
              },
              {
                "label": "Estacionamiento",
                "value": "Electrónico + Auto Hold",
                "source": "cross-pdf"
              },
              {
                "label": "Neumáticos",
                "value": "225/50 R18",
                "source": "cross-pdf"
              }
            ]
          },
          {
            "id": "interior",
            "title": "Interior y conectividad",
            "rows": [
              {
                "label": "Pantalla multimedia",
                "value": "10 pulgadas",
                "source": "cross-pdf"
              },
              {
                "label": "Integración",
                "value": "Apple CarPlay / Android Auto",
                "source": "cross-pdf"
              },
              {
                "label": "Sonido",
                "value": "6 parlantes",
                "source": "cross-pdf"
              },
              {
                "label": "Puertos",
                "value": "USB; consultar ubicación y tipo en el PDF",
                "source": "cross-pdf"
              }
            ]
          },
          {
            "id": "seguridad",
            "title": "Seguridad",
            "rows": [
              {
                "label": "Bolsas de aire",
                "value": "7",
                "source": "cross-pdf"
              },
              {
                "label": "Asistencias de frenado",
                "value": "ABS + EBD + BA",
                "source": "cross-pdf"
              },
              {
                "label": "Asistencias de conducción",
                "value": "VSC + TRC + HAC",
                "source": "cross-pdf"
              },
              {
                "label": "Sujeción infantil",
                "value": "ISOFIX",
                "source": "cross-pdf"
              },
              {
                "label": "Toyota Safety Sense",
                "value": "Incluido en SEG: consultar funciones en el PDF",
                "source": "cross-pdf"
              }
            ]
          }
        ]
      }
    ],
    "sources": [
      "cross-pdf",
      "cross-aa"
    ],
    "notice": "Las configuraciones 2027 muestran solamente datos del resumen y la tabla de Autoamérica. El PDF localizado contiene una hoja 2026 (página 2, agosto de 2025) y material 2027: los datos 2026 se conservan como archivo separado, no como equivalentes. La fotografía de la gama actual se muestra solo al seleccionar 2027.",
    "media": [
      {
        "id": "cross-stage",
        "src": "/assets/corolla-cross.webp",
        "alt": "Toyota Corolla Cross HEV, imagen comercial de la gama",
        "source": "cross-aa",
        "kind": "exterior",
        "note": "Imagen de la gama HEV publicada por Autoamérica junto al catálogo 2027. El color y equipamiento final deben confirmarse.",
        "status": "model-reviewed",
        "rights": "pending",
        "variants": [
          "xei-27",
          "seg-27"
        ]
      }
    ]
  },
  {
    "id": "new:rav4",
    "name": "RAV4 HEV",
    "kicker": "UNA NUEVA FORMA DE EXPLORAR",
    "summary": "Una ficha de consulta para RAV4 HEV, manteniendo separado su equipamiento del RAV4 enchufable.",
    "variants": [
      {
        "id": "xle",
        "label": "XLE HEV 2.5",
        "year": 2026,
        "source": "rav4-aa",
        "headline": "HEV 4x4",
        "groups": [
          {
            "id": "carroceria",
            "title": "Identificación",
            "rows": [
              {
                "label": "Gama",
                "value": "RAV4 HEV",
                "source": "rav4-aa"
              },
              {
                "label": "Año anunciado",
                "value": "2026",
                "source": "rav4-aa"
              },
              {
                "label": "Dimensiones, pesos y capacidades",
                "value": "Pendientes de ficha técnica específica HEV",
                "source": "rav4-aa"
              }
            ]
          },
          {
            "id": "motor",
            "title": "Motorización",
            "rows": [
              {
                "label": "Cilindrada comercial",
                "value": "2,5 L",
                "source": "rav4-aa"
              },
              {
                "label": "Tecnología",
                "value": "Híbrida HEV (no PHEV)",
                "source": "rav4-aa"
              },
              {
                "label": "Potencia anunciada",
                "value": "184 hp; la página no distingue el alcance térmico/combinado",
                "source": "rav4-aa"
              },
              {
                "label": "Torque anunciado",
                "value": "221 Nm; alcance del dato por confirmar",
                "source": "rav4-aa"
              }
            ]
          },
          {
            "id": "transmision",
            "title": "Transmisión y tracción",
            "rows": [
              {
                "label": "Transmisión anunciada",
                "value": "Automática",
                "source": "rav4-aa"
              },
              {
                "label": "Tracción anunciada",
                "value": "4x4",
                "source": "rav4-aa"
              }
            ]
          },
          {
            "id": "chasis",
            "title": "Ruedas",
            "rows": [
              {
                "label": "Neumáticos",
                "value": "235/60 R18",
                "source": "rav4-aa"
              },
              {
                "label": "Rines",
                "value": "18 x 7,5J; aluminio negro",
                "source": "rav4-aa"
              }
            ]
          },
          {
            "id": "interior",
            "title": "Interior y conectividad",
            "rows": [
              {
                "label": "Pantalla multimedia",
                "value": "10,5 pulgadas",
                "source": "rav4-aa"
              },
              {
                "label": "Carga de smartphone",
                "value": "1 cargador de 15 W",
                "source": "rav4-aa"
              },
              {
                "label": "Parlantes",
                "value": "6",
                "source": "rav4-aa"
              }
            ]
          },
          {
            "id": "seguridad",
            "title": "Seguridad y chasis",
            "rows": [
              {
                "label": "Monitor panorámico 360°",
                "value": "No",
                "source": "rav4-aa"
              },
              {
                "label": "Equipamiento técnico",
                "value": "Pendiente de documentación HEV de esta versión. No se heredan datos de PHEV ni de años anteriores.",
                "source": "rav4-aa"
              }
            ]
          }
        ]
      },
      {
        "id": "limited",
        "label": "Limited HEV 2.5",
        "year": 2026,
        "source": "rav4-aa",
        "headline": "HEV 4x4",
        "groups": [
          {
            "id": "carroceria",
            "title": "Identificación",
            "rows": [
              {
                "label": "Gama",
                "value": "RAV4 HEV",
                "source": "rav4-aa"
              },
              {
                "label": "Año anunciado",
                "value": "2026",
                "source": "rav4-aa"
              },
              {
                "label": "Dimensiones, pesos y capacidades",
                "value": "Pendientes de ficha técnica específica HEV",
                "source": "rav4-aa"
              }
            ]
          },
          {
            "id": "motor",
            "title": "Motorización",
            "rows": [
              {
                "label": "Cilindrada comercial",
                "value": "2,5 L",
                "source": "rav4-aa"
              },
              {
                "label": "Tecnología",
                "value": "Híbrida HEV (no PHEV)",
                "source": "rav4-aa"
              },
              {
                "label": "Potencia anunciada",
                "value": "184 hp; la página no distingue el alcance térmico/combinado",
                "source": "rav4-aa"
              },
              {
                "label": "Torque anunciado",
                "value": "221 Nm; alcance del dato por confirmar",
                "source": "rav4-aa"
              }
            ]
          },
          {
            "id": "transmision",
            "title": "Transmisión y tracción",
            "rows": [
              {
                "label": "Transmisión anunciada",
                "value": "Automática",
                "source": "rav4-aa"
              },
              {
                "label": "Tracción anunciada",
                "value": "4x4",
                "source": "rav4-aa"
              }
            ]
          },
          {
            "id": "chasis",
            "title": "Ruedas",
            "rows": [
              {
                "label": "Neumáticos",
                "value": "235/50 R20",
                "source": "rav4-aa"
              },
              {
                "label": "Rines",
                "value": "20 x 7,5J; aluminio bitono",
                "source": "rav4-aa"
              }
            ]
          },
          {
            "id": "interior",
            "title": "Interior y conectividad",
            "rows": [
              {
                "label": "Pantalla multimedia",
                "value": "12,9 pulgadas",
                "source": "rav4-aa"
              },
              {
                "label": "Carga de smartphone",
                "value": "2 cargadores de 15 W",
                "source": "rav4-aa"
              },
              {
                "label": "Parlantes",
                "value": "9",
                "source": "rav4-aa"
              }
            ]
          },
          {
            "id": "seguridad",
            "title": "Seguridad y chasis",
            "rows": [
              {
                "label": "Monitor panorámico 360°",
                "value": "Sí",
                "source": "rav4-aa"
              },
              {
                "label": "Equipamiento técnico",
                "value": "Pendiente de documentación HEV de esta versión. No se heredan datos de PHEV ni de años anteriores.",
                "source": "rav4-aa"
              }
            ]
          }
        ]
      }
    ],
    "sources": [
      "rav4-aa"
    ],
    "notice": "Cobertura técnica parcial: datos textuales de Autoamérica. No se localizó un PDF HEV inequívoco. La ficha RAV4 del portal de ventas Toyota conduce a PHEV; no se usa como equivalente. Fotografías HEV pendientes de validación visual y de versión.",
    "media": []
  }
];

export function findTechnicalProfile(id:string,origin?:string){
  // Marketing may edit a canonical model into a different vehicle. Never attach specs by ID alone then.
  if(origin==='marketing') return undefined;
  return technicalProfiles.find(p=>p.id===id);
}
export function eligibleMedia(profile:TechnicalProfile,variantId:string){
  return profile.media.filter(m=>!m.variants || m.variants.includes(variantId));
}
