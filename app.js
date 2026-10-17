(() => {
  'use strict';
  const config = window.CLINIC_CONFIG || {};
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  function safeHttps(value) {
    try { const url = new URL(value); return url.protocol === 'https:' ? url.href : null; }
    catch { return null; }
  }
  function signal(action, detail = {}) {
    // Hook local para futura mensuração. Não transmite ou armazena dados.
    window.dispatchEvent(new CustomEvent('implansorria:conversion', {detail: {action, ...detail}}));
  }
  $$('[data-location]').forEach(el => { el.textContent = config.location || 'Conheça nossa clínica'; });
  $$('[data-professional]').forEach(el => { el.textContent = config.professional || 'Equipe Implan Sorria Mais'; });
  const instagram = safeHttps(config.instagram);
  $$('[data-instagram]').forEach(el => { if (instagram) el.href = instagram; else el.hidden = true; });
  $$('[data-registration]').forEach(el => {
    el.textContent = config.registration || '';
    el.hidden = !config.registration;
  });
  const clinicPhone = String(config.whatsapp || '').replace(/\D/g, '');
  $$('[data-phone]').forEach(el => {
    const valid = /^\d{10,15}$/.test(clinicPhone);
    el.hidden = !valid;
    if (valid) el.href = `tel:+${clinicPhone}`;
    else el.removeAttribute('href');
  });
  $$('[data-phone-label]').forEach(el => { el.textContent = config.phoneDisplay || clinicPhone; });
  const clinicInfo = $('#clinic-info');
  [config.address, config.hours].filter(Boolean).forEach(text => {
    const p = document.createElement('p'); p.textContent = text; clinicInfo.append(p);
  });
  if (safeHttps(config.mapUrl)) {
    const a = document.createElement('a'); a.href = safeHttps(config.mapUrl);
    a.textContent = 'Como chegar ↗'; a.target = '_blank'; a.rel = 'noopener noreferrer'; clinicInfo.append(a);
  }
  clinicInfo.hidden = !clinicInfo.childElementCount;
  $('#year').textContent = new Date().getFullYear();

  const nav = $('#navigation');
  const menu = $('.menu-toggle');
  function closeMenu() {
    nav.classList.remove('is-open'); menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Abrir menu');
  }
  menu.addEventListener('click', () => {
    const expanded = menu.getAttribute('aria-expanded') !== 'true';
    nav.classList.toggle('is-open', expanded); menu.setAttribute('aria-expanded', String(expanded));
    menu.setAttribute('aria-label', expanded ? 'Fechar menu' : 'Abrir menu');
  });
  $$('a', nav).forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  matchMedia('(min-width: 761px)').addEventListener('change', e => { if (e.matches) closeMenu(); });

  const goals = [
    {label: 'IMPLANTES & PRÓTESES', title: 'Um novo capítulo.\nNovos motivos para sorrir.', text: 'Se a falta de um ou mais dentes faz parte da sua história, uma avaliação é o começo para conversar sobre as possibilidades de cuidado.', tags: ['Implantes dentários', 'Próteses dentárias'], topic: 'Implantes e próteses'},
    {label: 'FACETAS & ESTÉTICA', title: 'Valorizar o sorriso.\nPreservar a sua essência.', text: 'Conte o que você gostaria de valorizar no seu sorriso. A avaliação é o momento de entender as possibilidades, os limites e o que faz sentido para você.', tags: ['Facetas', 'Estética do sorriso'], topic: 'Facetas e estética'},
    {label: 'ORTODONTIA', title: 'Seu sorriso,\nem uma nova direção.', text: 'Se o alinhamento dos dentes está nos seus planos, converse sobre ortodontia. O primeiro passo é conhecer o seu caso e esclarecer suas dúvidas.', tags: ['Ortodontia', 'Avaliação individual'], topic: 'Ortodontia'},
    {label: 'VAMOS DESCOBRIR JUNTOS', title: 'Você não precisa\nsaber por onde começar.', text: 'Talvez você queira mudar algo, mas ainda não saiba o quê. Comece contando como se sente e o que gostaria de entender melhor sobre o seu sorriso.', tags: ['Escuta', 'Orientação profissional'], topic: 'Quero orientação'}
  ];
  const tabs = $$('[data-goal]');
  function selectGoal(index, focus = false) {
    const goal = goals[index];
    tabs.forEach((tab, i) => { tab.setAttribute('aria-selected', String(i === index)); tab.tabIndex = i === index ? 0 : -1; });
    $('#treatment-panel').setAttribute('aria-labelledby', tabs[index].id);
    $('#treatment-panel').dataset.active = String(index);
    $('#panel-label').textContent = goal.label;
    const title = $('#panel-title'); title.replaceChildren();
    goal.title.split('\n').forEach((line, i) => { if (i) title.append(document.createElement('br')); title.append(document.createTextNode(line)); });
    $('#panel-description').textContent = goal.text;
    $('#panel-count').textContent = `0${index + 1} / 04`;
    $('#panel-tags').replaceChildren(...goal.tags.map(tag => { const span = document.createElement('span'); span.textContent = tag; return span; }));
    $('#panel-contact').dataset.topic = goal.topic;
    const panel = $('#treatment-panel'); panel.classList.remove('panel-enter'); void panel.offsetWidth; panel.classList.add('panel-enter');
    if (focus) tabs[index].focus();
    signal('treatment_select', {topic: goal.topic});
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectGoal(index));
    tab.addEventListener('keydown', e => {
      let next = index;
      if (['ArrowDown', 'ArrowRight'].includes(e.key)) next = (index + 1) % tabs.length;
      else if (['ArrowUp', 'ArrowLeft'].includes(e.key)) next = (index + tabs.length - 1) % tabs.length;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = tabs.length - 1;
      else return;
      e.preventDefault(); selectGoal(next, true);
    });
  });

  const dialog = $('#contact-dialog');
  const form = $('#contact-form');
  const nextStep = $('#next-step');
  const whatsappLink = $('#whatsapp-link');
  let opener;
  let source = '';
  const getTopic = () => $('input[name="topic"]:checked', form)?.value || '';
  const getIntent = () => $('input[name="intent"]:checked', form)?.value || 'Agendar uma avaliação';
  function updateMessage() {
    const topic = getTopic();
    const phone = String(config.whatsapp || '').replace(/\D/g, '');
    const ready = /^\d{10,15}$/.test(phone) && Boolean(topic);
    whatsappLink.hidden = !ready;
    $('#contact-unavailable').hidden = ready;
    if (!ready) { whatsappLink.removeAttribute('href'); return; }
    const intention = getIntent() === 'Tirar uma dúvida' ? 'tirar uma dúvida antes de agendar' : 'consultar os horários para uma avaliação';
    const subject = topic === 'Quero orientação' ? 'Ainda não sei qual tratamento procurar e gostaria de orientação.' : `Tenho interesse em ${topic.toLowerCase()}.`;
    const text = `Olá! Conheci a ${config.name || 'Implan Sorria Mais'} pelo site e gostaria de ${intention}. ${subject}`;
    whatsappLink.href = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  }
  function renderStep(step, focus = true) {
    $('#topic-step').hidden = step !== 1;
    $('#intent-step').hidden = step !== 2;
    $$('.dialog-progress span').forEach((el, i) => el.classList.toggle('active', i < step));
    $('#step-label').textContent = step === 1 ? '01 / VAMOS COMEÇAR POR VOCÊ' : '02 / SEU PRÓXIMO PASSO';
    $('#dialog-title').innerHTML = step === 1 ? 'O que te faria<br><em>sorrir mais?</em>' : 'Vamos começar<br><em>com um oi?</em>';
    $('#dialog-intro').textContent = step === 1 ? 'Escolha um assunto para começar a conversa.' : 'Como você prefere conversar com a equipe?';
    $('#selected-topic').textContent = `Seu interesse: ${getTopic()}`;
    nextStep.disabled = !getTopic(); updateMessage(); dialog.scrollTop = 0;
    if (focus) $('#dialog-title').focus();
  }
  $$('[data-contact]').forEach(button => button.addEventListener('click', () => {
    opener = button; source = button.dataset.source || 'página';
    form.reset();
    $$('input[name="topic"]', form).forEach(input => { input.checked = input.value === button.dataset.topic; });
    if (button.dataset.intent) $$('input[name="intent"]', form).forEach(input => { input.checked = input.value === button.dataset.intent; });
    renderStep(1, false); closeMenu();
    if (typeof dialog.showModal !== 'function') {
      const phone = String(config.whatsapp || '').replace(/\D/g, '');
      if (/^\d{10,15}$/.test(phone)) window.open(`https://wa.me/${phone}`, '_blank', 'noopener,noreferrer');
      else if (instagram) window.open(instagram, '_blank', 'noopener,noreferrer');
      return;
    }
    dialog.showModal(); document.body.classList.add('modal-open'); $('#dialog-title').focus();
    signal('contact_open', {source});
  }));
  form.addEventListener('change', () => { nextStep.disabled = !getTopic(); updateMessage(); });
  nextStep.addEventListener('click', () => { if (getTopic()) renderStep(2); });
  $('#previous-step').addEventListener('click', () => renderStep(1));
  $('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => {
    if (e.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => { document.body.classList.remove('modal-open'); opener?.focus(); });
  form.addEventListener('submit', e => e.preventDefault());
  whatsappLink.addEventListener('click', () => signal('whatsapp_click', {source, topic: getTopic(), intent: getIntent()}));
})();

