
// --- Place Data ---
const places = [
  {
    name: "Living Root Bridge, Cherrapunji",
    location: "Cherrapunji, Meghalaya",
    img: "images/living_root_bridge.jpg",
    category: "trekking",
    height: "tall"
  },
  {
    name: "Café Shillong",
    location: "Police Bazaar, Shillong",
    img: "images/cafe_shillong.jpg",
    category: "food",
    height: "short"
  },
  {
    name: "Ri Kynjai Resort",
    location: "Umiam Lake, Meghalaya",
    img: "images/ri_kynjai_resort.jpg",
    category: "accommodation",
    height: "medium"
  },
  {
    name: "Dzükou Valley Trek",
    location: "Kohima, Nagaland",
    img: "images/dzukou_valley.jpg",
    category: "trekking",
    height: "short"
  },
  {
    name: "Dawki River & Umngot",
    location: "Dawki, Meghalaya",
    img: "images/dawki_river.jpg",
    category: "nature",
    height: "tall"
  },
  {
    name: "Nagaland Kitchen",
    location: "Dimapur, Nagaland",
    img: "images/nagaland_kitchen.jpg",
    category: "food",
    height: "medium"
  },
  {
    name: "Laitlum Canyon Trek",
    location: "Shillong, Meghalaya",
    img: "images/laitlum_canyon.jpg",
    category: "trekking",
    height: "short"
  },
  {
    name: "Cherrapunji Holiday Resort",
    location: "Cherrapunji, Meghalaya",
    img: "images/cherrapunji_resort.jpg",
    category: "accommodation",
    height: "tall"
  },
  {
    name: "Dylan's Café",
    location: "Laitumkhrah, Shillong",
    img: "images/dylans_cafe.jpg",
    category: "food",
    height: "medium"
  },
  {
    name: "Kaziranga National Park",
    location: "Golaghat, Assam",
    img: "images/kaziranga.png",
    category: "nature",
    height: "medium"
  },
  {
    name: "Hornbill Festival Grounds",
    location: "Kisama, Nagaland",
    img: "images/hornbill_festival.jpg",
    category: "entertainment",
    height: "tall"
  },
  {
    name: "Jade Bistro",
    location: "Police Bazaar, Shillong",
    img: "images/jade_bistro.jpg",
    category: "food",
    height: "short"
  }
];

// --- DOM Ready ---
document.addEventListener('DOMContentLoaded', () => {

  // --- Loader ---
  const loader = document.getElementById('loaderScreen');
  setTimeout(() => {
    loader.classList.add('hidden');
  }, 1800);

  // --- Mobile Menu ---
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileMenu = document.getElementById('mobileMenu');

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

  // --- Render Places ---
  const masonry = document.getElementById('placesMasonry');
  const moodBtns = document.querySelectorAll('.mood-btn');

  function renderPlaces(filter = 'all') {
    const filtered = filter === 'all' ? places : places.filter(p => p.category === filter);
    masonry.innerHTML = '';

    filtered.forEach((place) => {
      const card = document.createElement('article');
      card.className = 'place-card';
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
      masonry.appendChild(card);
    });
  }

  renderPlaces();

  // Mood filter click
  moodBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      moodBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderPlaces(btn.dataset.filter);
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

  // --- Newsletter Form ---
  const newsletterForm = document.getElementById('newsletterForm');
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = newsletterForm.querySelector('input');
    const email = input.value.trim();
    if (email) {
      input.value = '';
      // Create toast notification
      showToast('Thanks for subscribing! 🎉');
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

  // --- FAQ animation ---
  document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('toggle', function () {
      // Close other FAQs
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

// --- Toast Notification ---
function showToast(message) {
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
    background: rgba(28, 201, 138, 0.95);
    color: #06291d;
    font-size: 0.875rem;
    font-weight: 600;
    border-radius: 9999px;
    z-index: 100;
    opacity: 0;
    transition: all 0.4s ease;
    box-shadow: 0 10px 30px rgba(28, 201, 138, 0.4);
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
  }, 3000);
}

// --- AI Chat Typing Animation ---
function animateAIChat() {
  const chatBubbles = document.querySelectorAll('.chat-bubble');
  chatBubbles.forEach((bubble, index) => {
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
