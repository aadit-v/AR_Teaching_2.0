import * as THREE from 'three';
import { MindARThree } from 'mind-ar/dist/mindar-image-three.prod.js';
import { createIcons, icons } from 'lucide';

import { CONTROLS_DATA } from './data/controlsData.js';
import { createHotspots } from './ar/hotspots.js';
import { createDrawer } from './ui/drawer.js';
import './styles/app.css';

const els = {
  stage: document.querySelector('#ar-stage'),
  hud: document.querySelector('#hud'),
  status: document.querySelector('[data-status]'),
  start: document.querySelector('#start'),
  gate: document.querySelector('#gate'),
  fallback: document.querySelector('#fallback'),
  fallbackList: document.querySelector('#fallback-list'),
};

const drawer = createDrawer(document.querySelector('#drawer-root'));

function setStatus(text, tone = 'seeking') {
  els.status.textContent = text;
  els.hud.dataset.tone = tone;
}

async function boot() {
  els.gate.classList.add('is-gone');
  setStatus('Starting camera…', 'seeking');

  const mindar = new MindARThree({
    container: els.stage,
    imageTargetSrc: `${import.meta.env.BASE_URL}targets/boombox.mind`,
    uiLoading: 'no',
    uiScanning: 'no',
    uiError: 'no',
    filterMinCF: 0.0001, // steadier pins at the cost of a little latency
    filterBeta: 0.001,
    warmupTolerance: 5,
    missTolerance: 8,
  });

  const { renderer, scene, camera } = mindar;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const anchor = mindar.addAnchor(0);
  const hotspots = createHotspots(anchor.group, {
    onSelect: (control) =>
      drawer.open(control, { onDismiss: () => hotspots.setActive(null) }),
  });

  anchor.onTargetFound = () => setStatus(`${CONTROLS_DATA.length} controls found`, 'locked');
  anchor.onTargetLost = () => {
    drawer.close();
    setStatus('Sticker out of frame', 'seeking');
  };

  // Tap → pick. Pointer events cover both touch and desktop webcam testing.
  els.stage.addEventListener('pointerdown', (e) => {
    const rect = renderer.domElement.getBoundingClientRect();
    const ndc = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );
    hotspots.pick(ndc, camera);
  });

  try {
    await mindar.start();
  } catch (err) {
    console.error(err);
    showFallback(err);
    return;
  }

  setStatus('Point at the boombox sticker', 'seeking');

  const clock = new THREE.Clock();
  renderer.setAnimationLoop(() => {
    hotspots.update(clock.getElapsedTime());
    renderer.render(scene, camera);
  });
}

/** Camera refused, no HTTPS, or target file missing — still make the data useful. */
function showFallback(err) {
  els.hud.hidden = true;
  els.fallback.hidden = false;
  els.fallback.querySelector('[data-reason]').textContent =
    !window.isSecureContext
      ? 'The camera only works over HTTPS or on localhost. Open this page on a secure address and reload.'
      : 'Camera access was blocked, so here is the faceplate reference instead. Allow camera permission and reload to use AR.';

  els.fallbackList.innerHTML = CONTROLS_DATA.map(
    (c, i) => `
      <li>
        <button data-id="${c.id}"><span>${i + 1}</span>${c.name}</button>
      </li>`
  ).join('');

  els.fallbackList.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-id]');
    if (!btn) return;
    drawer.open(CONTROLS_DATA.find((c) => c.id === btn.dataset.id));
  });

  if (err) console.warn('[AR] start failed:', err?.message ?? err);
}

els.start.addEventListener('click', boot, { once: true });
createIcons({ icons });
