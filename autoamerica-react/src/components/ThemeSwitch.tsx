import { useEffect, useState } from 'react';
import { Moon,Sun } from 'lucide-react';
export default function ThemeSwitch() {
  const [theme,setTheme]=useState<'light'|'dark'>(()=>{try{return localStorage.getItem('aa:theme')==='dark'?'dark':'light';}catch{return 'light';}});
  useEffect(()=>{document.documentElement.dataset.theme=theme;try{localStorage.setItem('aa:theme',theme);}catch{/* Storage can be disabled. */}},[theme]);
  return <button className="icon-button aa-theme" onClick={()=>setTheme(theme==='dark'?'light':'dark')} aria-label={`Activar tema ${theme==='dark'?'claro':'oscuro'}`} title={`Tema ${theme==='dark'?'claro':'oscuro'}`}>{theme==='dark'?<Sun size={18}/>:<Moon size={18}/>}</button>;
}
