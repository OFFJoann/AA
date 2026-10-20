export type Vehicle = { id: string; name: string; category: string; power: string; image: string; description: string; url: string; tag: string; price?: number; year?: number; location?: string; transmission?: string; origin?: 'reference'|'marketing' };
export const vehicles: Vehicle[] = [
  { id:'corolla-cross', name:'Corolla Cross HEV', category:'SUV', power:'Híbrido', image:'/assets/corolla-cross.webp', description:'La ciudad, los planes y todo lo que viene después.', url:'https://autoamerica.com.co/vehiculo/corolla-cross-hv/', tag:'TU DÍA A DÍA, CON OTRA ENERGÍA' },
  { id:'prado', name:'Land Cruiser Prado', category:'SUV', power:'Gasolina / Diésel', image:'/assets/prado.webp', description:'Hay caminos que merecen una nueva perspectiva.', url:'https://autoamerica.com.co/vehiculo/toyota-prado/', tag:'EL CAMINO ES SOLO EL COMIENZO' },
  { id:'hilux', name:'Hilux', category:'Pick-up', power:'Gasolina / Diésel', image:'/assets/hilux.webp', description:'Para los que hacen que las cosas sucedan.', url:'https://autoamerica.com.co/vehiculo/toyota-hilux/', tag:'LISTA PARA TU SIGUIENTE RETO' },
  { id:'yaris-cross', name:'Yaris Cross HEV', category:'SUV', power:'Híbrido', image:'/assets/yaris-cross.webp', description:'Una forma diferente de vivir cada recorrido.', url:'https://autoamerica.com.co/vehiculo/yaris-cross/', tag:'HAZ ESPACIO PARA MÁS' },
  { id:'rav4', name:'RAV4 HEV', category:'SUV', power:'Híbrido', image:'/assets/rav4.webp', description:'Encuentra el equilibrio entre tus planes y tu camino.', url:'https://autoamerica.com.co/vehiculo/rav4-hev-2/', tag:'TU PRÓXIMA ESCAPADA' },
];
export const parts = [
  {id:'body', name:'Carrocería', number:'01', label:'Cada detalle tiene un propósito.', description:'Explora los paneles exteriores y la estructura del vehículo. Separa las capas para descubrir lo que hay debajo.', examples:'Paneles · Capó · Puertas · Techo', image:'/assets/prado.webp'},
  {id:'engine', name:'Motor y transmisión', number:'02', label:'El origen de cada movimiento.', description:'Localiza el conjunto motriz y conoce su relación con los demás sistemas. Consulta con un asesor la pieza específica que necesitas.', examples:'Motor · Filtros · Transmisión', image:'/assets/part-filter.webp'},
  {id:'brakes', name:'Sistema de frenos', number:'03', label:'Confianza en cada parada.', description:'Descubre la ubicación de discos y conjuntos de frenado. La referencia correcta depende de la versión y del VIN de tu vehículo.', examples:'Discos · Pastillas · Conjuntos de freno', image:'/assets/part-disc.webp'},
  {id:'suspension', name:'Suspensión', number:'04', label:'El camino se siente diferente.', description:'Explora amortiguadores y componentes de suspensión en una vista separada. Identifica el sistema antes de solicitar asesoría.', examples:'Amortiguadores · Resortes · Ejes', image:'/assets/part-suspension.webp'},
  {id:'battery', name:'Sistema eléctrico', number:'05', label:'Energía para seguir adelante.', description:'Ubica la batería y su relación con el conjunto del vehículo. Su disposición es esquemática en esta demostración.', examples:'Batería · Conexiones eléctricas', image:''},
];
export const locations = [
  {name:'Palacé', area:'Medellín', city:'Medellín', address:'Cra. 50 #38-50', services:'Vehículos nuevos · Taller · Repuestos', hours:'Comercial: lun–vie 8:00 a. m.–6:00 p. m. · sáb 9:00 a. m.–1:00 p. m.'},
  {name:'Sur', area:'Envigado', city:'Envigado', address:'Cra. 48 #44 sur-151 · Av. Las Vegas', services:'Vehículos nuevos · Taller · Repuestos', hours:'Comercial: lun–vie 8:00 a. m.–6:00 p. m. · sáb 9:00 a. m.–1:00 p. m.'},
  {name:'Oriente', area:'Rionegro', city:'Rionegro', address:'CC Jardines Llanogrande · Sótano · Don Diego–Llanogrande km 8', services:'Taller', hours:'Taller: lun–vie 8:30 a. m.–4:30 p. m. · sáb 8:00 a. m.–1:00 p. m.'},
  {name:'Apartadó', area:'Urabá', city:'Apartadó', address:'Cra. 100 #77-502 · Mall La 100, local 9', services:'Vehículos nuevos · Usados', hours:'Comercial: lun–vie 8:30 a. m.–12:00 m. y 2:00–6:00 p. m. · sáb 9:00 a. m.–1:00 p. m.'},
  {name:'Usados Medellín', area:'Medellín', city:'Medellín', address:'Cra. 46 #37-53 · Glorieta San Diego', services:'Vehículos usados', hours:'Comercial: lun–vie 8:00 a. m.–6:00 p. m. · sáb 9:00 a. m.–1:00 p. m.'},
  {name:'Taller Apartadó', area:'Urabá', city:'Apartadó', address:'Cra. 103 A #97-24 · Barrio Nuevo', services:'Taller', hours:'Taller: lun–vie 7:30 a. m.–12:00 m. y 2:00–5:00 p. m. · sáb 9:00 a. m.–1:00 p. m.'},
];
export const sourceLinks = [
  ['Portal y modelos', 'https://autoamerica.com.co/home/'],
  ['Inventario de usados', 'https://autoamerica.com.co/todos-los-usados/'],
  ['Fuente de la muestra de usados', 'https://autoamerica.com.co/usados-toyota/'],
  ['Repuestos y proceso con VIN', 'https://autoamerica.com.co/repuesto/'],
  ['Servicios de posventa', 'https://autoamerica.com.co/servicios-posventa/'],
  ['Sedes y horarios', 'https://autoamerica.com.co/sedes-y-horarios/'],
];
