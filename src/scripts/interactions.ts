import { BMI_CATEGORIES, SHOWCASE_SCREENS } from '../config/site';

const prefersReducedMotion = (): boolean =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function initHeaderAndNav(): void {
  const header = document.getElementById('site-header');
  const toggleBtn = document.getElementById('mobile-menu-toggle') as HTMLButtonElement | null;
  const drawer = document.getElementById('mobile-drawer');
  const navLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-nav-section]'));

  const syncScrollHeader = () => {
    if (!header) return;
    if (window.scrollY > 24) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  };

  syncScrollHeader();
  window.addEventListener('scroll', syncScrollHeader, { passive: true });

  // Active section indicator via IntersectionObserver
  const sectionIds = Array.from(
    new Set(navLinks.map((el) => el.dataset.navSection).filter((v): v is string => Boolean(v)))
  );
  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter((el): el is HTMLElement => Boolean(el));

  if (sections.length > 0 && 'IntersectionObserver' in window) {
    const setActive = (id: string) => {
      navLinks.forEach((link) => {
        link.classList.toggle('is-active', link.dataset.navSection === id);
      });
    };

    setActive(sections[0].id);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) {
          setActive(visible[0].target.id);
        }
      },
      {
        rootMargin: '-25% 0px -55% 0px',
        threshold: [0.05, 0.25, 0.5],
      }
    );

    sections.forEach((section) => observer.observe(section));
  }

  // Mobile drawer accessibility & controls
  if (toggleBtn && drawer) {
    const closeDrawer = () => {
      drawer.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
      toggleBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };

    const openDrawer = () => {
      drawer.classList.add('is-open');
      drawer.setAttribute('aria-hidden', 'false');
      toggleBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      const firstClose = drawer.querySelector<HTMLElement>('.mobile-drawer__close');
      firstClose?.focus();
    };

    toggleBtn.addEventListener('click', () => {
      const isOpen = drawer.classList.contains('is-open');
      if (isOpen) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    drawer.querySelectorAll('[data-close-drawer]').forEach((el) => {
      el.addEventListener('click', closeDrawer);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
        closeDrawer();
        toggleBtn.focus();
      }
    });
  }
}

function initScrollReveals(): void {
  const revealNodes = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
  if (revealNodes.length === 0) return;

  if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
    revealNodes.forEach((node) => node.classList.add('is-visible'));
    return;
  }

  // Ensure elements already above or within the initial viewport reveal immediately
  const revealIfPastViewport = () => {
    const thresholdY = window.innerHeight * 0.96;
    revealNodes.forEach((node) => {
      if (!node.classList.contains('is-visible') && node.getBoundingClientRect().top <= thresholdY) {
        node.classList.add('is-visible');
      }
    });
  };

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: '0px 0px -6% 0px',
      threshold: 0.05,
    }
  );

  revealNodes.forEach((node) => observer.observe(node));
  revealIfPastViewport();
  window.addEventListener('scroll', revealIfPastViewport, { passive: true });
}

