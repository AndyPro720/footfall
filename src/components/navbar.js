export const Navbar = {
  render: () => {
    return `
      <nav class="navbar">
        <div class="logo">
          <a href="/" data-link>
            <img src="/logo.png" alt="FOOTTFALL" style="height: 40px; width: auto;">
          </a>
        </div>
        
        <div class="nav-right">
          <div class="lang-container">
            <div class="lang-toggle glass-card-sm" id="langToggle">
              <span id="currentLang">EN</span>
              <span class="arrow-down">▼</span>
            </div>
            <div class="lang-dropdown" id="langDropdown">
              <div class="lang-option selected" data-lang="EN">English</div>
              <div class="lang-option" data-lang="AR">العربية</div>
            </div>
          </div>

          <button class="menu-toggle" id="menuToggle">
            <span class="bar"></span>
            <span class="bar"></span>
          </button>
        </div>
      </nav>

      <div class="menu-overlay" id="menuOverlay">
        <div class="menu-content">
          <a href="#home" class="menu-item" data-scroll>Home</a>
          <a href="#about" class="menu-item" data-scroll>About</a>
          <a href="#clients" class="menu-item" data-scroll>Testimonials</a>
          <a href="#contact" class="menu-item" data-scroll>Contact</a>
        </div>
      </div>
    `;
  },
  afterRender: () => {
    const toggle = document.getElementById('menuToggle');
    const overlay = document.getElementById('menuOverlay');
    const links = document.querySelectorAll('.menu-item');
    const scrollLinks = document.querySelectorAll('[data-scroll]');
    
    // Language Switcher Logic
    const langToggle = document.getElementById('langToggle');
    const langDropdown = document.getElementById('langDropdown');
    const currentLang = document.getElementById('currentLang');
    const langOptions = document.querySelectorAll('.lang-option');

    if (langToggle && langDropdown) {
      langToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        langToggle.classList.toggle('active');
        langDropdown.classList.toggle('active');
      });

      document.addEventListener('click', (e) => {
        if (!langToggle.contains(e.target) && !langDropdown.contains(e.target)) {
          langToggle.classList.remove('active');
          langDropdown.classList.remove('active');
        }
      });

      langOptions.forEach(option => {
        option.addEventListener('click', () => {
          langOptions.forEach(opt => opt.classList.remove('selected'));
          option.classList.add('selected');
          
          const lang = option.getAttribute('data-lang');
          currentLang.textContent = lang;
          
          langToggle.classList.remove('active');
          langDropdown.classList.remove('active');
        });
      });
    }

    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      overlay.classList.toggle('active');
    });

    links.forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('active');
        overlay.classList.remove('active');
      });
    });

    // Smooth Scroll Logic
    scrollLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        
        // Dispatch event for Page Component to handle
        // This is cleaner for SPA where "Home" or "About" might need state changes (returnToLanding)
        window.dispatchEvent(new CustomEvent('nav-to-section', { 
            detail: { targetId } 
        }));
        
        // Close menu
        toggle.classList.remove('active');
        overlay.classList.remove('active');
      });
    });

    // Logo Scroll Visibility Logic
    const logo = document.querySelector('.logo');
    const app = document.getElementById('app');

    if (logo && app) {
      app.addEventListener('scroll', () => {
        if (app.scrollTop > 100) {
          logo.classList.add('visible');
        } else {
          logo.classList.remove('visible');
        }
      });
    }
  }
};
