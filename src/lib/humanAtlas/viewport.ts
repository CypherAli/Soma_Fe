import type { SceneState } from './anatomy';

/** One viewport drives both camera framing and the slider's visual centre. */
export function readAnatomyViewport(host: HTMLElement, state: Pick<SceneState,'bare'|'focus'|'inspectorOpen'>) {
  const width=host.clientWidth,height=host.clientHeight;
  if(state.bare)return {left:24,right:width-24,top:24,bottom:height-24};
  const origin=host.getBoundingClientRect(),root=host.parentElement,mobile=width<768;
  const rail=root?.querySelector('.scene-rail,.layers-panel')?.getBoundingClientRect();
  const sheet=state.inspectorOpen?root?.querySelector('.detail-sheet')?.getBoundingClientRect():undefined;
  const dock=root?.querySelector('.bottom-dock')?.getBoundingClientRect();
  const left=mobile?20:Math.max(20,rail&&rail.right>origin.left?rail.right-origin.left+16:20);
  const right=mobile?width-20:Math.max(left+100,Math.min(width-90,sheet?sheet.left-origin.left-16:width-90));
  const top=mobile?(state.focus.length?220:175):150;
  let bottom=dock&&dock.height>0?Math.min(height-40,dock.top-origin.top-20):height-100;
  if(mobile&&sheet)bottom=Math.min(bottom,sheet.top-origin.top-16);
  return {left,right,top,bottom:Math.max(top+80,bottom)};
}

export function positionAnatomyControls(host: HTMLElement, viewport: ReturnType<typeof readAnatomyViewport>) {
  const root=host.parentElement;
  root?.style.setProperty('--model-center-x',`${(viewport.left+viewport.right)/2}px`);
  root?.style.setProperty('--model-viewport-width',`${viewport.right-viewport.left}px`);
}
