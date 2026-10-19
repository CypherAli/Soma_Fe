"use client";

import { Component, Suspense, useMemo, useState, useEffect, type ReactNode } from 'react';
import { Canvas, type ThreeEvent } from '@react-three/fiber';
import { Bounds, OrbitControls, useGLTF, useProgress } from '@react-three/drei';
import { Mesh, MeshStandardMaterial } from 'three';

class PreviewError extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <p role="alert" style={{ padding: 24 }}>Không dựng được mô hình. Kiểm tra GLB và tài nguyên đi kèm.</p> : this.props.children; }
}

function Model({ url, onPick, neutral }: { url: string; onPick: (name: string) => void; neutral: boolean }) {
  const gltf = useGLTF(url, '/draco/');
  const object = useMemo(() => {
    const clone = gltf.scene.clone(true);
    clone.traverse((node) => {
      if (!(node instanceof Mesh)) return;
      node.material = neutral ? new MeshStandardMaterial({ color: '#cbbca7', roughness: 0.75 }) : Array.isArray(node.material) ? node.material.map((material) => material.clone()) : node.material.clone();
    });
    return clone;
  }, [gltf.scene, neutral]);
  useEffect(() => () => object.traverse((node) => { if (node instanceof Mesh) for (const material of Array.isArray(node.material) ? node.material : [node.material]) material.dispose(); }), [object]);
  function pick(event: ThreeEvent<MouseEvent>) {
    if (event.delta > 4) return;
    event.stopPropagation();
    if (event.object.name) onPick(event.object.name);
  }
  return <Bounds fit margin={1.25}><primitive object={object} dispose={null} onClick={pick} /></Bounds>;
}

export default function ModelAssetPreview({ url }: { url: string }) {
  const [mesh, setMesh] = useState('');
  const [neutral, setNeutral] = useState(true);
  const progress = useProgress();
  function select(name: string) {
    setMesh(name);
    if (window.parent === window || !document.referrer) return;
    try { window.parent.postMessage({ type: 'soma:model-mesh', meshName: name }, new URL(document.referrer).origin); } catch { }
  }
  return <main style={{ width: '100%', height: '100dvh', minHeight: 280, background: '#202938', color: '#dce2eb', position: 'relative' }}>
    <button style={{ position: 'absolute', top: 12, left: 12, zIndex: 2, border: '1px solid #667183', borderRadius: 6, padding: '8px 12px', font: '12px sans-serif', background: '#263244', color: '#edf0f5', cursor: 'pointer' }} onClick={() => setNeutral((value) => !value)}>{neutral ? 'Đang dùng màu trung tính · Xem vật liệu gốc' : 'Đang dùng vật liệu gốc · Xem màu trung tính'}</button>
    <PreviewError key={url}><Canvas camera={{ position: [3, 2, 4], fov: 40 }} dpr={[1, 1.5]}><ambientLight intensity={0.8} /><directionalLight position={[4, 6, 4]} intensity={2.5} /><directionalLight position={[-4, 1, -2]} intensity={0.6} /><Suspense fallback={null}><Model url={url} onPick={select} neutral={neutral} /></Suspense><OrbitControls makeDefault /></Canvas></PreviewError>
    <div aria-live="polite" style={{ position: 'absolute', bottom: 12, left: 12, right: 12, background: '#ffffffdd', color: '#273044', borderRadius: 6, padding: '8px 12px', font: '12px/1.5 sans-serif', overflowWrap: 'anywhere', pointerEvents: 'none' }}>{progress.active ? `Đang tải mô hình · ${Math.round(progress.progress)}%` : mesh || 'Kéo để xoay · Cuộn để phóng to · Nhấp để chọn mesh'}</div>
  </main>;
}
