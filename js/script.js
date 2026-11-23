/**
 * CREATION BUILDERS SDN BHD – INTERACTIVE JAVASCRIPT
 * Pure Vanilla JavaScript (ES6+)
 * 
 * Capabilities:
 * 1. Mobile Navigation & Drawer Toggle
 * 2. Sticky Header with Scroll State Detection
 * 3. Active Nav Link Highlighting
 * 4. Project Category Filtering
 * 5. Full-Screen Image Lightbox with Prev/Next Navigation
 * 6. Scroll Triggered In-View Animations (Intersection Observer)
 * 7. Contact Form Validation & Submission Feedback
 * 8. Back-to-Top Button with Smooth Scroll
 * 9. Reusable Accordion Toggle
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileNav();
  setActiveNavLink();
  initScrollAnimations();
  initProjectGallery();
  initLightbox();
  initContactForm();
  initBackToTop();
  initAccordion();
});

/* ==========================================================================
   1. STICKY HEADER
   ========================================================================== */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Trigger on init
}

/* ==========================================================================
   2. MOBILE NAVIGATION
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-menu .nav-link');

  if (!toggleBtn || !navMenu) return;

  const toggleMenu = () => {
    const isOpen = toggleBtn.classList.toggle('open');
    navMenu.classList.toggle('active', isOpen);
    document.body.classList.toggle('nav-locked', isOpen);
    toggleBtn.setAttribute('aria-expanded', isOpen);
  };

  toggleBtn.addEventListener('click', toggleMenu);

  // Close when clicking nav links on mobile
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) {
        toggleMenu();
      }
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && !toggleBtn.contains(e.target)) {
      toggleMenu();
    }
  });
}

/* ==========================================================================
   3. ACTIVE NAV LINK HIGHLIGHTING
   ========================================================================== */
function setActiveNavLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* ==========================================================================
   4. SCROLL ANIMATIONS (INTERSECTION OBSERVER)
   ========================================================================== */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.fade-up, .fade-left, .fade-right');
  if (!animatedElements.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.15
    });

    animatedElements.forEach(el => observer.observe(el));
  } else {
    // Fallback for older browsers
    animatedElements.forEach(el => el.classList.add('in-view'));
  }
}

/* ==========================================================================
   5. PROJECT CATEGORY FILTERING
   ========================================================================== */
function initProjectGallery() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (!filterBtns.length || !galleryItems.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const itemCategories = item.getAttribute('data-category') || '';
        const match = filterValue === 'all' || itemCategories.toLowerCase().includes(filterValue.toLowerCase());

        if (match) {
          item.classList.remove('hidden');
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => {
            item.classList.add('hidden');
          }, 300);
        }
      });
    });
  });
}

/* ==========================================================================
   6. FULLSCREEN IMAGE LIGHTBOX
   ========================================================================== */
let activeLightboxIndex = 0;
let currentGalleryItems = [];

function initLightbox() {
  const lightbox = document.getElementById('lightboxModal');
  if (!lightbox) return;

  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const lightboxTitle = lightbox.querySelector('.lightbox-title');
  const lightboxDesc = lightbox.querySelector('.lightbox-desc');
  const lightboxCounter = lightbox.querySelector('.lightbox-counter');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');

  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));

  const openLightbox = (index) => {
    // Collect visible items in current filter
    currentGalleryItems = galleryItems.filter(item => !item.classList.contains('hidden'));
    activeLightboxIndex = currentGalleryItems.indexOf(galleryItems[index]);
    if (activeLightboxIndex === -1) activeLightboxIndex = 0;

    updateLightboxContent();
    lightbox.classList.add('active');
    document.body.classList.add('nav-locked');
  };

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.classList.remove('nav-locked');
  };

  const updateLightboxContent = () => {
    if (!currentGalleryItems.length) return;
    const item = currentGalleryItems[activeLightboxIndex];
    const img = item.querySelector('img');
    const title = item.querySelector('.gallery-title')?.textContent || 'Project Showcase';
    const desc = item.querySelector('.gallery-caption')?.textContent || '';

    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt || title;
    if (lightboxTitle) lightboxTitle.textContent = title;
    if (lightboxDesc) lightboxDesc.textContent = desc;
    if (lightboxCounter) {
      lightboxCounter.textContent = `${activeLightboxIndex + 1} / ${currentGalleryItems.length}`;
    }
  };

  const showNext = () => {
    activeLightboxIndex = (activeLightboxIndex + 1) % currentGalleryItems.length;
    updateLightboxContent();
  };

  const showPrev = () => {
    activeLightboxIndex = (activeLightboxIndex - 1 + currentGalleryItems.length) % currentGalleryItems.length;
    updateLightboxContent();
  };

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (nextBtn) nextBtn.addEventListener('click', showNext);
  if (prevBtn) prevBtn.addEventListener('click', showPrev);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });
}

