// Shared hover tooltip for charts: any element with data-tip inside .viz shows it.
export function bindTooltips() {
  document.querySelectorAll<HTMLElement>('.viz').forEach((root) => {
    if (root.dataset.bound) return;
    root.dataset.bound = '1';
    const tip = document.createElement('div');
    tip.className = 'viz-tip';
    tip.setAttribute('role', 'status');
    root.appendChild(tip);
    const show = (el: Element, x: number, y: number) => {
      tip.innerHTML = (el as HTMLElement).dataset.tip ?? '';
      tip.classList.add('on');
      const r = root.getBoundingClientRect();
      const w = tip.offsetWidth;
      let left = x - r.left + 14;
      if (left + w > r.width) left = x - r.left - w - 14;
      tip.style.left = `${Math.max(0, left)}px`;
      tip.style.top = `${y - r.top - 10}px`;
    };
    root.querySelectorAll('[data-tip]').forEach((el) => {
      el.addEventListener('pointermove', (e) => show(el, (e as PointerEvent).clientX, (e as PointerEvent).clientY));
      el.addEventListener('pointerleave', () => tip.classList.remove('on'));
      el.addEventListener('focus', () => { const b = el.getBoundingClientRect(); show(el, b.right, b.top + 20); });
      el.addEventListener('blur', () => tip.classList.remove('on'));
    });
  });
}
