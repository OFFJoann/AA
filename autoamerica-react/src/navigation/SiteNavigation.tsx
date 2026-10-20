import { useEffect, useSyncExternalStore } from 'react';
import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { canonicalLocation } from '../lib/routes';
const eventName='aa:navigate';
function snapshot(){return window.location.href;}
function subscribe(notify:()=>void){
  window.addEventListener(eventName,notify);window.addEventListener('popstate',notify);window.addEventListener('hashchange',notify);
  return ()=>{window.removeEventListener(eventName,notify);window.removeEventListener('popstate',notify);window.removeEventListener('hashchange',notify);};
}
export function useSiteLocation(){
  const href=useSyncExternalStore(subscribe,snapshot,snapshot);
  useEffect(()=>{
    const current=window.location.pathname+window.location.search+window.location.hash;
    const canonical=canonicalLocation(current,window.location.origin);
    if(current!==canonical){history.replaceState(history.state,'',canonical);window.dispatchEvent(new Event(eventName));}
  },[href]);
  return new URL(canonicalLocation(href,window.location.origin),window.location.origin);
}
export function navigate(to:string){
  const next=canonicalLocation(to,window.location.origin);
  const current=window.location.pathname+window.location.search+window.location.hash;
  if(next===current){window.scrollTo({top:0,behavior:'instant'});return;}
  history.replaceState({...history.state,aaScroll:window.scrollY},'',current);
  history.pushState({aaScroll:0},'',next);
  window.dispatchEvent(new Event(eventName));
}
export function SiteLink({href,children,onClick,...rest}:AnchorHTMLAttributes<HTMLAnchorElement>&{href:string;children:ReactNode}){
  return <a {...rest} href={href} onClick={event=>{
    onClick?.(event);
    if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||rest.download||rest.target==='_blank')return;
    const target=new URL(href,window.location.href);
    if(target.origin!==window.location.origin)return;
    // Local anchors (specifications / skip link) keep native semantics.
    if(target.pathname===window.location.pathname&&target.search===window.location.search&&target.hash)return;
    event.preventDefault();navigate(target.pathname+target.search+target.hash);
  }}>{children}</a>;
}
/** Mount INSIDE Suspense so position is restored once the page, not its loader, exists. */
export function RouteReady({path,children}:{path:string;children:ReactNode}){
  useEffect(()=>{
    const previous=history.scrollRestoration;history.scrollRestoration='manual';
    const frame=requestAnimationFrame(()=>{
      let anchor:HTMLElement|null=null;
      try{anchor=document.getElementById(decodeURIComponent(window.location.hash.slice(1)));}catch{}
      if(anchor)anchor.scrollIntoView({behavior:'instant'});
      else window.scrollTo({top:Number(history.state?.aaScroll)||0,behavior:'instant'});
      document.getElementById('contenido')?.focus({preventScroll:true});
    });
    return ()=>{cancelAnimationFrame(frame);history.scrollRestoration=previous;};
  },[path]);
  return <>{children}</>;
}
