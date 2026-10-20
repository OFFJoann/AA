/** Deterministic, reversible scroll math, shared by rendering and unit tests. */
export function clamp01(value:number){return Number.isFinite(value)?Math.min(1,Math.max(0,value)):0;}
export function sceneState(progress:number,count:number){
 const total=Math.max(1,Math.trunc(count)||1), position=clamp01(progress)*(total-1);
 const from=Math.floor(position),to=Math.min(total-1,from+1),fraction=position-from;
 const u=clamp01((fraction-.58)/.42),blend=u*u*(3-2*u);
 return {from,to,blend,active:blend>=.5?to:from,fraction};
}
export function trackProgress(top:number,trackHeight:number,stageHeight:number,stickyTop:number){
 const distance=trackHeight-stageHeight;
 return distance>0?clamp01((stickyTop-top)/distance):0;
}
