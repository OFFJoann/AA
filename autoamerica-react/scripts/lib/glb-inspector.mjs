/** Read-only inventory of a glTF 2.0 binary container. No network, extraction or model modification. */
import { TextDecoder } from 'node:util';
export function inspectGlb(bytes) {
  if (!Buffer.isBuffer(bytes) || bytes.length < 20) throw new Error('Archivo demasiado corto para GLB.');
  if (bytes.readUInt32LE(0) !== 0x46546c67) throw new Error('No es GLB: una imagen o pagina web no contiene mallas 3D.');
  if (bytes.readUInt32LE(4) !== 2) throw new Error('Solo GLB/glTF 2.0.');
  if (bytes.readUInt32LE(8) !== bytes.length) throw new Error('Longitud del contenedor incorrecta.');
  let offset=12, document=null, chunkCount=0;
  while(offset < bytes.length) {
    if(offset+8 > bytes.length) throw new Error('Cabecera de chunk truncada.');
    const length=bytes.readUInt32LE(offset), type=bytes.readUInt32LE(offset+4);
    if(length%4!==0 || length===0 || offset+8+length>bytes.length) throw new Error('Chunk incorrecto.');
    if(chunkCount===0 && type!==0x4e4f534a) throw new Error('El primer chunk debe ser JSON.');
    if(type===0x4e4f534a) {
      if(document || length>16*1024*1024) throw new Error('JSON repetido o demasiado grande.');
      document=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes.subarray(offset+8,offset+8+length)).trimEnd());
    }
    offset+=8+length;chunkCount++;
  }
  if(!document || document.asset?.version !== '2.0') throw new Error('Falta asset.version 2.0.');
  const nodes=document.nodes||[], meshes=document.meshes||[];
  if(!Array.isArray(nodes)||!Array.isArray(meshes)) throw new Error('nodes/meshes deben ser arrays.');
  const parents=new Map();
  for(const [i,n] of nodes.entries()) {
    if(n.mesh!==undefined && (!Number.isInteger(n.mesh)||n.mesh<0||n.mesh>=meshes.length)) throw new Error('Indice de malla invalido.');
    if(n.children!==undefined && !Array.isArray(n.children)) throw new Error('children no es un array.');
    for(const c of n.children||[]) {
      if(!Number.isInteger(c)||c<0||c>=nodes.length||parents.has(c)) throw new Error('Hijo invalido o con varios padres.');
      parents.set(c,i);
    }
  }
  // An iterative walk avoids recursion overflow on a malformed graph.
  for(let i=0;i<nodes.length;i++) {
    let cursor=i;const seen=new Set();
    while(parents.has(cursor)){if(seen.has(cursor))throw new Error('Ciclo en la jerarquia.');seen.add(cursor);cursor=parents.get(cursor);}
  }
  const rows=nodes.flatMap((n,i)=>n.mesh===undefined?[]:[{
    nodeIndex:i, nodeName:typeof n.name==='string'?n.name:null, meshIndex:n.mesh,
    meshName:typeof meshes[n.mesh].name==='string'?meshes[n.mesh].name:null,
    parentNode:parents.get(i)??null, primitiveCount:Array.isArray(meshes[n.mesh].primitives)?meshes[n.mesh].primitives.length:0,
    usesSkin:n.skin!==undefined, hasMatrix:n.matrix!==undefined,
    physicalPartVerified:false
  }]);
  const seenNames=new Set(), duplicateNames=new Set();
  for(const row of rows){if(row.nodeName && seenNames.has(row.nodeName))duplicateNames.add(row.nodeName);if(row.nodeName)seenNames.add(row.nodeName);}
  const externalReferences=[...(document.buffers||[]),...(document.images||[])].filter(x=>typeof x.uri==='string'&&!x.uri.startsWith('data:')).length;
  const warnings=['Inventario estructural, no validacion glTF completa ni certificacion de piezas o compatibilidad.','Ningun nodo equivale automaticamente a una referencia OEM. No se verifican superficies, posicion, colisiones ni piezas ocultas.'];
  if(rows.length<2)warnings.push('Menos de dos nodos con malla: revisar si hay objetos separables antes de disenar el despiece.');
  if(rows.some(r=>!r.nodeName)||duplicateNames.size)warnings.push('Hay nombres ausentes o repetidos. Se requiere identificacion estable para mapear componentes.');
  if(rows.some(r=>r.usesSkin))warnings.push('Contiene nodos con skin: revisar deformaciones antes de separarlos.');
  if(externalReferences)warnings.push('Contiene referencias externas. No se descargaron ni se abrieron.');
  return {schema:1,bytes:bytes.length,nodeCount:nodes.length,meshCount:meshes.length,meshNodeCount:rows.length,
    physicalPartsVerified:0,animationCount:(document.animations||[]).length,externalReferences,
    requiredExtensions:document.extensionsRequired||[],duplicateNames:[...duplicateNames],nodes:rows,warnings};
}
