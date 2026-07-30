/* ============================================
   PLANORA — Frontend JavaScript
   Data is fetched from the Express.js backend
   ============================================ */

// --- DOM Ready ---
document.addEventListener('DOMContentLoaded', () => {

  // --- Loader ---
  const loader = document.getElementById('loaderScreen');
  setTimeout(() => {
    loader.classList.add('hidden');
  }, 1800);

  // --- Mobile Menu ---
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileMenu   = document.getElementById('mobileMenu');

  mobileToggle.addEventListener('click', () => {
    mobileToggle.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  // Close mobile menu on link click
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileToggle.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // --- Places Section ---
  const masonry  = document.getElementById('placesMasonry');
  const moodBtns = document.querySelectorAll('.mood-btn');

  /**
   * Fetch places from the Express backend API.
   * @param {string} category - 'all' or a specific category slug
   */
  async function fetchPlaces(category = 'all') {
    try {
      // Show a subtle loading state
      masonry.style.opacity = '0.4';
      masonry.style.transition = 'opacity 0.3s ease';

      const url = category === 'all'
        ? '/api/places'
        : `/api/places?category=${encodeURIComponent(category)}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const data = await response.json();
      renderPlaces(data.places);

    } catch (err) {
      console.error('Failed to fetch places:', err);
      masonry.innerHTML = `
        <div style="grid-column:1/-1; padding:2rem; text-align:center; color:rgba(255,255,255,0.5);">
          ⚠️ Could not load places. Please refresh the page.
        </div>`;
    } finally {
      masonry.style.opacity = '1';
    }
  }

  /**
   * Render an array of place objects into the masonry grid.
   * @param {Array} places
   */
  function renderPlaces(places) {
    masonry.innerHTML = '';

    if (!places || places.length === 0) {
      masonry.innerHTML = `
        <div style="grid-column:1/-1; padding:2rem; text-align:center; color:rgba(255,255,255,0.5);">
          No places found for this category.
        </div>`;
      return;
    }

    places.forEach((place) => {
      const card = document.createElement('article');
      card.className = 'place-card';
      card.dataset.placeId = place.id;  // store id for modal lookup
      card.innerHTML = `
        <img src="${place.img}" alt="${place.name}" loading="lazy" />
        <div class="place-card-overlay">
          <div class="place-card-info">
            <strong class="place-card-name">${place.name}</strong>
            <small class="place-card-location">${place.location}</small>
          </div>
        </div>
        <div class="place-card-badge">Explore →</div>
      `;
      // Open detail modal on click
      card.addEventListener('click', () => openPlaceModal(place.id));
      masonry.appendChild(card);
    });
  }

  // Initial load — fetch all places from backend
  fetchPlaces('all');

  // Mood filter buttons — fetch filtered data from backend
  moodBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      moodBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      fetchPlaces(btn.dataset.filter);
    });
  });

  // --- Scroll Reveal ---
  const revealElements = document.querySelectorAll('.reveal-up');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // --- Hero Parallax ---
  const heroBg = document.querySelector('.hero-bg');
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        if (scrollY < window.innerHeight) {
          heroBg.style.transform = `translateY(${scrollY * 0.3}px)`;
        }
        ticking = false;
      });
      ticking = true;
    }
  });

  // --- Navbar background change on scroll ---
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.style.background = 'rgba(0, 0, 0, 0.85)';
    } else {
      navbar.style.background = 'rgba(0, 0, 0, 0.6)';
    }
  });

  // --- Newsletter Form → POST to backend ---
  const newsletterForm = document.getElementById('newsletterForm');
  newsletterForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = newsletterForm.querySelector('input');
    const email = input.value.trim();

    if (!email) return;

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (data.success) {
        input.value = '';
        showToast(data.message || 'Thanks for subscribing! 🎉');
      } else {
        showToast(data.message || 'Something went wrong. Try again.', true);
      }
    } catch (err) {
      console.error('Subscribe error:', err);
      showToast('Could not subscribe. Check your connection.', true);
    }
  });

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // --- FAQ accordion ---
  document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('toggle', function () {
      if (this.open) {
        document.querySelectorAll('.faq-item').forEach(other => {
          if (other !== this) other.removeAttribute('open');
        });
      }
    });
  });

  // --- Typing animation for AI chat ---
  animateAIChat();
});

// ── Place Detail Modal ────────────────────────────────────────────────────────
const backdrop   = document.getElementById('placeModalBackdrop');
const modalClose = document.getElementById('placeModalClose');

/**
 * Fetch place by id from the backend and open the modal.
 * @param {number} id
 */
async function openPlaceModal(id) {
  // Show backdrop with loading state
  backdrop.classList.add('open');
  document.body.style.overflow = 'hidden';

  const modalImg      = document.getElementById('modalImg');
  const modalCategory = document.getElementById('modalCategory');
  const modalName     = document.getElementById('modalPlaceName');
  const modalLocText  = document.getElementById('modalLocationText');
  const modalDesc     = document.getElementById('modalDescription');
  const modalBody     = document.querySelector('.place-modal-body');

  // Show spinner while loading
  modalImg.src = '';
  modalBody.innerHTML = '<div class="modal-loading">Loading…</div>';

  try {
    const res  = await fetch(`/api/places/${id}`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const place = await res.json();

    // Populate image
    modalImg.src = place.img;
    modalImg.alt = place.name;
    modalCategory.textContent = place.category;

    // Rebuild body content
    modalBody.innerHTML = `
      <h2 class="place-modal-name" id="modalPlaceName">${place.name}</h2>
      <p class="place-modal-location">
        <span class="modal-location-icon">📍</span>
        <span>${place.location}</span>
      </p>
      <p class="place-modal-description">${place.description}</p>
      <a href="#destinations" class="place-modal-cta">Plan This Trip →</a>
    `;

    // Close modal when CTA clicked
    modalBody.querySelector('.place-modal-cta').addEventListener('click', closePlaceModal);

  } catch (err) {
    console.error('Failed to load place details:', err);
    modalBody.innerHTML = `
      <p style="color:rgba(255,255,255,0.5);text-align:center;padding:2rem;">
        ⚠️ Could not load place details. Please try again.
      </p>`;
  }
}

/** Close and reset the modal. */
function closePlaceModal() {
  backdrop.classList.remove('open');
  document.body.style.overflow = '';
}

// Close on ✕ button
modalClose.addEventListener('click', closePlaceModal);

// Close when clicking the dark backdrop (outside the card)
backdrop.addEventListener('click', (e) => {
  if (e.target === backdrop) closePlaceModal();
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && backdrop.classList.contains('open')) closePlaceModal();
});

// ── Toast Notification ────────────────────────────────────────────────────────
/**
 * @param {string} message
 * @param {boolean} isError  - if true, renders a red error-style toast
 */
function showToast(message, isError = false) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%) translateY(20px);
    padding: 0.875rem 1.5rem;
    background: ${isError ? 'rgba(239,68,68,0.95)' : 'rgba(28, 201, 138, 0.95)'};
    color: ${isError ? '#fff' : '#06291d'};
    font-size: 0.875rem;
    font-weight: 600;
    border-radius: 9999px;
    z-index: 100;
    opacity: 0;
    transition: all 0.4s ease;
    box-shadow: 0 10px 30px ${isError ? 'rgba(239,68,68,0.4)' : 'rgba(28, 201, 138, 0.4)'};
  `;

  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

// ── AI Chat Typing Animation ─────────────────────────────────────────────────
function animateAIChat() {
  const chatBubbles = document.querySelectorAll('.chat-bubble');
  chatBubbles.forEach((bubble) => {
    bubble.style.opacity = '0';
    bubble.style.transform = 'translateY(10px)';
    bubble.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });

  const chatObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bubbles = entry.target.querySelectorAll('.chat-bubble');
        bubbles.forEach((bubble, index) => {
          setTimeout(() => {
            bubble.style.opacity = '1';
            bubble.style.transform = 'translateY(0)';
          }, index * 400);
        });
        chatObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  const aiChat = document.querySelector('.ai-chat');
  if (aiChat) chatObserver.observe(aiChat);
}
