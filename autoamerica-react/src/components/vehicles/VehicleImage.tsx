import { useState } from 'react';
import { Camera } from 'lucide-react';
import { safeImage } from '../../lib/presentation';
export default function VehicleImage({src,alt,className='',priority=false}:{src?:string;alt:string;className?:string;priority?:boolean}) {
  const [failed,setFailed]=useState('');
  const image=safeImage(src);
  return image && failed!==image
    ? <img className={className} src={image} alt={alt} loading={priority?'eager':'lazy'} fetchPriority={priority?'high':'auto'} decoding="async" onError={()=>setFailed(image)}/>
    : <div className={`aa-image-pending ${className}`} role="img" aria-label={`Fotografía pendiente de ${alt}`}><Camera size={30}/><strong>Fotografía en preparación</strong><span>Consulta imágenes de esta unidad con un asesor.</span></div>;
}
