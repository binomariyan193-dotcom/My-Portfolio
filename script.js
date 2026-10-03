/**
 * BINO MARIYAN - PORTFOLIO INTERACTIVITY SCRIPT
 * Features:
 * - Ambient dynamic particle canvas
 * - Sticky navigation & scroll observer
 * - Mobile responsive navigation drawer
 * - Filterable project catalog
 * - Dynamic architecture modals
 * - Interactive resume preview & PDF print trigger
 * - Clipboard copy with toast notification
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all interactive modules
  initAmbientCanvas();
  initNavigation();
  initProjectFilters();
  initModals();
  initClipboardAndContact();
  initDynamicYear();
  init3DAvatarTilt();
});

/* ===================================================================
   1. Ambient Particle Canvas Animation
   =================================================================== */
function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const particles = [];
  const particleCount = Math.min(Math.floor((width * height) / 16000), 75);
  const maxDistance = 140;

  let mouse = { x: null, y: null, radius: 150 };

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6;
      this.radius = Math.random() * 1.8 + 0.8;
      this.color = Math.random() > 0.4 ? 'rgba(0, 242, 254, ' : 'rgba(121, 40, 202, ';
      this.baseAlpha = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse subtle repulsion
      if (mouse.x && mouse.y) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          const directionX = dx / distance;
          const directionY = dy / distance;
          this.x -= directionX * force * 1.5;
          this.y -= directionY * force * 1.5;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `${this.color}${this.baseAlpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDistance) {
          const alpha = (1 - dist / maxDistance) * 0.18;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 242, 254, ${alpha})`;
          ctx.lineWidth = 0.75;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* ===================================================================
   2. Sticky Navigation & Smooth Active Scroll
   =================================================================== */
function initNavigation() {
  const navbarWrapper = document.querySelector('.navbar-wrapper');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');
  const links = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbarWrapper?.classList.add('scrolled');
    } else {
      navbarWrapper?.classList.remove('scrolled');
    }

    // Active Section Indicator
    let currentId = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id');
      }
    });

    links.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile menu toggle
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      mobileToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking any nav item
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileToggle.classList.remove('active');
      });
    });
  }
}

/* ===================================================================
   3. Project Catalog Filter
   =================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const categories = card.getAttribute('data-category') || '';
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/* ===================================================================
   4. Modals (Architecture Deep-Dive & Resume Preview)
   =================================================================== */
