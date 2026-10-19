import { Box3, MathUtils, PerspectiveCamera, Vector3 } from 'three';

/** Fit all eight corners in camera space; never project through a stale pose. */
export function frameAnatomyBox(camera: PerspectiveCamera, box: Box3, direction: Vector3, width: number, height: number, viewport: {left:number;right:number;top:number;bottom:number}) {
  if (box.isEmpty() || width <= 0 || height <= 0) throw new Error('Cannot frame an empty anatomy viewport');
  const center = box.getCenter(new Vector3());
  camera.near = Math.max(1e-6, Math.min(.01, box.getSize(new Vector3()).length() / 100));
  const view = direction.clone().normalize();
  camera.position.copy(center).add(view);
  camera.lookAt(center);
  camera.updateMatrixWorld(true);
  const inverse = camera.quaternion.clone().invert();
  const tanY = Math.tan(MathUtils.degToRad(camera.fov / 2));
  const tanX = tanY * camera.aspect;
  const halfX = Math.max(1, viewport.right - viewport.left) / width;
  const halfY = Math.max(1, viewport.bottom - viewport.top) / height;
  let distance = camera.near * 2;
  for (let corner = 0; corner < 8; corner++) {
    const p = new Vector3(corner & 1 ? box.max.x : box.min.x, corner & 2 ? box.max.y : box.min.y, corner & 4 ? box.max.z : box.min.z).sub(center).applyQuaternion(inverse);
    distance = Math.max(distance, p.z + Math.max(Math.abs(p.x) / (tanX * halfX * .88), Math.abs(p.y) / (tanY * halfY * .88)), p.z + camera.near * 2);
  }
  camera.setViewOffset(width, height, width / 2 - (viewport.left + viewport.right) / 2, height / 2 - (viewport.top + viewport.bottom) / 2, width, height);
  camera.position.copy(center).addScaledVector(view, distance);
  camera.lookAt(center);
  camera.updateMatrixWorld(true);
  camera.updateProjectionMatrix();
  return { center, distance };
}
