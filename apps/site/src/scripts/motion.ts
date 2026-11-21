const owners = new WeakMap<Document | HTMLElement, () => void>();

function animateOrbit(orbit: HTMLElement, animations: Animation[]) {
  const segments = orbit.querySelectorAll<SVGPathElement>('[data-orbit-segment]');
  const nodes = new Map(Array.from(orbit.querySelectorAll<HTMLElement>('[data-orbit-node]'),
    node => [node.dataset.orbitNode, node]));
  segments.forEach((segment, index) => {
    const delay = index * 320;
    animations.push(segment.animate([
      {strokeDasharray: '1 1', strokeDashoffset: '1', opacity: 0},
      {strokeDasharray: '1 1', strokeDashoffset: '.92', opacity: 1, offset: .08},
      {strokeDasharray: '1 1', strokeDashoffset: '0', opacity: 1},
    ], {duration: 400, delay, easing: 'ease-in-out', fill: 'backwards'}));
    const node = nodes.get(segment.dataset.orbitSegment);
    if (node) animations.push(node.animate([
      {opacity: 0, translate: '0 5px'}, {opacity: 1, translate: '0 0'},
    ], {duration: 350, delay: delay + 50, easing: 'ease-out', fill: 'backwards'}));
  });
}

/** Visible HTML is the baseline. Animations never commit a hidden inline state. */
export function initMotion(root: Document | HTMLElement): () => void {
  const previous = owners.get(root);
  if (previous) return previous;
  const doc = root.nodeType === 9 ? root as Document : root.ownerDocument!;
  const scope = root.nodeType === 9 ? doc.documentElement : root as HTMLElement;
  const win = doc.defaultView;
  let observer: IntersectionObserver | undefined;
  let preference: MediaQueryList | undefined;
  let disposed = false;
  const active = new Map<HTMLElement, Animation[]>();
  const pending = new Set<HTMLElement>();
  const cancel = (target: HTMLElement) => {
    pending.delete(target);
    try { observer?.unobserve(target); } catch { /* cancellation remains fail-open */ }
    const animations = active.get(target) ?? [];
    active.delete(target);
    for (const animation of animations) {
      try { animation.cancel(); } catch { /* no committed styles to restore */ }
    }
  };
  const fragment = () => {
    const hash = win?.location.hash.slice(1);
    if (!hash) return null;
    let id = hash;
    try { id = decodeURIComponent(hash); } catch { /* literal malformed IDs can still exist */ }
    return doc.getElementById(id);
  };
  const reveal = (node: Node | null) => {
    if (node) for (const target of new Set([...pending, ...active.keys()])) {
      if (target === node || target.contains(node)) cancel(target);
    }
  };
  const onFocus = (event: Event) => reveal(event.target as Node | null);
  const onHash = () => reveal(fragment());
  const onPreference = () => {
    if (preference?.matches) for (const target of [...active.keys()]) cancel(target);
  };
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    for (const target of [...active.keys()]) cancel(target);
    pending.clear();
    try { observer?.disconnect(); } catch { /* best effort release */ }
    doc.removeEventListener('focusin', onFocus);
    win?.removeEventListener('hashchange', onHash);
    preference?.removeEventListener('change', onPreference);
    owners.delete(root);
  };
  try {
    if (!win || (scope.dataset.motion !== 'on' || scope.dataset.a11yMotion === '1') || typeof win.IntersectionObserver !== 'function' || typeof scope.animate !== 'function') return dispose;
    preference = win.matchMedia('(prefers-reduced-motion: reduce)');
    if (preference.matches) return dispose;
    const style = win.getComputedStyle(scope);
    const number = (name: string, unit: string) => {
      const value = style.getPropertyValue(name).trim();
      const actualUnit = unit === 'ms' && value.endsWith('s') && !value.endsWith('ms') ? 's' : unit;
      if (!value.endsWith(actualUnit)) throw Error('Missing motion token: ' + name);
      const result = Number(value.slice(0, -actualUnit.length)) * (actualUnit === 's' ? 1000 : 1);
      if (!Number.isFinite(result) || result < 0) throw Error('Invalid motion token: ' + name);
      return result;
    };
    const duration = number('--motion-duration', 'ms');
    const distance = number('--motion-distance', 'px');
    const stagger = number('--motion-stagger', 'ms');
    const maximum = number('--motion-max-delay', 'ms');
    const easing = style.getPropertyValue('--motion-ease').trim();
    const targets = Array.from(root.querySelectorAll<HTMLElement>('[data-motion-reveal], [data-motion-orbit]'))
      .filter(target => !target.parentElement?.closest('[data-motion-reveal]') && !target.closest('[hidden]'));
    const delays = new Map<HTMLElement, number>();
    const groupCounts = new Map<Element, number>();
    const hashTarget = fragment();
    for (const target of targets) {
      const group = target.closest('[data-motion-group]');
      const index = group ? groupCounts.get(group) || 0 : 0;
      if (group) groupCounts.set(group, index + 1);
      delays.set(target, Math.min(index * stagger, maximum));
      const rect = target.getBoundingClientRect();
      const visible = rect.top < win.innerHeight && rect.bottom > 0 && rect.left < win.innerWidth && rect.right > 0;
      if (visible || target.contains(doc.activeElement) || (hashTarget && target.contains(hashTarget))) continue;
      pending.add(target);
    }
    observer = new win.IntersectionObserver(entries => {
      if (disposed) return;
      try {
        for (const entry of entries) {
          const target = entry.target as HTMLElement;
          if (!entry.isIntersecting || !pending.has(target)) continue;
          pending.delete(target);
          observer?.unobserve(target);
          if (scope.dataset.a11yMotion === '1' || preference?.matches || target.closest('[hidden]') || target.contains(doc.activeElement)) continue;
          const destination = fragment();
          if (destination && target.contains(destination)) continue;
          const animations: Animation[] = [];
          active.set(target, animations);
          try {
            if (target.hasAttribute('data-motion-orbit')) {
              animateOrbit(target, animations);
            } else {
              const hasTranslation = win.getComputedStyle(target).translate !== 'none';
              const frames: Keyframe[] = hasTranslation ? [{opacity: 0}, {opacity: 1}] : [
                {opacity: 0, translate: `0 ${distance}px`}, {opacity: 1, translate: '0 0'},
              ];
              animations.push(target.animate(frames, {duration, delay: delays.get(target) || 0, easing, fill: 'none'}));
            }
          } finally {
            void Promise.allSettled(animations.map(animation => animation.finished)).then(() => {
              if (active.get(target) === animations) active.delete(target);
            });
          }
        }
      } catch { dispose(); }
    }, {threshold: 0});
    owners.set(root, dispose);
    doc.addEventListener('focusin', onFocus);
    win.addEventListener('hashchange', onHash);
    preference.addEventListener('change', onPreference);
    for (const target of pending) observer.observe(target);
  } catch { dispose(); }
  return dispose;
}