const projectDetailsData = {
  'food-platform': {
    title: 'Food-Processing-Operations-Platform (Architecture & Workflows)',
    content: `
      <p style="margin-bottom: 1.25rem; font-size: 1rem; color: #CBD5E1;">
        An industrial-grade, AI-native platform architected to eliminate paper-based manual audits, reduce batch turnover delays, and dynamically predict safety anomalies in food and agricultural facilities.
      </p>

      <div class="arch-diagram">
        <div class="arch-node">
          <div class="arch-node-title">1. Real-time Telemetry & FEFO Logistics Layer</div>
          <div class="arch-node-desc">
            Tracks batch cycle life, line speeds, and Overall Equipment Effectiveness (OEE) metrics. Employs First-Expired-First-Out (FEFO) automated warehouse prioritization to minimize perishable spoilage.
          </div>
        </div>

        <div class="arch-node">
          <div class="arch-node-title">2. Multi-Agent Orchestration Engine</div>
          <div class="arch-node-desc">
            Autonomous agent swarms assigned to dedicated domain responsibilities:
            <ul style="margin-top: 0.5rem; padding-left: 1.2rem; color: #94A3B8;">
              <li><strong>Inspector Agent:</strong> Compares live batch run data against standard operating parameters.</li>
              <li><strong>Regulatory Agent:</strong> Continuously checks protocols against HACCP, ISO 22000, and FDA FSMA compliance standards.</li>
              <li><strong>Audit Synthesis Agent:</strong> Generates instant, audit-ready regulatory inspection logs.</li>
            </ul>
          </div>
        </div>

        <div class="arch-node">
          <div class="arch-node-title">3. Vector Search RAG Pipeline</div>
          <div class="arch-node-desc">
            Indexes complete compliance doctrine (HACCP, ISO 22000, FDA FSMA, SQF Edition 9) in PostgreSQL pgvector. Allows plant managers to ask operational questions with instant source citations and risk warnings.
          </div>
        </div>

        <div class="arch-node">
          <div class="arch-node-title">4. High-Performance API & Storage</div>
          <div class="arch-node-desc">
            Built with <strong>FastAPI</strong> for async concurrency, backed by <strong>PostgreSQL</strong> relational state management and Supabase real-time websocket broadcasting.
          </div>
        </div>
      </div>

      <div style="display: flex; gap: 0.75rem; margin-top: 1.5rem; justify-content: flex-end;">
        <a href="https://github.com/binomariyan193-dotcom/Food-Processing-Operations-Platform-V2" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
          <span>View GitHub Code</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="7" y1="17" x2="17" y2="7"></line>
            <polyline points="7 7 17 7 17 17"></polyline>
          </svg>
        </a>
      </div>
    `
  },
  'hybrid-med': {
    title: 'Hybrid Ensemble Model: XGBoost & LSTM for Medication',
    content: `
      <p style="margin-bottom: 1.25rem; font-size: 1rem; color: #CBD5E1;">
        A clinical decision-support framework engineered to optimize personalized antihypertensive regimens through advanced patient cohort mining from Electronic Health Records (EHR).
      </p>

      <div class="arch-diagram">
        <div class="arch-node">
          <div class="arch-node-title">Temporal Sequence Modeling (LSTM)</div>
          <div class="arch-node-desc">
            Captures longitudinal blood pressure dynamics, diurnal variation trends, and historic regimen response patterns over continuous patient observation periods.
          </div>
        </div>

        <div class="arch-node">
          <div class="arch-node-title">Tabular Non-Linear Covariates (XGBoost)</div>
          <div class="arch-node-desc">
            Processes static clinical variables: patient demographics, laboratory blood chemistry panels, baseline renal function, and known drug-drug contraindications.
          </div>
        </div>

        <div class="arch-node">
          <div class="arch-node-title">Ensemble Decision & Risk Scoring</div>
          <div class="arch-node-desc">
            Fuses the hidden temporal state embeddings with gradient-boosted decision trees to recommend optimal antihypertensive regimens while minimizing adverse hypotensive or renal risks.
          </div>
        </div>
      </div>
    `
  },
  'ndt-imaging': {
    title: 'Infrared Thermography for Non-Destructive Testing (NDT)',
    content: `
      <p style="margin-bottom: 1.25rem; font-size: 1rem; color: #CBD5E1;">
        An embedded thermographic testing apparatus integrating a FLIR Lepton sensor and Raspberry Pi for automated subsurface flaw and delamination detection in aerospace specimens.
      </p>

      <div class="arch-diagram">
        <div class="arch-node">
          <div class="arch-node-title">Active Thermal Excitation</div>
          <div class="arch-node-desc">
            Applies pulsed thermal stimulation to the surface of aerospace carbon-composite specimens to induce heat diffusion across material layers.
          </div>
        </div>

        <div class="arch-node">
          <div class="arch-node-title">Radiometric Image Acquisition (FLIR Lepton)</div>
          <div class="arch-node-desc">
            Streams microbolometer thermal matrices to the Raspberry Pi over SPI/I2C at high frame rates, capturing transient thermal cooling curves.
          </div>
        </div>

        <div class="arch-node">
          <div class="arch-node-title">Digital Signal & Image Processing (Python / OpenCV)</div>
          <div class="arch-node-desc">
            Executes Fourier phase thermography algorithms and spatial contrast filtering to detect internal void anomalies, composite delamination, and subsurface structural degradation.
          </div>
        </div>
      </div>
    `
  }
};

function initModals() {
  // Project Modal
  const projectModal = document.getElementById('project-modal');
  const projectCloseBtn = document.getElementById('modal-close-btn');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  const triggers = document.querySelectorAll('.project-modal-trigger');

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const projectId = trigger.getAttribute('data-project');
      const data = projectDetailsData[projectId];
      if (data && projectModal && modalTitle && modalBody) {
        modalTitle.textContent = data.title;
        modalBody.innerHTML = data.content;
        projectModal.classList.add('active');
        projectModal.setAttribute('aria-hidden', 'false');
      }
    });
  });

  if (projectCloseBtn && projectModal) {
    projectCloseBtn.addEventListener('click', () => {
      projectModal.classList.remove('active');
      projectModal.setAttribute('aria-hidden', 'true');
    });

    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) {
        projectModal.classList.remove('active');
        projectModal.setAttribute('aria-hidden', 'true');
      }
    });
  }

  // Resume Modal
  const resumeModal = document.getElementById('resume-modal');
  const resumeBtn = document.getElementById('resume-btn');
  const resumeCloseBtn = document.getElementById('resume-close-btn');
  const printResumeBtn = document.getElementById('print-resume-btn');

  if (resumeBtn && resumeModal) {
    resumeBtn.addEventListener('click', () => {
      resumeModal.classList.add('active');
      resumeModal.setAttribute('aria-hidden', 'false');
    });
  }

  if (resumeCloseBtn && resumeModal) {
    resumeCloseBtn.addEventListener('click', () => {
      resumeModal.classList.remove('active');
      resumeModal.setAttribute('aria-hidden', 'true');
    });

    resumeModal.addEventListener('click', (e) => {
      if (e.target === resumeModal) {
        resumeModal.classList.remove('active');
        resumeModal.setAttribute('aria-hidden', 'true');
      }
    });
  }

  // Print / Save PDF Handler
  if (printResumeBtn) {
    printResumeBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // Escape Key to Close Any Active Modal
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (projectModal?.classList.contains('active')) {
        projectModal.classList.remove('active');
        projectModal.setAttribute('aria-hidden', 'true');
      }
      if (resumeModal?.classList.contains('active')) {
        resumeModal.classList.remove('active');
        resumeModal.setAttribute('aria-hidden', 'true');
      }
    }
  });
}

