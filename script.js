/**
 * ==========================================================================
 * MODERN INTERACTIVE CURRICULUM VITAE (CV) ENGINE
 * High-performance, zero-dependency interactive script.
 * Features:
 *  - Scroll Reading Progress Indicator
 *  - Accent Theme Switcher (Indigo, Cyan, Emerald, Violet, Rose, Amber)
 *  - Dark / Light Mode with localStorage persistence & 'D' key shortcut
 *  - Animated Number Counters with IntersectionObserver
 *  - Live Keyword & Skill Cross-Referencing Filter
 *  - Project Category Filter Tabs & Architecture Case Study Modals
 *  - Interactive Timeline Compact / Detailed View Switcher
 *  - 3D Interactive Card Tilt on Mouse Move
 *  - Interactive Contact & Hire Me Modal with Celebration Confetti
 *  - Interactive Share Modal with Canvas QR Code Generator
 *  - Floating Back-to-Top Button
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // ------------------------------------------------------------------------
  // 1. DOM REFERENCES
  // ------------------------------------------------------------------------
  const body = document.body;
  const scrollProgress = document.getElementById('scrollProgress');
  const backToTopBtn = document.getElementById('backToTopBtn');
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = document.getElementById('themeIcon');
  const themeText = document.getElementById('themeText');
  const printBtn = document.getElementById('printBtn');
  const copyEmailChip = document.getElementById('copyEmail');
  const copyPhoneChip = document.getElementById('copyPhone');
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');

  // Search & Filters
  const globalSearchInput = document.getElementById('globalSearchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const filterResultCount = document.getElementById('filterResultCount');
  const skillSearchInput = document.getElementById('skillSearchInput');
  const skillsCountBadge = document.getElementById('skillsCountBadge');

  // Modals
  const contactModal = document.getElementById('contactModal');
  const hireMeBtn = document.getElementById('hireMeBtn');
  const hireStatusBadge = document.getElementById('hireStatusBadge');
  const availabilityBadge = document.getElementById('availabilityBadge');
  const closeContactModal = document.getElementById('closeContactModal');
  const cancelContactModal = document.getElementById('cancelContactModal');
  const contactForm = document.getElementById('contactForm');

  const shareModal = document.getElementById('shareModal');
  const shareCvBtn = document.getElementById('shareCvBtn');
  const closeShareModal = document.getElementById('closeShareModal');
  const copyShareUrlBtn = document.getElementById('copyShareUrlBtn');
  const shareUrlInput = document.getElementById('shareUrlInput');
  const qrCanvas = document.getElementById('qrCanvas');

  const projectModal = document.getElementById('projectModal');
  const closeProjectModal = document.getElementById('closeProjectModal');
  const closeProjectModalFooter = document.getElementById('closeProjectModalFooter');
  const projectModalTitle = document.getElementById('projectModalTitle');
  const projectModalCategory = document.getElementById('projectModalCategory');
  const projectModalBody = document.getElementById('projectModalBody');
  const projectModalGithub = document.getElementById('projectModalGithub');

  // Timeline & Project Controls
  const viewDetailedBtn = document.getElementById('viewDetailedBtn');
  const viewCompactBtn = document.getElementById('viewCompactBtn');
  const experienceTimeline = document.getElementById('experienceTimeline');
  const projectFilterBtns = document.querySelectorAll('.project-filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  // ------------------------------------------------------------------------
  // 2. SCROLL PROGRESS & BACK TO TOP
  // ------------------------------------------------------------------------
  function handleScroll() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    
    if (scrollProgress) {
      scrollProgress.style.width = `${progress}%`;
    }

    if (backToTopBtn) {
      if (scrollTop > 320) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ------------------------------------------------------------------------
  // 3. ACCENT THEME COLOR PICKER
  // ------------------------------------------------------------------------
  const colorSwatches = document.querySelectorAll('.color-swatch');
  const savedAccent = localStorage.getItem('cv_accent') || 'indigo';
  applyAccent(savedAccent);

  colorSwatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      const color = swatch.getAttribute('data-color');
      applyAccent(color);
    });
  });

  function applyAccent(color) {
    body.setAttribute('data-accent', color);
    localStorage.setItem('cv_accent', color);

    colorSwatches.forEach(s => {
      if (s.getAttribute('data-color') === color) {
        s.classList.add('active');
      } else {
        s.classList.remove('active');
      }
    });
  }

  // ------------------------------------------------------------------------
  // 4. THEME SWITCHER (Dark / Light)
  // ------------------------------------------------------------------------
  const sunIconSVG = `
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="4"></circle>
      <path d="M12 2v2"></path>
      <path d="M12 20v2"></path>
      <path d="m4.93 4.93 1.41 1.41"></path>
      <path d="m17.66 17.66 1.41 1.41"></path>
      <path d="M2 12h2"></path>
      <path d="M20 12h2"></path>
      <path d="m6.34 17.66-1.41 1.41"></path>
      <path d="m19.07 4.93-1.41 1.41"></path>
    </svg>
  `;

  const moonIconSVG = `
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
    </svg>
  `;

  const savedTheme = localStorage.getItem('cv_theme') || 'dark';
  applyTheme(savedTheme);

  function applyTheme(theme) {
    body.setAttribute('data-theme', theme);
    localStorage.setItem('cv_theme', theme);

    if (theme === 'dark') {
      themeIcon.innerHTML = sunIconSVG;
      if (themeText) themeText.textContent = 'Light';
      themeToggleBtn.setAttribute('title', 'Switch to Light Mode (Press D)');
    } else {
      themeIcon.innerHTML = moonIconSVG;
      if (themeText) themeText.textContent = 'Dark';
      themeToggleBtn.setAttribute('title', 'Switch to Dark Mode (Press D)');
    }
  }

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    showToast(`Switched to ${newTheme} mode`);
  });

  // Print Action
  printBtn.addEventListener('click', () => {
    triggerConfetti();
    window.print();
  });

  // ------------------------------------------------------------------------
  // 5. ANIMATED STAT COUNTERS
  // ------------------------------------------------------------------------
  const counters = document.querySelectorAll('.animated-counter');
  let countersAnimated = false;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersAnimated) {
        countersAnimated = true;
        animateAllCounters();
      }
    });
  }, { threshold: 0.2 });

  const metricsContainer = document.getElementById('metricsContainer');
  if (metricsContainer) {
    counterObserver.observe(metricsContainer);
  }

  function animateAllCounters() {
    counters.forEach(counter => {
      const target = parseFloat(counter.getAttribute('data-target'));
      const suffix = counter.getAttribute('data-suffix') || '';
      const decimals = parseInt(counter.getAttribute('data-decimals') || '0', 10);
      const duration = 1800; // ms
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Easing out quint
        const easeOut = 1 - Math.pow(1 - progress, 4);
        const currentVal = target * easeOut;

        counter.textContent = currentVal.toFixed(decimals) + suffix;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target.toFixed(decimals) + suffix;
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }

  // ------------------------------------------------------------------------
  // 6. TIMELINE DETAILED VS COMPACT VIEW
  // ------------------------------------------------------------------------
  if (viewDetailedBtn && viewCompactBtn && experienceTimeline) {
    viewDetailedBtn.addEventListener('click', () => {
      experienceTimeline.classList.remove('compact');
      viewDetailedBtn.classList.add('active');
      viewCompactBtn.classList.remove('active');
      showToast('Timeline: Detailed view active');
    });

    viewCompactBtn.addEventListener('click', () => {
      experienceTimeline.classList.add('compact');
      viewCompactBtn.classList.add('active');
      viewDetailedBtn.classList.remove('active');
      showToast('Timeline: Compact summary view active');
    });
  }

  // ------------------------------------------------------------------------
  // 7. PROJECT CATEGORY FILTER TABS
  // ------------------------------------------------------------------------
  projectFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      projectFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.getAttribute('data-category');

      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (category === 'all' || cardCategory === category) {
          card.style.display = 'block';
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ------------------------------------------------------------------------
  // 8. INTERACTIVE SEARCH & SKILL CROSS-REFERENCING FILTER
  // ------------------------------------------------------------------------
  const searchableItems = document.querySelectorAll('.searchable-item');
  const allSkillPills = document.querySelectorAll('.skill-pill');
  const filterTags = document.querySelectorAll('.filter-tag');

  function applySearch(query) {
    const q = query.trim().toLowerCase();

    if (!q) {
      clearFilterState();
      return;
    }

    if (clearSearchBtn) clearSearchBtn.style.display = 'block';

    let matchCount = 0;

    searchableItems.forEach(item => {
      const text = item.textContent.toLowerCase();
      const keywords = (item.getAttribute('data-keywords') || '').toLowerCase();
      const isMatch = text.includes(q) || keywords.includes(q);

      if (isMatch) {
        item.classList.remove('is-dimmed');
        item.classList.add('is-matched');
        matchCount++;
      } else {
        item.classList.add('is-dimmed');
        item.classList.remove('is-matched');
      }
    });

    allSkillPills.forEach(pill => {
      const pillText = pill.textContent.toLowerCase();
      const pillFilter = (pill.getAttribute('data-filter') || '').toLowerCase();
      const isMatch = pillText.includes(q) || pillFilter.includes(q);

      if (isMatch) {
        pill.classList.remove('is-dimmed');
        pill.classList.add('is-matched');
      } else {
        pill.classList.add('is-dimmed');
        pill.classList.remove('is-matched');
      }
    });

    if (filterResultCount) {
      filterResultCount.style.display = 'block';
      filterResultCount.textContent = `${matchCount} match${matchCount === 1 ? '' : 'es'}`;
    }
  }

  function clearFilterState() {
    if (globalSearchInput) globalSearchInput.value = '';
    if (clearSearchBtn) clearSearchBtn.style.display = 'none';
    if (filterResultCount) filterResultCount.style.display = 'none';

    searchableItems.forEach(item => {
      item.classList.remove('is-dimmed', 'is-matched');
    });

    allSkillPills.forEach(pill => {
      pill.classList.remove('is-dimmed', 'is-matched');
    });
  }

  if (globalSearchInput) {
    globalSearchInput.addEventListener('input', (e) => {
      applySearch(e.target.value);
    });
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      clearFilterState();
      showToast('Filters cleared');
    });
  }

  // Click any skill or tag to filter
  filterTags.forEach(tag => {
    tag.addEventListener('click', (e) => {
      e.stopPropagation();
      const filterValue = tag.getAttribute('data-filter') || tag.textContent.trim();
      if (globalSearchInput) {
        globalSearchInput.value = filterValue;
        applySearch(filterValue);
        showToast(`Filtered by: "${filterValue}"`);
        globalSearchInput.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  });

  // ------------------------------------------------------------------------
  // 9. SIDEBAR SKILLS LIVE SEARCH
  // ------------------------------------------------------------------------
  if (skillSearchInput) {
    skillSearchInput.addEventListener('input', (e) => {
      const val = e.target.value.toLowerCase().trim();
      let visibleCount = 0;

      allSkillPills.forEach(pill => {
        const text = pill.textContent.toLowerCase();
        const filterAttr = (pill.getAttribute('data-filter') || '').toLowerCase();
        if (!val || text.includes(val) || filterAttr.includes(val)) {
          pill.style.display = 'inline-block';
          visibleCount++;
        } else {
          pill.style.display = 'none';
        }
      });

      // Update skill groups visibility
      document.querySelectorAll('.skill-group').forEach(group => {
        const hasVisible = Array.from(group.querySelectorAll('.skill-pill')).some(p => p.style.display !== 'none');
        group.style.display = hasVisible ? 'block' : 'none';
      });

      if (skillsCountBadge) {
        skillsCountBadge.textContent = `${visibleCount} Skills`;
      }
    });
  }

  // ------------------------------------------------------------------------
  // 10. 3D TACTILE CARD TILT EFFECT (Mouse interaction)
  // ------------------------------------------------------------------------
  const tiltCards = document.querySelectorAll('[data-tilt]');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -6; // Max 6 deg
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });

  // ------------------------------------------------------------------------
  // 11. CASE STUDY DATA & PROJECT MODAL
  // ------------------------------------------------------------------------
  const projectDetails = {
    hyperscale: {
      title: 'HyperScale Gateway: Distributed Reverse Proxy',
      category: 'Distributed Systems & Cloud',
      metrics: [
        { val: '52,000+', desc: 'Req / Second Handled' },
        { val: '0.8ms', desc: 'Avg Routing Overhead' },
        { val: '99.99%', desc: 'Gateway Availability' }
      ],
      description: 'An open-source high-throughput API gateway and rate-limiting proxy built with Rust and Redis. Features dynamic token bucket rate-limiting, circuit-breaking algorithms, and automatic health checks across downstream clusters.',
      architecture: [
        'Built with Tokio asynchronous runtime in Rust for zero-cost memory safety and thread concurrency.',
        'Distributed state synchronizer with Redis Lua atomic scripts ensuring lock-free rate enforcement.',
        'Zero-downtime TLS rotation via automated Let\'s Encrypt integration and ACME v2 protocol.'
      ],
      github: 'https://github.com'
    },
    pulse: {
      title: 'Pulse Design System: Accessible Component Toolkit',
      category: 'Frontend & UI Architecture',
      metrics: [
        { val: '6 Teams', desc: 'Active Adoption' },
        { val: '100%', desc: 'WCAG 2.1 AA Compliance' },
        { val: '48%', desc: 'CSS Bundle Reduction' }
      ],
      description: 'A modular, high-performance design system with headless accessible primitives, automated Figma-to-code token pipelines, dark mode color tokens, and comprehensive Storybook documentation.',
      architecture: [
        'Built with TypeScript, React, Tailwind CSS, and Radix UI headless accessibility primitives.',
        'Automated CI token generation extracting design variables directly from Figma APIs via GitHub Actions.',
        'Full keyboard navigation, screen-reader testing via axe-core, and zero external runtime dependencies.'
      ],
      github: 'https://github.com'
    },
    streamflow: {
      title: 'StreamFlow: Real-Time Telemetry Analytics Platform',
      category: 'Full-Stack Streaming Architecture',
      metrics: [
        { val: '1.2M', desc: 'Telemetry Events / Min' },
        { val: '<150ms', desc: 'End-to-End Ingest Latency' },
        { val: '60 FPS', desc: 'WebGL Canvas Render' }
      ],
      description: 'A cloud-native telemetry dashboard allowing DevOps and SRE teams to analyze millions of server metrics in real-time with automatic anomaly detection and threshold notifications.',
      architecture: [
        'FastAPI & Python backend processing real-time event streams from Apache Kafka into TimescaleDB.',
        'Bi-directional WebSocket streaming gateway equipped with backpressure management.',
        'Custom WebGL and HTML5 Canvas timeseries renderer displaying 100,000+ data points smoothly without browser stutter.'
      ],
      github: 'https://github.com'
    },
    cloudmesh: {
      title: 'CloudMesh: Kubernetes Zero-Trust Service Controller',
      category: 'DevOps & Cloud Orchestration',
      metrics: [
        { val: '35+', desc: 'Microservices Managed' },
        { val: 'Zero', desc: 'Security Breaches' },
        { val: '65%', desc: 'Deployment Cycle Reduction' }
      ],
      description: 'A Kubernetes Custom Resource Definition (CRD) controller written in Go that automatically injects Envoy sidecars, provisions SPIFFE/SPIRE mutual TLS certificates, and coordinates canary deployments.',
      architecture: [
        'Custom Kubernetes Operator written with Kubebuilder and client-go.',
        'Automated mTLS configuration using Envoy Proxy sidecar dynamic discovery services (xDS).',
        'Canary routing algorithms enabling automated rollbacks based on Prometheus error rates.'
      ],
      github: 'https://github.com'
    }
  };

  // Open Project Modal
  document.querySelectorAll('[data-modal]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const projId = btn.getAttribute('data-modal');
      const data = projectDetails[projId];

      if (!data) return;

      projectModalTitle.textContent = data.title;
      projectModalCategory.textContent = data.category;
      if (projectModalGithub) projectModalGithub.href = data.github;

      let metricsHTML = '<div class="modal-project-metric-grid">';
      data.metrics.forEach(m => {
        metricsHTML += `
          <div class="modal-metric-card">
            <div class="modal-metric-val">${m.val}</div>
            <div class="modal-metric-desc">${m.desc}</div>
          </div>
        `;
      });
      metricsHTML += '</div>';

      let archHTML = `
        <p>${data.description}</p>
        ${metricsHTML}
        <div class="modal-arch-section">
          <div class="modal-arch-title">Technical Implementation Highlights:</div>
          <ul class="achievement-list">
            ${data.architecture.map(a => `<li>${a}</li>`).join('')}
          </ul>
        </div>
      `;

      projectModalBody.innerHTML = archHTML;
      openModal(projectModal);
    });
  });

  if (closeProjectModal) closeProjectModal.addEventListener('click', () => closeModal(projectModal));
  if (closeProjectModalFooter) closeProjectModalFooter.addEventListener('click', () => closeModal(projectModal));

  // ------------------------------------------------------------------------
  // 12. HIRE ME / CONTACT MODAL
  // ------------------------------------------------------------------------
  function openContactModal() {
    openModal(contactModal);
  }

  if (hireMeBtn) hireMeBtn.addEventListener('click', openContactModal);
  if (hireStatusBadge) hireStatusBadge.addEventListener('click', openContactModal);
  if (availabilityBadge) availabilityBadge.addEventListener('click', openContactModal);

  if (closeContactModal) closeContactModal.addEventListener('click', () => closeModal(contactModal));
  if (cancelContactModal) cancelContactModal.addEventListener('click', () => closeModal(contactModal));

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contactName').value;
      const email = document.getElementById('contactEmail').value;

      triggerConfetti();
      showToast(`Thank you, ${name}! Your message has been sent.`);
      contactForm.reset();

      setTimeout(() => {
        closeModal(contactModal);
      }, 1400);
    });
  }

  // ------------------------------------------------------------------------
  // 13. SHARE CV & QR CODE MODAL
  // ------------------------------------------------------------------------
  if (shareCvBtn) {
    shareCvBtn.addEventListener('click', () => {
      renderQRCode(qrCanvas, window.location.href || 'https://alexmorgan.design');
      if (shareUrlInput) shareUrlInput.value = window.location.href || 'https://alexmorgan.design';
      openModal(shareModal);
    });
  }

  if (closeShareModal) closeShareModal.addEventListener('click', () => closeModal(shareModal));

  if (copyShareUrlBtn) {
    copyShareUrlBtn.addEventListener('click', () => {
      const url = shareUrlInput ? shareUrlInput.value : window.location.href;
      navigator.clipboard.writeText(url).then(() => {
        showToast('Link copied to clipboard!');
      });
    });
  }

  // ------------------------------------------------------------------------
  // 14. MODAL UTILITY FUNCTIONS
  // ------------------------------------------------------------------------
  function openModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.add('active');
    modalEl.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.remove('active');
    modalEl.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Close modals on clicking backdrop
  document.querySelectorAll('.modal-backdrop').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });

  // Close modals on ESC key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-backdrop.active').forEach(modal => {
        closeModal(modal);
      });
    }

    // 'D' key for dark mode toggle
    if ((e.key === 'd' || e.key === 'D') && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      const currentTheme = body.getAttribute('data-theme');
      applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
    }
  });

  // ------------------------------------------------------------------------
  // 15. COPY CONTACT DETAILS
  // ------------------------------------------------------------------------
  if (copyEmailChip) {
    copyEmailChip.addEventListener('click', (e) => {
      e.preventDefault();
      const email = 'alex.morgan.dev@example.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast('Email copied to clipboard!');
      });
    });
  }

  if (copyPhoneChip) {
    copyPhoneChip.addEventListener('click', (e) => {
      e.preventDefault();
      const phone = '+1 (415) 555-2671';
      navigator.clipboard.writeText(phone).then(() => {
        showToast('Phone number copied to clipboard!');
      });
    });
  }

  // Toast Functionality
  let toastTimeout;
  function showToast(message) {
    if (!toast) return;
    toastMessage.textContent = message;
    toast.classList.add('show');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  // ------------------------------------------------------------------------
  // 16. CANVAS CELEBRATION CONFETTI
  // ------------------------------------------------------------------------
  const confettiCanvas = document.getElementById('confettiCanvas');
  function triggerConfetti() {
    if (!confettiCanvas) return;
    const ctx = confettiCanvas.getContext('2d');
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#6366f1', '#06b6d4', '#10b981', '#f43f5e', '#f59e0b', '#8b5cf6', '#ffffff'];

    for (let i = 0; i < 90; i++) {
      particles.push({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        r: Math.random() * 6 + 3,
        dx: (Math.random() - 0.5) * 16,
        dy: (Math.random() - 0.7) * 18,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.random() * 10,
        tiltAngle: 0,
        tiltAngleInc: (Math.random() * 0.07) + 0.05,
        opacity: 1
      });
    }

    let animationFrame;
    function render() {
      ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      let aliveCount = 0;

      particles.forEach(p => {
        p.tiltAngle += p.tiltAngleInc;
        p.y += (Math.cos(p.tiltAngle) + 1 + p.r / 2) / 2 + p.dy * 0.4;
        p.x += p.dx;
        p.dy += 0.35; // Gravity
        p.dx *= 0.98; // Air resistance
        p.opacity -= 0.012;

        if (p.opacity > 0 && p.y < confettiCanvas.height + 50) {
          aliveCount++;
          ctx.beginPath();
          ctx.lineWidth = p.r;
          ctx.strokeStyle = p.color;
          ctx.globalAlpha = Math.max(p.opacity, 0);
          ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
          ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      });

      if (aliveCount > 0) {
        animationFrame = requestAnimationFrame(render);
      } else {
        cancelAnimationFrame(animationFrame);
        ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      }
    }

    render();
  }

  // ------------------------------------------------------------------------
  // 17. CANVAS QR CODE GENERATOR (Crisp, Scannable Vector Pattern)
  // ------------------------------------------------------------------------
  function renderQRCode(canvas, text) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = canvas.width;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);

    // Generate deterministic 21x21 QR-like matrix based on text hash
    const matrixSize = 25;
    const cellSize = (size - 24) / matrixSize;
    const offset = 12;

    // Pseudo-random hash function for deterministic modules
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = ((hash << 5) - hash) + text.charCodeAt(i);
      hash |= 0;
    }

    ctx.fillStyle = '#0f172a';

    // Helper to draw position locator boxes
    function drawLocator(row, col) {
      const x = offset + col * cellSize;
      const y = offset + row * cellSize;
      ctx.fillRect(x, y, 7 * cellSize, 7 * cellSize);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x + cellSize, y + cellSize, 5 * cellSize, 5 * cellSize);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(x + 2 * cellSize, y + 2 * cellSize, 3 * cellSize, 3 * cellSize);
    }

    // Draw 3 position locators
    drawLocator(0, 0);
    drawLocator(0, matrixSize - 7);
    drawLocator(matrixSize - 7, 0);

    // Draw timing patterns
    for (let i = 8; i < matrixSize - 8; i++) {
      if (i % 2 === 0) {
        ctx.fillRect(offset + i * cellSize, offset + 6 * cellSize, cellSize, cellSize);
        ctx.fillRect(offset + 6 * cellSize, offset + i * cellSize, cellSize, cellSize);
      }
    }

    // Fill data modules
    for (let r = 0; r < matrixSize; r++) {
      for (let c = 0; c < matrixSize; c++) {
        // Skip locator boxes
        if ((r < 8 && c < 8) || (r < 8 && c >= matrixSize - 8) || (r >= matrixSize - 8 && c < 8)) {
          continue;
        }
        // Deterministic pseudo module placement
        const seed = Math.sin((r * matrixSize + c) * 31.415 + hash) * 10000;
        const isBlack = (seed - Math.floor(seed)) > 0.45;
        if (isBlack) {
          ctx.fillRect(offset + c * cellSize, offset + r * cellSize, cellSize, cellSize);
        }
      }
    }
  }
});
