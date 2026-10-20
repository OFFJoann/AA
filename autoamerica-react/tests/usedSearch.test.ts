import assert from 'node:assert/strict';
import test from 'node:test';
import { emptyFilters,normalize,searchUsed,facetOptions,toggleFacet,readUsedFilters,writeUsedFilters,rangeError } from '../src/lib/usedSearch.ts';
import { mapLinks } from '../src/lib/mapLinks.ts';
import { safeImage,safeExternalUrl,formatMoney } from '../src/lib/presentation.ts';
import type { UsedVehicle } from '../src/catalog.ts';

// Synthetic fixtures stay in tests. They must NEVER be added to the public inventory.
const fixture:UsedVehicle[]=[
 {id:'test:1',brand:'Toyota',model:'Corolla',name:'Toyota Corolla XEI',year:2022,price:90000000,mileage:40000,transmission:'Automática',power:'Híbrido',bodyType:'Sedán',location:'Medellín',image:'',url:'',certified:true},
 {id:'test:2',brand:'Mazda',model:'CX-5',name:'Mazda CX-5 Touring',year:2020,price:110000000,mileage:60000,transmission:'Automática',power:'Gasolina',bodyType:'SUV',location:'Envigado',image:'',url:''},
 {id:'test:3',brand:'Renault',model:'Duster',name:'Renault Duster Zen',year:2024,price:85000000,mileage:0,transmission:'Mecánica',power:'Diésel',bodyType:'SUV',location:'Rionegro',image:'',url:''},
 {id:'test:4',brand:'Toyota',model:'Hilux',name:'Toyota Hilux SRV',year:2023,price:150000000,mileage:20000,transmission:'Manual',power:'Diésel',bodyType:'Pickup',location:'Medellín',image:'',url:''},
 {id:'test:5',name:'Unidad sin datos confirmados',year:0,price:0,mileage:-1,transmission:'Por confirmar',location:'',image:'',url:''},
];
const ids=(f=emptyFilters(),saved:string[]=[])=>searchUsed(fixture,f,saved).map(v=>v.id);