function initParallaxAndMotion(): void {
  if (prefersReducedMotion()) return;

  const parallaxEls = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]'));
  if (parallaxEls.length > 0) {
    let ticking = false;
    const updateParallax = () => {
      const scrollY = window.scrollY;
      parallaxEls.forEach((el) => {
        const speed = parseFloat(el.dataset.parallax || '0.15');
        const offset = Math.min(scrollY * speed, 140);
        el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
      });
      ticking = false;
    };

    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          requestAnimationFrame(updateParallax);
          ticking = true;
        }
      },
      { passive: true }
    );
  }

  // Subtle desktop-only pointer tilt & magnetic button interactions
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!canHover) return;

  document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((el) => {
    el.addEventListener('mousemove', (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const rotateY = (x * 6).toFixed(2);
      const rotateX = (-y * 6).toFixed(2);
      el.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });

  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((btn) => {
    btn.addEventListener('mousemove', (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const dx = (e.clientX - rect.left - rect.width / 2) * 0.16;
      const dy = (e.clientY - rect.top - rect.height / 2) * 0.16;
      btn.style.transform = `translate3d(${dx.toFixed(1)}px, ${(dy - 2).toFixed(1)}px, 0)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

function initBmiCalculator(): void {
  const heightInput = document.getElementById('bmi-height-input') as HTMLInputElement | null;
  const heightRange = document.getElementById('bmi-height-range') as HTMLInputElement | null;
  const weightInput = document.getElementById('bmi-weight-input') as HTMLInputElement | null;
  const weightRange = document.getElementById('bmi-weight-range') as HTMLInputElement | null;
  const resetBtn = document.getElementById('bmi-reset-btn') as HTMLButtonElement | null;
  const valueEl = document.getElementById('bmi-value');
  const pillEl = document.getElementById('bmi-category-pill');
  const summaryEl = document.getElementById('bmi-summary');
  const markerEl = document.getElementById('bmi-scale-marker');
  const errorEl = document.getElementById('bmi-error');
  const categoryRows = Array.from(document.querySelectorAll<HTMLElement>('[data-bmi-row]'));

  if (!heightInput || !heightRange || !weightInput || !weightRange || !valueEl || !pillEl || !summaryEl || !markerEl) {
    return;
  }

  const getScalePositionPercent = (bmi: number): number => {
    // Track proportions match grid-template-columns: 14fr (15..18.5), 26fr (18.5..25), 20fr (25..30), 40fr (30..40+)
    const clamped = Math.max(15, Math.min(40, bmi));
    if (clamped < 18.5) {
      return ((clamped - 15) / 3.5) * 14;
    }
    if (clamped < 25) {
      return 14 + ((clamped - 18.5) / 6.5) * 26;
    }
    if (clamped < 30) {
      return 40 + ((clamped - 25) / 5) * 20;
    }
    return 60 + ((clamped - 30) / 10) * 40;
  };

  const calculateAndRender = () => {
    const hCm = parseFloat(heightInput.value);
    const wKg = parseFloat(weightInput.value);

    if (Number.isNaN(hCm) || Number.isNaN(wKg) || hCm < 100 || hCm > 250 || wKg < 30 || wKg > 250) {
      if (errorEl) {
        errorEl.textContent = 'Enter a height between 100–250 cm and a weight between 30–250 kg.';
        errorEl.hidden = false;
      }
      return;
    }

    if (errorEl) {
      errorEl.hidden = true;
    }

    const heightM = hCm / 100;
    const rawBmi = wKg / (heightM * heightM);
    const roundedBmi = Math.round(rawBmi * 10) / 10;

    const category =
      BMI_CATEGORIES.find((cat) => roundedBmi >= cat.min && roundedBmi <= cat.max) || BMI_CATEGORIES[3];

    valueEl.textContent = roundedBmi.toFixed(1);
    pillEl.textContent = category.label;
    pillEl.setAttribute('data-category', category.key);
    summaryEl.textContent = category.summary;

    const percent = Math.max(2, Math.min(98, getScalePositionPercent(roundedBmi)));
    markerEl.style.left = `${percent.toFixed(1)}%`;

    categoryRows.forEach((row) => {
      row.classList.toggle('is-active', row.dataset.bmiRow === category.key);
    });
  };

  const syncPair = (numEl: HTMLInputElement, rangeEl: HTMLInputElement, min: number, max: number) => {
    rangeEl.addEventListener('input', () => {
      numEl.value = rangeEl.value;
      calculateAndRender();
    });

    numEl.addEventListener('input', () => {
      const val = parseFloat(numEl.value);
      if (!Number.isNaN(val)) {
        const clamped = Math.max(min, Math.min(max, val));
        rangeEl.value = String(clamped);
      }
      calculateAndRender();
    });
  };

  syncPair(heightInput, heightRange, 100, 250);
  syncPair(weightInput, weightRange, 30, 250);

  resetBtn?.addEventListener('click', () => {
    heightInput.value = '175';
    heightRange.value = '175';
    weightInput.value = '70';
    weightRange.value = '70';
    calculateAndRender();
  });

  calculateAndRender();
}

function initShowcaseTabs(): void {
  const tabs = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-showcase-tab]'));
  const panels = Array.from(document.querySelectorAll<HTMLElement>('[data-showcase-panel]'));
  const captionEl = document.getElementById('showcase-caption');

  if (tabs.length === 0 || panels.length === 0) return;

  const activate = (screenId: string) => {
    tabs.forEach((tab) => {
      const isSelected = tab.dataset.showcaseTab === screenId;
      tab.classList.toggle('is-active', isSelected);
      tab.setAttribute('aria-selected', isSelected ? 'true' : 'false');
    });

    panels.forEach((panel) => {
      const isMatch = panel.dataset.showcasePanel === screenId;
      panel.classList.toggle('is-active', isMatch);
      panel.hidden = !isMatch;
    });

    if (captionEl) {
      const screen = SHOWCASE_SCREENS.find((s) => s.id === screenId);
      if (screen) {
        captionEl.textContent = screen.caption;
      }
    }
  };

  tabs.forEach((tab, idx) => {
    tab.addEventListener('click', () => {
      if (tab.dataset.showcaseTab) {
        activate(tab.dataset.showcaseTab);
      }
    });

    tab.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        const next = tabs[(idx + 1) % tabs.length];
        next.focus();
        if (next.dataset.showcaseTab) activate(next.dataset.showcaseTab);
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const prev = tabs[(idx - 1 + tabs.length) % tabs.length];
        prev.focus();
        if (prev.dataset.showcaseTab) activate(prev.dataset.showcaseTab);
      }
    });
  });
}

function initFaqAccordion(): void {
  const triggers = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-faq-trigger]'));
  if (triggers.length === 0) return;

  triggers.forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      if (!item) return;

      const isCurrentlyOpen = item.classList.contains('is-open');

      // Close others for clean editorial focus
      triggers.forEach((otherBtn) => {
        const otherItem = otherBtn.closest('.faq-item');
        otherItem?.classList.remove('is-open');
        otherBtn.setAttribute('aria-expanded', 'false');
      });

      if (!isCurrentlyOpen) {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });

    btn.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        triggers[(idx + 1) % triggers.length].focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        triggers[(idx - 1 + triggers.length) % triggers.length].focus();
      }
    });
  });
}

function initStoreModal(): void {
  const modal = document.getElementById('store-modal');
  const platformLabel = document.getElementById('store-modal-platform');
  const titleEl = document.getElementById('store-modal-title');
  const bodyEl = document.getElementById('store-modal-body');

  if (!modal) return;

  let lastTrigger: HTMLElement | null = null;

  const openModal = (kind: string, trigger: HTMLElement) => {
    lastTrigger = trigger;

    if (platformLabel && titleEl && bodyEl) {
      if (kind === 'ios') {
        platformLabel.textContent = 'Apple App Store · iPhone';
        titleEl.textContent = 'FitMate on the App Store';
        bodyEl.textContent =
          'The official Apple App Store URL is linked directly here as soon as the published store link is configured. Downloading and using FitMate as a gym member is 100% free.';
      } else if (kind === 'android') {
        platformLabel.textContent = 'Google Play · Android';
        titleEl.textContent = 'FitMate on Google Play';
        bodyEl.textContent =
          'The official Google Play URL is linked directly here as soon as the published store link is configured. Downloading and using FitMate as a gym member is 100% free.';
      } else {
        platformLabel.textContent = 'Official Channels';
        titleEl.textContent = 'FitMate Official Social Channels';
        bodyEl.textContent =
          'Official FitMate social channel links will appear here once published.';
      }
    }

    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    const closeBtn = modal.querySelector<HTMLElement>('.store-modal__close');
    closeBtn?.focus();
  };

  const closeModal = () => {
    modal.hidden = true;
    document.body.style.overflow = '';
    lastTrigger?.focus();
  };

  document.querySelectorAll<HTMLElement>('[data-store-modal-trigger]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      openModal(trigger.dataset.storeModalTrigger || 'ios', trigger);
    });
  });

  modal.querySelectorAll('[data-close-store-modal]').forEach((el) => {
    el.addEventListener('click', closeModal);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) {
      closeModal();
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initHeaderAndNav();
  initScrollReveals();
  initParallaxAndMotion();
  initBmiCalculator();
  initShowcaseTabs();
  initFaqAccordion();
  initStoreModal();
});
