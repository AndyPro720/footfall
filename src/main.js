import { registerSW } from 'virtual:pwa-register';
// Self-hosted fonts via Fontsource
import '@fontsource/outfit/400.css';
import '@fontsource/outfit/500.css';
import '@fontsource/outfit/600.css';
import '@fontsource/outfit/700.css';
import '@fontsource/outfit/800.css';
import '@fontsource/outfit/900.css';
import '@fontsource/cinzel/400.css';
import '@fontsource/cinzel/700.css';
import './styles/global.css';
import './styles/components.css';
import './styles/contact.css';
import './styles/services.css';
import './styles/intelligence.css';
import './styles/loader.css'; // Loader styles
import './style.css'; 
import { Router } from './router.js';
import { Navbar } from './components/navbar.js';
import { Loader } from './components/loader.js'; // Import Loader
import { Home } from './pages/home.js';

import { Intelligence } from './pages/intelligence.js';
import { Contact } from './pages/contact.js';

// Global Loader Instance
window.appLoader = new Loader();

// DO NOT call init() here - moved inside DOMContentLoaded for route-aware control

const routes = {
  '/': Intelligence, 
  '/intelligence': Intelligence,
  '/contact': Contact,
  '/info': Home
};

document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  
  // Render Navbar
  document.body.insertAdjacentHTML('afterbegin', Navbar.render());
  Navbar.afterRender();

  // --- LOADER LOGIC: Route-Aware ---
  // For Landing Pages (/  or /intelligence): Run and show the loader animation.
  // The loader is hidden by Intelligence.js after all resources are ready via map.idle event.
  // For other pages (e.g., /info): Hide immediately without even starting the animation.
  const currentPath = window.location.pathname;
  const isLandingPage = currentPath === '/' || currentPath === '/intelligence';

  if (isLandingPage) {
    // Landing page: Start the loader animation
    window.appLoader.init();
  } else {
    // Non-landing page: Hide loader immediately (never show animation)
    window.appLoader.hide();
  }
  // For landing page, loader hiding is managed by Intelligence.js after map.once('idle')


  // Add Scroll Progress Bar
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.appendChild(progressBar);

  // Listen to #app scroll instead of window
  app.addEventListener('scroll', () => {
    const scrollTop = app.scrollTop;
    const docHeight = app.scrollHeight - app.clientHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.height = `${scrollPercent}%`;

    // Navbar background logic removed to keep it transparent
  });

  // Mouse Spotlight Logic (Optimized)
  let cards = [];
  
  // Update cards list periodically or on mutation (simple approach: update on mousemove with throttle or just cache it)
  // Better: Update it once on load and maybe expose a way to update it.
  // For now, let's just query it inside but use requestAnimationFrame to not block main thread
  
  let mouseX = 0;
  let mouseY = 0;
  let isMouseMoveScheduled = false;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!isMouseMoveScheduled) {
      requestAnimationFrame(() => {
        // Querying here is still expensive if many elements, but better than every pixel
        // Ideally we cache 'cards'
        const currentCards = document.querySelectorAll('.glass-card, .glass-card-sm, .service-card, .testimonial-card, .btn-frosted, .stat-item, .logo-item');
        
        currentCards.forEach(card => {
          const rect = card.getBoundingClientRect();
          const x = mouseX - rect.left;
          const y = mouseY - rect.top;
          
          card.style.setProperty('--mouse-x', `${x}px`);
          card.style.setProperty('--mouse-y', `${y}px`);
          
          if (!card.classList.contains('spotlight-card')) {
            card.classList.add('spotlight-card');
          }
        });
        isMouseMoveScheduled = false;
      });
      isMouseMoveScheduled = true;
    }
  });

  // Initialize Router
  console.log('Initializing Router...');
  new Router(routes);

  // Scroll Animation Observer
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      } else {
        entry.target.classList.remove('is-visible');
      }
    });
  }, observerOptions);

  // Observe elements after route change (simple mutation observer or re-run)
  // For now, we'll attach it to the router or run it periodically
  // Since we have a simple router, let's export a helper or just run it on mutation of #app
  
  const mutationObserver = new MutationObserver(() => {
    const hiddenElements = document.querySelectorAll('.animate-on-scroll');
    hiddenElements.forEach((el) => observer.observe(el));
  });

  mutationObserver.observe(app, { childList: true, subtree: true });

  // Register PWA Service Worker
  registerSW({ immediate: true });
});