test('all brands remain visible without filters',()=>assert.equal(ids().length,5));
test('brand selection supports Mazda (not only Toyota)',()=>assert.deepEqual(ids({...emptyFilters(),brand:['Mazda']}),['test:2']));
test('multiple brands use OR within the same facet',()=>assert.deepEqual(ids({...emptyFilters(),brand:['Mazda','Renault']}),['test:2','test:3']));
test('different facets combine with AND',()=>assert.deepEqual(ids({...emptyFilters(),brand:['Toyota'],model:['Hilux'],location:['Medellín']}),['test:4']));
test('accent-insensitive location and search',()=>assert.deepEqual(ids({...emptyFilters(),query:'toyota medellin'}),['test:1','test:4']));
test('search tolerates leading spaces and unordered tokens',()=>assert.deepEqual(ids({...emptyFilters(),query:'  2022 corolla  '}),['test:1']));
test('brand changes clear dependent model selection',()=>assert.deepEqual(toggleFacet({...emptyFilters(),brand:['Toyota'],model:['Corolla']},'brand','Mazda').model,[]));
test('price range includes both boundaries',()=>assert.deepEqual(ids({...emptyFilters(),priceMin:'90000000',priceMax:'110000000'}),['test:1','test:2']));
test('unknown prices are excluded when a price range is active',()=>assert.deepEqual(ids({...emptyFilters(),priceMax:'100000000'}),['test:1','test:3']));
test('zero actual mileage is supported',()=>assert.deepEqual(ids({...emptyFilters(),mileageMax:'0'}),['test:3']));
test('unknown mileage -1 is not interpreted as low mileage',()=>assert.deepEqual(ids({...emptyFilters(),mileageMin:'0',mileageMax:'20000'}),['test:3','test:4']));
test('year range includes boundaries',()=>assert.deepEqual(ids({...emptyFilters(),yearMin:'2022',yearMax:'2023'}),['test:1','test:4']));
test('inverted ranges give a useful message and no results',()=>{const f={...emptyFilters(),priceMin:'200',priceMax:'100'};assert.match(rangeError(f),/mínimo/);assert.deepEqual(ids(f),[]);});
test('negative ranges rejected',()=>assert.ok(rangeError({...emptyFilters(),priceMin:'-1'})));
test('NaN ranges rejected',()=>assert.ok(rangeError({...emptyFilters(),yearMin:'NaN'})));
test('empty results are valid',()=>assert.deepEqual(ids({...emptyFilters(),query:'noexiste'}),[]));
test('manual and mechanical transmission normalize to Manual',()=>assert.deepEqual(ids({...emptyFilters(),transmission:['Manual']}),['test:3','test:4']));
test('certification is never inferred',()=>assert.deepEqual(ids({...emptyFilters(),certified:true}),['test:1']));
test('favorite filter uses only selected IDs',()=>assert.deepEqual(ids({...emptyFilters(),favorites:true},['test:2']),['test:2']));
test('price ascending puts unknown prices last',()=>assert.deepEqual(ids({...emptyFilters(),sort:'price-asc'}),['test:3','test:1','test:2','test:4','test:5']));
test('price descending puts unknown prices last',()=>assert.deepEqual(ids({...emptyFilters(),sort:'price-desc'}),['test:4','test:2','test:1','test:3','test:5']));
test('year descending',()=>assert.deepEqual(ids({...emptyFilters(),sort:'year-desc'}),['test:3','test:4','test:1','test:2','test:5']));
test('mileage ascending',()=>assert.deepEqual(ids({...emptyFilters(),sort:'mileage-asc'}),['test:3','test:4','test:1','test:2','test:5']));
test('sort does not mutate original inventory',()=>{const before=fixture.map(v=>v.id);searchUsed(fixture,{...emptyFilters(),sort:'price-desc'});assert.deepEqual(fixture.map(v=>v.id),before);});
test('model facet respects selected brands',()=>assert.deepEqual(facetOptions(fixture,{...emptyFilters(),brand:['Mazda']},'model').map(o=>o.label),['CX-5']));
test('facet counts ignore only their own selection',()=>{const opts=facetOptions(fixture,{...emptyFilters(),brand:['Mazda'],transmission:['Automática']},'brand');assert.equal(opts.find(o=>o.label==='Toyota')?.count,1);});
test('unknown attributes do not acquire an invented brand',()=>assert.ok(facetOptions(fixture,emptyFilters(),'brand').some(o=>o.label==='Por confirmar')));
test('URL roundtrip keeps multi-selections, range and sort',()=>{const f={...emptyFilters(),brand:['Toyota','Mazda'],priceMin:'50000000',location:['Medellín'],sort:'price-desc' as const};assert.deepEqual(readUsedFilters(writeUsedFilters('',f)),f);});
test('unrelated campaign parameters are preserved',()=>assert.match(writeUsedFilters('?utm_source=mail',emptyFilters()),/utm_source=mail/));
test('clearing filters removes all u_ params',()=>assert.equal(writeUsedFilters('?u_brand=Mazda&utm_source=mail',emptyFilters()),'utm_source=mail'));
test('invalid URL sort and numbers use safe defaults',()=>{const f=readUsedFilters('?u_sort=eval&u_yearMin=-1');assert.equal(f.sort,'relevance');assert.equal(f.yearMin,'');});
test('normalization strips accents',()=>assert.equal(normalize(' Diésel '),'diesel'));
test('quarantined reference images never appear',()=>{for(const name of ['rav4','used-rav4','used-fortuner'])assert.equal(safeImage(`/assets/${name}.webp`),'');});
test('used images may come from a multibrand HTTPS source',()=>assert.equal(safeImage('https://inventory.example/mazda.jpg'),'https://inventory.example/mazda.jpg'));
test('script URLs are rejected',()=>assert.equal(safeExternalUrl('javascript:alert(1)'),'https://autoamerica.com.co/contacto/'));
test('script image URLs are rejected',()=>assert.equal(safeImage('javascript:alert(1)'),''));
test('photo uploads allow raster formats, not SVG data scripts',()=>{assert.ok(safeImage('data:image/webp;base64,abc'));assert.equal(safeImage('data:image/svg+xml;base64,abc'),'');});
test('zero/missing price is not advertised as free',()=>assert.equal(formatMoney(0),'Consultar precio'));
const sede={name:'Sur',area:'Envigado',city:'Envigado',address:'Cra. 48 #44 sur-151',services:'Nuevos',hours:'Por confirmar'};
test('maps URLs preserve address # characters by encoding',()=>assert.equal(new URL(mapLinks(sede).directions).searchParams.get('destination'),`${sede.address}, Envigado, Antioquia, Colombia`));
test('maps does not request location or define a false origin',()=>assert.equal(new URL(mapLinks(sede).directions).searchParams.has('origin'),false));
test('reviewed Place IDs are propagated',()=>{const links=mapLinks({...sede,googlePlaceId:'test-only-place-id'});assert.equal(new URL(links.search).searchParams.get('query_place_id'),'test-only-place-id');assert.equal(new URL(links.directions).searchParams.get('destination_place_id'),'test-only-place-id');});
test('embed URL rejects non Google host',()=>assert.match(mapLinks({...sede,googleEmbedUrl:'https://evil.example/embed'}).embed,/^https:\/\/www\.google\.com\/maps/));
test('reviewed official Google embed accepted',()=>assert.equal(mapLinks({...sede,googleEmbedUrl:'https://www.google.com/maps/embed?pb=reviewed'}).embed,'https://www.google.com/maps/embed?pb=reviewed'));