/* ===================================================================
   5. Clipboard Copy & Toast Notifications
   =================================================================== */
function showToast(message, icon = '✓') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span style="color: var(--accent-cyan); font-weight: bold;">${icon}</span> <span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(15px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3200);
}

function initClipboardAndContact() {
  const emailBtn = document.getElementById('copy-email-btn');
  const phoneBtn = document.getElementById('copy-phone-btn');
  const emailText = document.getElementById('email-text')?.innerText || 'binomariyan193@gmail.com';
  const phoneText = document.getElementById('phone-text')?.innerText || '+91 81429-11443';

  if (emailBtn) {
    emailBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(emailText).then(() => {
        showToast('Email copied to clipboard: ' + emailText);
      }).catch(() => {
        showToast('Email: ' + emailText);
      });
    });

    emailBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        emailBtn.click();
      }
    });
  }

  if (phoneBtn) {
    phoneBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(phoneText).then(() => {
        showToast('Phone number copied to clipboard: ' + phoneText);
      }).catch(() => {
        showToast('Phone: ' + phoneText);
      });
    });

    phoneBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        phoneBtn.click();
      }
    });
  }
}

/* ===================================================================
   6. Dynamic Copyright Year
   =================================================================== */
function initDynamicYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/* ===================================================================
   7. 3D Responsive Mouse Parallax Avatar Tilt Effect
   =================================================================== */
function init3DAvatarTilt() {
  const card = document.getElementById('avatar-3d-card');
  const glare = document.getElementById('avatar-glare');
  const img = document.getElementById('avatar-img');
  const scene = document.getElementById('avatar-3d-scene');

  if (!card) return;

  const badges = card.querySelectorAll('.floating-badge');
  let bounds;
  let isHovered = false;

  function updateBounds() {
    bounds = card.getBoundingClientRect();
  }

  window.addEventListener('resize', updateBounds);
  window.addEventListener('scroll', updateBounds);

  card.addEventListener('mouseenter', () => {
    isHovered = true;
    updateBounds();
    card.style.transition = 'transform 0.12s ease-out, box-shadow 0.25s ease';
    if (glare) glare.style.opacity = '1';
    if (img) img.style.transition = 'transform 0.12s ease-out';
    badges.forEach((b) => (b.style.transition = 'transform 0.12s ease-out'));
  });

  card.addEventListener('mousemove', (e) => {
    if (!bounds) updateBounds();

    const mouseX = e.clientX - bounds.left;
    const mouseY = e.clientY - bounds.top;

    const xPct = mouseX / bounds.width - 0.5; // -0.5 to 0.5
    const yPct = mouseY / bounds.top - 0.5;  // relative

    const centerX = bounds.width / 2;
    const centerY = bounds.height / 2;

    const deltaX = (mouseX - centerX) / centerX; // -1 to 1
    const deltaY = (mouseY - centerY) / centerY; // -1 to 1

    // Rotation angles (degrees)
    const rotateY = deltaX * 18; // Max 18 deg Y rotation
    const rotateX = -deltaY * 18; // Max 18 deg X rotation

    // Apply 3D matrix transformation to card
    card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.04, 1.04, 1.04)`;
    card.style.boxShadow = `${-rotateY * 1.8}px ${rotateX * 1.8 + 25}px 45px rgba(0, 0, 0, 0.7), 0 0 35px rgba(0, 242, 254, 0.3)`;

    // Dynamic Glare / Specular highlight following mouse
    if (glare) {
      const glareX = (mouseX / bounds.width) * 100;
      const glareY = (mouseY / bounds.height) * 100;
      glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.28) 0%, rgba(255, 255, 255, 0) 65%)`;
    }

    // Parallax depth shift on inner image
    if (img) {
      const imgShiftX = -deltaX * 12;
      const imgShiftY = -deltaY * 12;
      img.style.transform = `translate3d(${imgShiftX.toFixed(1)}px, ${imgShiftY.toFixed(1)}px, 35px)`;
    }

    // Multi-depth parallax shift on floating badges
    badges.forEach((badge, idx) => {
      const multiplier = (idx + 1) * 6;
      const badgeShiftX = deltaX * multiplier;
      const badgeShiftY = deltaY * multiplier;
      badge.style.transform = `translate3d(${badgeShiftX.toFixed(1)}px, ${badgeShiftY.toFixed(1)}px, 70px)`;
    });
  });

  card.addEventListener('mouseleave', () => {
    isHovered = false;
    card.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.6s ease';
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    card.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 25px rgba(0, 242, 254, 0.15)';

    if (glare) {
      glare.style.opacity = '0';
    }

    if (img) {
      img.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      img.style.transform = 'translate3d(0, 0, 0)';
    }

    badges.forEach((b) => {
      b.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      b.style.transform = 'translate3d(0, 0, 0)';
    });
  });
}

