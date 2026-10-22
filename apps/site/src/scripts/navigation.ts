export {};
const dialog = document.querySelector<HTMLDialogElement>('#site-menu');
const menuOpener = document.querySelector<HTMLButtonElement>('[data-menu-open]');
const closer = document.querySelector<HTMLButtonElement>('[data-menu-close]');
const fallback = document.querySelector<HTMLElement>('[data-navigation-fallback]');
if (dialog && menuOpener && closer && fallback && typeof dialog.showModal === 'function') {
  menuOpener.hidden = false;
  fallback.hidden = true;
  // Anchor clearance follows the rendered header, including wrapped/enlarged labels.
  // Its minimum height is a separate token, so measurements cannot hold it open.
  const header = document.querySelector<HTMLElement>('.header-shell');
  if (header && typeof ResizeObserver !== 'undefined') {
    const updateHeaderHeight = () => {
      document.documentElement.style.setProperty(
        '--header-height',
        Math.ceil(header.getBoundingClientRect().height) + 'px',
      );
    };
    new ResizeObserver(updateHeaderHeight).observe(header);
    updateHeaderHeight();
  }
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const panel = dialog.querySelector<HTMLElement>('.menu-grid')!;
  const lines = [...closer.querySelectorAll<HTMLElement>('.menu-line')];
  let previousOverflow = '';
  let animations: Animation[] = [];
  let closeTimer: number | undefined;

  const cancelMotion = () => {
    animations.forEach((animation) => animation.cancel());
    animations = [];
  };
  const finishClose = () => {
    clearTimeout(closeTimer);
    closeTimer = undefined;
    if (dialog.open) dialog.close();
  };
  const animateMenu = (opening: boolean) => {
    // Read the current frame before cancelling: a quick reversal must not jump.
    const currentLines = lines.map((line) => getComputedStyle(line).transform);
    const currentPanel = getComputedStyle(panel).transform;
    cancelMotion();
    dialog.dataset.menuState = opening ? 'open' : 'closing';
    if (reducedMotion.matches || document.documentElement.dataset.a11yMotion === '1' || typeof panel.animate !== 'function') return 0;
    const token = opening ? '--motion-normal' : '--motion-fast';
    const duration = parseFloat(getComputedStyle(dialog).getPropertyValue(token)) || 200;
    const timing = { duration, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'both' as const };
    const target = opening
      ? ['rotate(45deg)', 'scaleX(0)', 'rotate(-45deg)']
      : ['translateY(-8px)', 'none', 'translateY(8px)'];
    animations = lines.map((line, index) =>
      line.animate([{ transform: currentLines[index] }, { transform: target[index] }], timing),
    );
    animations.push(
      panel.animate(
        [
          { transform: opening ? 'translateY(18px)' : currentPanel },
          { transform: opening ? 'none' : 'translateY(-12px)' },
        ],
        timing,
      ),
    );
    return duration;
  };
  const closeMenu = (immediate = false) => {
    if (!dialog.open) return;
    if (immediate || dialog.dataset.menuState === 'closing' || reducedMotion.matches) {
      finishClose();
      return;
    }
    const duration = animateMenu(false);
    // Native dismissal and cleanup do not depend on an animation completion event.
    if (duration) closeTimer = window.setTimeout(finishClose, duration);
    else finishClose();
  };
  menuOpener.addEventListener('click', () => {
    if (dialog.open) return;
    previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    menuOpener.setAttribute('aria-expanded', 'true');
    animateMenu(true);
  });
  closer.addEventListener('click', () => closeMenu());
  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeMenu();
  });
  dialog.addEventListener('close', () => {
    clearTimeout(closeTimer);
    closeTimer = undefined;
    cancelMotion();
    dialog.dataset.menuState = 'closed';
    document.body.style.overflow = previousOverflow;
    menuOpener.setAttribute('aria-expanded', 'false');
    menuOpener.focus();
  });
  document.addEventListener('ppconsulting:accessibility-change', () => {
    if(document.documentElement.dataset.a11yMotion!=='1')return;cancelMotion();if(dialog.dataset.menuState==='closing')finishClose();
  });
  reducedMotion.addEventListener('change', () => {
    if (!reducedMotion.matches) return;
    cancelMotion();
    if (dialog.dataset.menuState === 'closing') finishClose();
  });
  dialog.querySelectorAll<HTMLAnchorElement>('a').forEach((link) => {
    link.addEventListener('click', () => closeMenu(true));
  });
}
