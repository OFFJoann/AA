import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';
export default class PageErrorBoundary extends Component<{children:ReactNode},{failed:boolean}> {
 state={failed:false};
 static getDerivedStateFromError(){return {failed:true};}
 componentDidCatch(error:Error,info:ErrorInfo){console.error('No se pudo cargar la pagina',error.message,info.componentStack);}
 render(){return this.state.failed?<section className="section-width aa-empty"><h1>No pudimos cargar esta sección.</h1><p>No se ha enviado ninguna solicitud. Al recargar se reiniciarán los cambios del CMS de demostración que solo viven en esta pestaña.</p><button className="button red" onClick={()=>window.location.reload()}>Reintentar</button><a href="/">Volver al inicio</a></section>:this.props.children;}
}
