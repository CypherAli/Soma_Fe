export function previewTransform(width,height,targetWidth,targetHeight){
 const scale=Math.max(targetWidth/width,targetHeight/height),w=width*scale,h=height*scale;
 return {w,h,dx:(targetWidth-w)/2,dy:(targetHeight-h)/2};
}
// Landmarks from HandCamera are ALREADY mirrored into selfie coordinates.
export function previewPoint(point,transform){return [transform.dx+point[0]*transform.w,transform.dy+point[1]*transform.h];}
// The worker bitmap is an inference fallback, never the preferred display source.
export function previewSource(video, fallback){
 return video?.readyState>=2 && video.videoWidth>0 ? video : fallback;
}
