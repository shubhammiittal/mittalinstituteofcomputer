(() => {
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const mobileNav = document.getElementById('mobileNav');
  const lectureSearch = document.getElementById('lectureSearch');
  const videoCards = Array.from(document.querySelectorAll('.video-card'));
  const filterButtons = Array.from(document.querySelectorAll('.filter-pill'));
  const emptyState = document.getElementById('emptyState');
  const clearSearch = document.getElementById('clearSearch');
  const enquiryForm = document.getElementById('enquiryForm');
  const formFeedback = document.getElementById('formFeedback');
  let activeFilter = 'all';

  // Theme is saved locally after the first explicit user choice.
  const savedTheme = (() => {
    try { return localStorage.getItem('mic-theme'); } catch (_) { return null; }
  })();
  const preferredTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  applyTheme(savedTheme || preferredTheme);

  function applyTheme(theme) {
    root.dataset.theme = theme;
    if (themeMeta) themeMeta.setAttribute('content', theme === 'light' ? '#f6f7fc' : '#0b1020');
    if (themeToggle) {
      const next = theme === 'dark' ? 'light' : 'dark';
      themeToggle.setAttribute('aria-label', `Switch to ${next} theme`);
      themeToggle.setAttribute('title', `Switch to ${next} theme`);
    }
  }

  themeToggle?.addEventListener('click', () => {
    const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
    try { localStorage.setItem('mic-theme', nextTheme); } catch (_) { /* private browsing can disable storage */ }
  });

  // Mobile navigation: close after selection and when Escape is pressed.
  mobileMenuToggle?.addEventListener('click', () => {
    const open = mobileMenuToggle.getAttribute('aria-expanded') !== 'true';
    mobileMenuToggle.setAttribute('aria-expanded', String(open));
    mobileMenuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    mobileNav.hidden = !open;
  });
  mobileNav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => closeMobileNav()));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMobileNav();
  });
  document.addEventListener('click', (event) => {
    if (!mobileNav || mobileNav.hidden) return;
    const header = document.querySelector('.site-header');
    if (header && !header.contains(event.target)) closeMobileNav();
  });
  function closeMobileNav() {
    if (!mobileNav || !mobileMenuToggle) return;
    mobileNav.hidden = true;
    mobileMenuToggle.setAttribute('aria-expanded', 'false');
    mobileMenuToggle.setAttribute('aria-label', 'Open navigation');
  }

  // Filterable lecture library; filters and text search work together.
  function updateLectures() {
    const term = (lectureSearch?.value || '').trim().toLowerCase();
    let visibleCount = 0;
    videoCards.forEach((card) => {
      const categoryMatches = activeFilter === 'all' || card.dataset.category === activeFilter;
      const searchable = `${card.dataset.search || ''} ${card.textContent || ''}`.toLowerCase();
      const searchMatches = !term || searchable.includes(term);
      const visible = categoryMatches && searchMatches;
      card.hidden = !visible;
      if (visible) visibleCount += 1;
    });
    if (emptyState) emptyState.hidden = visibleCount !== 0;
  }
  filterButtons.forEach((button) => button.addEventListener('click', () => {
    activeFilter = button.dataset.filter || 'all';
    filterButtons.forEach((other) => {
      const isActive = other === button;
      other.classList.toggle('is-active', isActive);
      other.setAttribute('aria-pressed', String(isActive));
    });
    updateLectures();
  }));
  lectureSearch?.addEventListener('input', updateLectures);
  clearSearch?.addEventListener('click', () => {
    activeFilter = 'all';
    if (lectureSearch) lectureSearch.value = '';
    filterButtons.forEach((button) => {
      const isActive = button.dataset.filter === 'all';
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });
    updateLectures();
  });

  // Static-site enquiry: package details into a WhatsApp draft. The visitor sends it themselves.
  enquiryForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!enquiryForm.reportValidity()) return;
    const formData = new FormData(enquiryForm);
    const name = String(formData.get('name') || '').trim();
    const phone = String(formData.get('phone') || '').trim();
    const interest = String(formData.get('interest') || '').trim();
    const message = String(formData.get('message') || '').trim();
    const lines = [
      'Hello Mittal Institute of Computer,',
      '',
      'I would like to enquire about learning resources.',
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Interested in: ${interest}`,
    ];
    if (message) lines.push(`Message: ${message}`);
    lines.push('', 'Please share the relevant details.');
    const whatsappUrl = `https://wa.me/918958298949?text=${encodeURIComponent(lines.join('\n'))}`;
    if (formFeedback) formFeedback.textContent = 'Opening WhatsApp with your enquiry. Review the message and press Send there.';
    window.location.href = whatsappUrl;
  });

  const currentYear = document.getElementById('currentYear');
  if (currentYear) currentYear.textContent = String(new Date().getFullYear());

  // Subtle reveal-on-scroll without making content unavailable when motion is reduced.
  const revealElements = Array.from(document.querySelectorAll('.reveal'));
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && !reduceMotion) {
    const observer = new IntersectionObserver((entries, instance) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          instance.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -28px 0px' });
    revealElements.forEach((element) => observer.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add('is-visible'));
  }

  // Highlight nav items based on the section currently in view.
  const navLinks = Array.from(document.querySelectorAll('.desktop-nav a'));
  const sections = navLinks.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window && sections.length) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const activeId = `#${entry.target.id}`;
        navLinks.forEach((link) => link.classList.toggle('is-current', link.getAttribute('href') === activeId));
      });
    }, { rootMargin: '-28% 0px -62% 0px', threshold: 0 });
    sections.forEach((section) => navObserver.observe(section));
  }
})();