/* Efeitos progressivos: nenhuma navegação depende de animação. */
(() => {
  'use strict';
  const body = document.body;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const toggle = document.getElementById('motion-toggle');
  const label = document.getElementById('motion-label');
  const hero = document.querySelector('.hero-shell');
  const portrait = document.querySelector('.hero-visual');
  const progress = document.querySelector('.reading-progress span');
  const manifesto = document.querySelector('.manifesto-text');
  let paused = false;
  let enabled = false;
  let scrollFrame = 0;
  let pointerFrame = 0;

  // Mantém texto semântico e espaços; apenas acrescenta spans às palavras.
  const walker = document.createTreeWalker(manifesto, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(node => {
    const fragment = document.createDocumentFragment();
    node.textContent.split(/(\s+)/).forEach(part => {
      if (!part || /^\s+$/.test(part)) fragment.append(document.createTextNode(part));
      else { const span = document.createElement('span'); span.className = 'word'; span.textContent = part; fragment.append(span); }
    });
    node.replaceWith(fragment);
  });
  const words = [...manifesto.querySelectorAll('.word')];
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  function updateScroll() {
    scrollFrame = 0;
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? clamp(scrollY / max, 0, 1) : 0})`;
    const rect = manifesto.getBoundingClientRect();
    const amount = clamp((innerHeight * .87 - rect.top) / (rect.height + innerHeight * .27), 0, 1);
    words.forEach((word, index) => word.classList.toggle('lit', !enabled || index < Math.ceil(amount * words.length)));
  }
  function scheduleScroll() { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll); }
  function updateMotion() {
    enabled = !paused && !reduced.matches;
    body.classList.toggle('motion-on', enabled);
    toggle.disabled = reduced.matches;
    toggle.setAttribute('aria-pressed', String(!enabled));
    label.textContent = reduced.matches ? 'Movimento reduzido' : enabled ? 'Pausar efeitos' : 'Ativar efeitos';
    toggle.querySelector('.motion-icon').textContent = enabled ? 'Ⅱ' : '▷';
    if (!enabled) {
      portrait.style.removeProperty('--portrait-x'); portrait.style.removeProperty('--portrait-y');
      hero.style.removeProperty('--light-x'); hero.style.removeProperty('--light-y');
    }
    updateScroll();
  }
  toggle.addEventListener('click', () => { paused = !paused; updateMotion(); });
  reduced.addEventListener('change', updateMotion);
  window.addEventListener('scroll', scheduleScroll, {passive:true});
  window.addEventListener('resize', scheduleScroll, {passive:true});
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.remove('awaiting-reveal'); observer.unobserve(entry.target); }
    }), {threshold:.1});
    document.querySelectorAll('[data-reveal]').forEach(el => {
      if (el.getBoundingClientRect().top > innerHeight) el.classList.add('awaiting-reveal');
      observer.observe(el);
    });
  }
  hero.addEventListener('pointermove', event => {
    if (!enabled || !finePointer.matches || pointerFrame) return;
    const x = event.clientX, y = event.clientY;
    pointerFrame = requestAnimationFrame(() => {
      pointerFrame = 0;
      if (!enabled) return;
      const rect = hero.getBoundingClientRect();
      const px = clamp((x - rect.left) / rect.width, 0, 1);
      const py = clamp((y - rect.top) / rect.height, 0, 1);
      hero.style.setProperty('--light-x', `${px * 100}%`); hero.style.setProperty('--light-y', `${py * 100}%`);
      portrait.style.setProperty('--portrait-x', `${(px - .5) * 8}px`);
      portrait.style.setProperty('--portrait-y', `${(py - .5) * 6}px`);
    });
  }, {passive:true});
  hero.addEventListener('pointerleave', () => {
    if (pointerFrame) cancelAnimationFrame(pointerFrame);
    pointerFrame = 0;
    portrait.style.removeProperty('--portrait-x'); portrait.style.removeProperty('--portrait-y');
  });
  updateMotion();
})();
