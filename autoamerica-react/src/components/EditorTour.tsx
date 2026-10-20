import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, X } from 'lucide-react';

const steps = [
  { target: '.cms-kind-switch', title: 'Empieza por el tipo de vehículo', text: 'Elige nuevo o usado. En usados son obligatorios el precio, el año, el kilometraje y la transmisión. Puedes editar la ficha mientras sigues el tour.' },
  { target: '.cms-field-grid', title: 'Cuenta lo que necesita saber el cliente', text: 'Completa nombre, categoría, motorización, sede y descripción. Los campos con * son obligatorios. Un nombre claro ayuda a distinguir la versión.' },
  { target: '.cms-photo-grid', title: 'Elige su mejor ángulo', text: 'Selecciona una fotografía o carga una imagen JPG, PNG o WebP de hasta 5 MB. Comprueba que corresponda al modelo y versión de la ficha.' },
  { target: '.cms-preview', title: 'Revisa antes de publicar', text: 'Esta tarjeta cambia mientras escribes. Revisa la imagen, el nombre, el precio y la descripción tal como aparecerán en el catálogo.' },
  { target: '.cms-publication', title: 'Decide quién puede verlo', text: 'Borrador y retirado no aparecen en el sitio. Publicado sí. Marcar una unidad como vendida la retira del catálogo al guardar.' },
  { target: '.cms-savebar', title: 'Guarda cuando estés listo', text: 'Guardar borrador conserva la ficha fuera del catálogo. Publicar vehículo o Guardar cambios aplica tu elección. Este tour no guarda ni publica por ti. En esta demo, los cambios se reinician al recargar.' },
];

export default function EditorTour({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [dock, setDock] = useState('right');
  const panel = useRef<HTMLElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const close = useRef(onClose);
  close.current = onClose;
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); close.current(); }
    };
    document.addEventListener('keydown', escape, true);
    return () => { document.removeEventListener('keydown', escape, true); previous?.isConnected && previous.focus({ preventScroll: true }); };
  }, []);
  useEffect(() => {
    const root = panel.current?.closest('.cms-shell');
    const target = root?.querySelector<HTMLElement>(steps[step].target);
    if (!target) return;
    target.classList.add('cms-tour-target');
    target.scrollIntoView({ behavior: 'instant', block: 'start' });
    setDock(steps[step].target === '.cms-savebar' ? 'top' : target.getBoundingClientRect().left > window.innerWidth / 2 ? 'left' : 'right');
    title.current?.focus({ preventScroll: true });
    return () => target.classList.remove('cms-tour-target');
  }, [step]);
  return <section ref={panel} className={`cms-tour cms-tour-dock-${dock}`} aria-label="Tour asistido del editor">
    <div className="cms-tour-top"><span>GUÍA DE EDICIÓN · {step + 1} / {steps.length}</span><button onClick={onClose} aria-label="Cerrar tour"><X size={18}/></button></div>
    <div className="cms-tour-progress" aria-hidden="true">{steps.map((_, index) => <i key={index} className={index <= step ? 'done' : ''}/>)}</div>
    <div aria-live="polite" aria-atomic="true"><h2 ref={title} tabIndex={-1}>{steps[step].title}</h2><p>{steps[step].text}</p></div>
    <div className="cms-tour-actions"><button className="cms-btn cms-btn-secondary" disabled={step === 0} onClick={() => setStep(step - 1)}><ArrowLeft size={14}/> Atrás</button><button className="cms-btn cms-btn-primary" onClick={() => step === steps.length - 1 ? onClose() : setStep(step + 1)}>{step === steps.length - 1 ? <>Finalizar <Check size={15}/></> : <>Siguiente <ArrowRight size={15}/></>}</button></div>
  </section>;
}
