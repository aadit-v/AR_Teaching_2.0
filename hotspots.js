import * as THREE from 'three';
import { CONTROLS_DATA, TYPE_STYLES } from '../data/controlsData.js';

const PIN_SIZE = 0.26; // in target units
const DPR = 256; // canvas texture resolution per pin

/**
 * Draws one pin face to an offscreen canvas: a ring, a filled core, and the
 * control's index. Icons live in the drawer, not on the pin — at arm's length
 * on a phone a glyph this small is unreadable, a colour-coded disc is not.
 */
function pinTexture(tint, index) {
  const c = document.createElement('canvas');
  c.width = c.height = DPR;
  const ctx = c.getContext('2d');
  const r = DPR / 2;

  // outer halo
  const halo = ctx.createRadialGradient(r, r, r * 0.42, r, r, r);
  halo.addColorStop(0, `${tint}66`);
  halo.addColorStop(1, `${tint}00`);
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, DPR, DPR);

  // ring
  ctx.beginPath();
  ctx.arc(r, r, r * 0.42, 0, Math.PI * 2);
  ctx.lineWidth = DPR * 0.045;
  ctx.strokeStyle = tint;
  ctx.stroke();

  // core
  ctx.beginPath();
  ctx.arc(r, r, r * 0.3, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(9,11,14,0.86)';
  ctx.fill();

  // index
  ctx.fillStyle = tint;
  ctx.font = `600 ${DPR * 0.3}px "IBM Plex Sans", system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(String(index), r, r + DPR * 0.015);

  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 4;
  return tex;
}

/**
 * Builds every pin into `anchorGroup` and wires tap selection.
 * Returns { group, update(t), setActive(id) }.
 */
export function createHotspots(anchorGroup, { onSelect } = {}) {
  const group = new THREE.Group();
  const pins = [];

  CONTROLS_DATA.forEach((control, i) => {
    const style = TYPE_STYLES[control.type] ?? TYPE_STYLES.knob;
    const material = new THREE.MeshBasicMaterial({
      map: pinTexture(style.tint, i + 1),
      transparent: true,
      depthTest: false,
      toneMapped: false,
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(PIN_SIZE, PIN_SIZE), material);
    mesh.position.fromArray(control.position);
    mesh.renderOrder = 10 + i;
    mesh.userData.control = control;
    mesh.userData.baseY = control.position[1];
    mesh.userData.phase = i * 0.37;
    group.add(mesh);
    pins.push(mesh);
  });

  anchorGroup.add(group);

  let activeId = null;

  return {
    group,
    pins,

    /** Idle breathing so pins read as floating rather than painted on. */
    update(elapsed) {
      pins.forEach((p) => {
        const isActive = p.userData.control.id === activeId;
        const pulse = Math.sin(elapsed * 2.2 + p.userData.phase);
        p.position.y = p.userData.baseY + pulse * 0.012;
        const target = isActive ? 1.32 : 1;
        p.scale.lerp(new THREE.Vector3(target, target, 1), 0.18);
        p.material.opacity = isActive ? 1 : 0.9 + pulse * 0.06;
      });
    },

    setActive(id) {
      activeId = id;
    },

    /** Call from a pointer event. Returns the hit control, or null. */
    pick(ndc, camera) {
      const ray = new THREE.Raycaster();
      ray.setFromCamera(ndc, camera);
      const hit = ray.intersectObjects(pins, false)[0];
      if (!hit) return null;
      const control = hit.object.userData.control;
      activeId = control.id;
      onSelect?.(control);
      return control;
    },
  };
}
