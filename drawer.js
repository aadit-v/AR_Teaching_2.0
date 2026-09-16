import { createIcons, icons } from 'lucide';
import { TYPE_STYLES } from '../data/controlsData.js';

/**
 * Frosted bottom sheet. Opens on pin tap, drags down to dismiss,
 * and respects prefers-reduced-motion via CSS.
 */
export function createDrawer(root) {
  root.innerHTML = `
    <div class="sheet-scrim" data-scrim hidden></div>
    <section class="sheet" data-sheet aria-hidden="true" role="dialog" aria-modal="false"
             aria-labelledby="sheet-title">
      <button class="sheet-grip" data-close aria-label="Close details"></button>
      <header class="sheet-head">
        <span class="sheet-badge" data-badge><i data-lucide="circle-dot"></i></span>
        <div>
          <h2 id="sheet-title" data-title></h2>
          <p class="sheet-kind" data-kind></p>
        </div>
      </header>
      <p class="sheet-body" data-desc></p>
      <div class="sheet-how">
        <h3>How to use it</h3>
        <p data-how></p>
      </div>
    </section>
  `;

  const sheet = root.querySelector('[data-sheet]');
  const scrim = root.querySelector('[data-scrim]');
  const badge = root.querySelector('[data-badge]');
  const els = {
    title: root.querySelector('[data-title]'),
    kind: root.querySelector('[data-kind]'),
    desc: root.querySelector('[data-desc]'),
    how: root.querySelector('[data-how]'),
  };

  let onClose = null;

  function close() {
    sheet.classList.remove('is-open');
    sheet.setAttribute('aria-hidden', 'true');
    scrim.hidden = true;
    onClose?.();
  }

  scrim.addEventListener('click', close);
  root.querySelector('[data-close]').addEventListener('click', close);
  window.addEventListener('keydown', (e) => e.key === 'Escape' && close());

  // Drag-to-dismiss
  let startY = null;
  sheet.addEventListener(
    'touchstart',
    (e) => {
      startY = e.touches[0].clientY;
      sheet.style.transition = 'none';
    },
    { passive: true }
  );
  sheet.addEventListener(
    'touchmove',
    (e) => {
      if (startY === null) return;
      const dy = Math.max(0, e.touches[0].clientY - startY);
      sheet.style.transform = `translateY(${dy}px)`;
    },
    { passive: true }
  );
  sheet.addEventListener('touchend', (e) => {
    if (startY === null) return;
    const dy = Math.max(0, (e.changedTouches[0]?.clientY ?? startY) - startY);
    sheet.style.transition = '';
    sheet.style.transform = '';
    if (dy > 90) close();
    startY = null;
  });

  return {
    open(control, { onDismiss } = {}) {
      const style = TYPE_STYLES[control.type] ?? TYPE_STYLES.knob;
      onClose = onDismiss;

      els.title.textContent = control.name;
      els.kind.textContent = style.label;
      els.desc.textContent = control.description;
      els.how.textContent = control.instructions;

      badge.style.setProperty('--tint', style.tint);
      badge.innerHTML = `<i data-lucide="${style.icon}"></i>`;
      createIcons({ icons, root: badge });

      scrim.hidden = false;
      sheet.classList.add('is-open');
      sheet.setAttribute('aria-hidden', 'false');
    },
    close,
  };
}
