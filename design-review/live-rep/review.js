const tabs = [...document.querySelectorAll('[role="tab"]')];
const panels = [...document.querySelectorAll('[role="tabpanel"]')];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const timers = new Map();

function selectTab(tab, focus = false) {
  tabs.forEach(item => {
    const selected = item === tab;
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
  });
  panels.forEach(panel => { panel.hidden = panel.id !== tab.getAttribute('aria-controls'); });
  if (focus) tab.focus();
}

document.documentElement.classList.add('js');
selectTab(tabs[0]);
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectTab(tab));
  tab.addEventListener('keydown', event => {
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = tabs.length - 1;
    else return;
    event.preventDefault();
    selectTab(tabs[next], true);
  });
});

document.querySelectorAll('[data-replay]').forEach(button => {
  button.addEventListener('click', () => {
    const panel = button.closest('[data-variant]');
    const beats = [...panel.querySelectorAll('[data-beat]')];
    const status = panel.querySelector('[data-status]');
    (timers.get(panel) || []).forEach(clearTimeout);
    if (reduceMotion.matches) {
      beats.forEach(beat => beat.classList.remove('pending'));
      status.textContent = 'Example shown in full. The team confirms availability.';
      return;
    }
    beats.forEach(beat => beat.classList.add('pending'));
    status.textContent = 'Playing the illustrative conversation.';
    const next = beats.map((beat, index) => setTimeout(() => {
      beat.classList.remove('pending');
      if (index === beats.length - 1) status.textContent = 'Example complete. A request is ready for team confirmation.';
    }, index * 850 + 120));
    timers.set(panel, next);
  });
});

reduceMotion.addEventListener('change', () => {
  if (!reduceMotion.matches) return;
  panels.forEach(panel => {
    (timers.get(panel) || []).forEach(clearTimeout);
    panel.querySelectorAll('[data-beat]').forEach(beat => beat.classList.remove('pending'));
  });
});