/* ==========================================================================
   7. CONTACT FORM VALIDATION & SUBMISSION FEEDBACK
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('projectInquiryForm');
  if (!form) return;

  const formStatus = document.getElementById('formStatus');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;
    const fullName = form.querySelector('[name="fullName"]');
    const phone = form.querySelector('[name="phone"]');
    const email = form.querySelector('[name="email"]');
    const projectType = form.querySelector('[name="projectType"]');
    const message = form.querySelector('[name="message"]');

    // Helper for input validation
    const validateField = (field, condition) => {
      const parent = field.closest('.form-group');
      if (!condition) {
        field.classList.add('error');
        if (parent) parent.classList.add('has-error');
        isValid = false;
      } else {
        field.classList.remove('error');
        if (parent) parent.classList.remove('has-error');
      }
    };

    // Full Name
    validateField(fullName, fullName && fullName.value.trim().length >= 2);

    // Phone (minimum 8 digits, supports Malaysian formats)
    const phoneRegex = /^[\d\s\+\-\(\)]{8,20}$/;
    validateField(phone, phone && phoneRegex.test(phone.value.trim()));

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    validateField(email, email && emailRegex.test(email.value.trim()));

    // Project Type
    validateField(projectType, projectType && projectType.value !== '');

    // Description/Message
    validateField(message, message && message.value.trim().length >= 10);

    if (!isValid) {
      if (formStatus) {
        formStatus.className = 'form-status error';
        formStatus.textContent = 'Please fill out all required fields with valid information before submitting.';
      }
      return;
    }

    // Submit Action (Ready for backend / Formspree / endpoint integration)
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Transmitting Brief...</span>';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      form.reset();

      if (formStatus) {
        formStatus.className = 'form-status success';
        formStatus.innerHTML = `<strong>Thank you!</strong> Your consultation inquiry has been received. Our team at Creation Builders will review your space requirements and reach out within 1 business day. For immediate assistance, feel free to call us at <a href="tel:+60129983535" style="text-decoration:underline;">+60 12-998 3535</a>.`;
      }
    }, 1200);
  });

  // Real-time error removal
  form.querySelectorAll('.form-control').forEach(input => {
    input.addEventListener('input', () => {
      input.classList.remove('error');
      const parent = input.closest('.form-group');
      if (parent) parent.classList.remove('has-error');
      if (formStatus) formStatus.className = 'form-status';
    });
  });
}

/* ==========================================================================
   8. BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   9. REUSABLE ACCORDION (FAQ & SERVICE MODULES)
   ========================================================================== */
function initAccordion() {
  const accordions = document.querySelectorAll('.accordion-header');
  accordions.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.accordion-item');
      const body = item?.querySelector('.accordion-body');
      const isOpen = item.classList.contains('active');

      // Close siblings if in same container
      const container = item.closest('.accordion-container');
      if (container) {
        container.querySelectorAll('.accordion-item').forEach(sibling => {
          sibling.classList.remove('active');
          const sibBody = sibling.querySelector('.accordion-body');
          if (sibBody) sibBody.style.maxHeight = null;
        });
      }

      if (!isOpen) {
        item.classList.add('active');
        if (body) body.style.maxHeight = body.scrollHeight + 'px';
      } else {
        item.classList.remove('active');
        if (body) body.style.maxHeight = null;
      }
    });
  });
}
