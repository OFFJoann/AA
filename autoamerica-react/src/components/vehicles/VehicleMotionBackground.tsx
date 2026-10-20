import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { getVehicleBackground } from '../../data/vehicleBackgrounds';
import { allowBackgroundMotion } from '../../lib/vehicleBackground';
import { safeImage } from '../../lib/presentation';
import { useMotionPreference } from '../../hooks/useMotionPreference';

type Props = { modelId: string; origin?: string; variant?: string; poster?: string; className?: string; animatePhoto?: boolean; priority?: boolean };
type NetworkInfo = EventTarget & { saveData?: boolean };
export default function VehicleMotionBackground(props: Props) {
  // A key gives each selected model its own player. A previous model never leaks through.
  return <Player key={`${props.modelId}:${props.variant || ''}:${props.origin || ''}`} {...props}/>;
}
function Player({ modelId, origin, variant, poster, className = '', animatePhoto = true, priority = false }: Props) {
  const approved = getVehicleBackground(modelId, origin, variant);
  const candidate = safeImage(poster);
  const image = candidate === '/assets/photo-pending.svg' ? '' : candidate;
  const host = useRef<HTMLDivElement>(null), video = useRef<HTMLVideoElement>(null);
  const reduced = useMotionPreference();
  const [paused, setPaused] = useState(false), [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false), [blocked, setBlocked] = useState(false);
  const [hidden, setHidden] = useState(() => document.hidden);
  const [compact, setCompact] = useState(() => matchMedia('(max-width: 700px)').matches);
  const connection = (navigator as Navigator & { connection?: NetworkInfo }).connection;
  const [saveData, setSaveData] = useState(!!connection?.saveData);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.05 });
    if (host.current) observer.observe(host.current);
    const media = matchMedia('(max-width: 700px)');
    const onSize = () => setCompact(media.matches);
    const onVisibility = () => setHidden(document.hidden);
    const onConnection = () => setSaveData(!!connection?.saveData);
    media.addEventListener('change', onSize); document.addEventListener('visibilitychange', onVisibility);
    connection?.addEventListener('change', onConnection);
    return () => { observer.disconnect(); media.removeEventListener('change', onSize); document.removeEventListener('visibilitychange', onVisibility); connection?.removeEventListener('change', onConnection); };
  }, [connection]);
  const permitted = !reduced && !compact && !saveData;
  const running = allowBackgroundMotion({ reduced, compact, saveData, hidden, visible, paused, blocked });
  // No video element or network request until visible. Unmount on mobile/reduced data.
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { if (approved && running) setLoaded(true); if (!permitted) setLoaded(false); }, [!!approved, running, permitted]);
  useEffect(() => {
    const el = video.current;
    if (!el) return;
    let cancelled = false;
    if (running) {
      el.muted = true;
      el.play().catch(() => { if (!cancelled) { setBlocked(true); setReady(false); } });
    } else el.pause();
    return () => { cancelled = true; el.pause(); };
  }, [running, loaded]);
  const renderVideo = !!approved && loaded && permitted && !blocked;
  const photoRuns = !approved && !!image && animatePhoto && running;
  const mode = renderVideo && ready ? 'Video de fondo' : photoRuns ? 'Fotografía animada' : (image ? 'Fotografía de fondo' : 'Fondo estático');
  const canControl = permitted && !blocked && (!!approved || (!!image && animatePhoto));
  return <div ref={host} className={`aa-motion-bg ${className}`} data-model-background={modelId} data-media-mode={renderVideo && ready ? 'video' : 'photo'}>
    <div className={`aa-motion-poster ${!approved && !!image && animatePhoto && permitted ? 'is-animated' : ''}`} style={{ animationPlayState: photoRuns ? 'running' : 'paused' }} aria-hidden="true">
      {image && <img src={image} alt="" loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} decoding="async" onError={e => { e.currentTarget.style.visibility = 'hidden'; }}/>}</div>
    {renderVideo && <video ref={video} src={approved.src} className={ready ? 'is-ready' : ''} muted playsInline loop preload="none" aria-hidden="true" tabIndex={-1}
      onPlaying={() => setReady(true)} onError={() => { setBlocked(true); setReady(false); }}/>} 
    <div className="aa-motion-scrim" aria-hidden="true"/>
    <div className="aa-motion-control"><span>{mode}</span>{canControl && <button type="button" onClick={() => setPaused(v => !v)} aria-label={paused ? 'Activar movimiento del fondo' : 'Pausar movimiento del fondo'} aria-pressed={paused}>{paused ? <Play size={14}/> : <Pause size={14}/>}<span>{paused ? 'Activar' : 'Pausar'}</span></button>}</div>
  </div>;
}
