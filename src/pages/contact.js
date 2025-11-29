export const Contact = {
  render: () => {
    return `
      <div class="page contact-page">
        <h2 class="section-title animate-on-scroll" style="margin-bottom: 40px;">Contact</h2>
        <!-- Flip Card Section -->
        <div class="contact-card-container">
          <div class="contact-card">
            
            <!-- Front Face -->
            <div class="card-face card-front">
              <!-- Shine Effect -->
              <div class="shine-effect"></div>

              <div class="contact-logo">
                <div class="logo-text">FOOTFALL</div>
                <div class="fingerprint-icon">
                  <img src="/fingerprint.png" alt="Fingerprint" class="fingerprint-img">
                </div>
              </div>
              
              <div class="quote">
                "Excellence in every square foot."
              </div>

              <div class="card-footer">
                <span>Hover or Click to Flip</span>
              </div>
            </div>

            <!-- Back Face -->
            <div class="card-face card-back">
              <div class="contact-details">
                <h3>Get in Touch</h3>
                <div class="contact-item">
                  <!-- Envelope SVG -->
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 10px; color: var(--color-accent);">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  info@footfall.com
                </div>
                <div class="contact-item">
                  <!-- Phone SVG -->
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 10px; color: var(--color-accent);">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  +1 (555) 123-4567
                </div>
                <div class="contact-item">
                  <!-- Map Pin SVG -->
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 10px; color: var(--color-accent);">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  123 Innovation Dr,<br>Tech City, TC 90210
                </div>
                
                <div class="social-icons">
                  <!-- LinkedIn SVG -->
                  <a href="#" class="social-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect x="2" y="9" width="4" height="12"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                  </a>
                  <!-- Instagram SVG -->
                  <a href="#" class="social-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                  </a>
                  <!-- Twitter/X SVG -->
                  <a href="#" class="social-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- Bottom Form Trigger -->
        <div class="form-trigger-section">
          <p style="margin-bottom: 20px; color: #888; letter-spacing: 1px;">Ready to transform your space?</p>
          <button id="openFormBtn" class="btn-fill-form">Fill Form</button>
        </div>

        <!-- Modal Form -->
        <div id="contactModal" class="form-modal">
          <div class="form-content">
            <button id="closeFormBtn" class="close-modal">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <h2 style="color: var(--color-accent); margin-bottom: 30px; font-family: var(--font-heading); text-align: center;">Contact Us</h2>
            <form class="contact-form">
              <div class="form-group">
                <label for="name">Name</label>
                <input type="text" id="name" name="name" required>
              </div>
              <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" required>
              </div>
              <div class="form-group">
                <label for="message">Message</label>
                <textarea id="message" name="message" rows="4" required></textarea>
              </div>
              <button type="submit" class="btn-submit">Send Message</button>
            </form>
          </div>
        </div>

      </div>
    `;
  },

  afterRender: () => {
    const card = document.querySelector('.contact-card');
    const modal = document.getElementById('contactModal');
    const openBtn = document.getElementById('openFormBtn');
    const closeBtn = document.getElementById('closeFormBtn');
    const form = document.querySelector('.contact-form');

    // Flip Logic
    if (card) {
      card.addEventListener('click', () => {
        card.classList.toggle('flipped');
      });
    }

    if (openBtn && modal) {
      openBtn.addEventListener('click', () => {
        modal.classList.add('active');
      });
    }

    if (closeBtn && modal) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        modal.classList.remove('active');
      });
    }

    // Close on outside click
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
        }
      });
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        // Here you would typically handle the form submission
        alert('Thank you for your message! We will get back to you soon.');
        modal.classList.remove('active');
        form.reset();
      });
    }

    // Scroll Animation Observer
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach((el) => observer.observe(el));
  }
};
