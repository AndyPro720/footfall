import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { geoData } from '../data/geoData.js';

export const Home = {
  render: () => {
    return `
      <div class="page home-page">
        <!-- Loading Screen -->





        <!-- About Section (Founder Profile) -->
        <section id="about" class="section-dark about-section">
          <div class="container">
            <div class="about-content-wrapper animate-on-scroll">
              
              <!-- Left Column: Image -->
              <div class="about-image-column">
                <div class="founder-image-wrapper">
                  <img src="/founder-portrait.png" alt="Rahul Ahuja" class="founder-image">
                </div>
              </div>


              <!-- Right Column: Text -->
              <div class="about-text-column">
                <span class="founder-label">Founder & Managing Partner</span>
                <h2 class="founder-heading" style="position: relative; display: inline-block;">
                  Strategic Vision.<br>Precision Execution.
                  <svg class="scribble-underline" viewBox="0 0 500 150" preserveAspectRatio="none">
                    <path d="M5,125 Q30,155 60,125 T120,125 T180,125 T250,125 T490,125" fill="none" stroke="#D4AF37" stroke-width="8" stroke-linecap="round" />
                  </svg>
                </h2>
                <div class="founder-bio">
                  <p><strong style="color: #fff;">Rahul Ahuja</strong> believes that real estate is the physical language of economics. With over 15 years in high-volume acquisitions, he steers the firm's macro-strategy, identifying undervalued corridors before they hit the institutional radar.</p>
                </div>
              </div>

            </div>
          </div>
        </section>





        <!-- Clients Section (Animated) -->
        <section id="clients" class="section-dark">
          <div class="container animate-on-scroll">
            <h2 class="section-title">Trusted By Global Brands</h2>
            <div class="marquee-container">
              <div class="marquee-content">
                <!-- Card 1: Absolute Barbeque -->
                <div class="testimonial-card glass-card spotlight-card">
                  <div class="quote-icon">"</div>
                  <p>"Foottfall helped us identify prime locations for our new outlets. The footfall data was spot on."</p>
                  <div class="client-info">
                    <div class="client-avatar" style="background-image: url('https://ui-avatars.com/api/?name=AB&background=random'); background-size: cover;"></div>
                    <div>
                      <h4>Absolute Barbeque</h4>
                      <span>Expansion Team</span>
                    </div>
                  </div>
                </div>
                <!-- Card 2: Nando's -->
                <div class="testimonial-card glass-card spotlight-card">
                  <div class="quote-icon">"</div>
                  <p>"A strategic partner that understands the F&B landscape. We optimized our site selection process significantly."</p>
                  <div class="client-info">
                    <div class="client-avatar" style="background-image: url('https://ui-avatars.com/api/?name=Nandos&background=random'); background-size: cover;"></div>
                    <div>
                      <h4>Nando's</h4>
                      <span>Regional Manager</span>
                    </div>
                  </div>
                </div>
                <!-- Card 3: Tim Hortons -->
                <div class="testimonial-card glass-card spotlight-card">
                  <div class="quote-icon">"</div>
                  <p>"Their trade area intelligence gave us the confidence to enter new markets aggressively."</p>
                  <div class="client-info">
                    <div class="client-avatar" style="background-image: url('https://ui-avatars.com/api/?name=Tim+Hortons&background=random'); background-size: cover;"></div>
                    <div>
                      <h4>Tim Hortons</h4>
                      <span>Development Head</span>
                    </div>
                  </div>
                </div>
                <!-- Card 4: Chipotle -->
                <div class="testimonial-card glass-card spotlight-card">
                  <div class="quote-icon">"</div>
                  <p>"Data-driven decisions are key for us. Foottfall delivered exactly what we needed."</p>
                  <div class="client-info">
                    <div class="client-avatar" style="background-image: url('https://ui-avatars.com/api/?name=Chipotle&background=random'); background-size: cover;"></div>
                    <div>
                      <h4>Chipotle</h4>
                      <span>Real Estate Director</span>
                    </div>
                  </div>
                </div>
                <!-- Card 5: Zara -->
                <div class="testimonial-card glass-card spotlight-card">
                  <div class="quote-icon">"</div>
                  <p>"The data insights provided were game-changing for our expansion strategy in the region."</p>
                  <div class="client-info">
                    <div class="client-avatar" style="background-image: url('https://ui-avatars.com/api/?name=Zara&background=random'); background-size: cover;"></div>
                    <div>
                      <h4>Zara</h4>
                      <span>Retail Director</span>
                    </div>
                  </div>
                </div>
                 <!-- Duplicate for smooth loop -->
                <div class="testimonial-card glass-card spotlight-card">
                  <div class="quote-icon">"</div>
                  <p>"Foottfall helped us identify prime locations for our new outlets. The footfall data was spot on."</p>
                  <div class="client-info">
                    <div class="client-avatar" style="background-image: url('https://ui-avatars.com/api/?name=AB&background=random'); background-size: cover;"></div>
                    <div>
                      <h4>Absolute Barbeque</h4>
                      <span>Expansion Team</span>
                    </div>
                  </div>
                </div>
                <div class="testimonial-card glass-card spotlight-card">
                  <div class="quote-icon">"</div>
                  <p>"A strategic partner that understands the F&B landscape. We optimized our site selection process significantly."</p>
                  <div class="client-info">
                    <div class="client-avatar" style="background-image: url('https://ui-avatars.com/api/?name=Nandos&background=random'); background-size: cover;"></div>
                    <div>
                      <h4>Nando's</h4>
                      <span>Regional Manager</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Partners / Logos Grid -->
            <div class="partners-container" style="margin-top: 80px; text-align: center;">
              <h3 class="section-title" style="font-size: 1.5rem; opacity: 0.9; margin-bottom: 40px;">Our Network</h3>
              <div class="logo-grid">
                <div class="logo-item" data-text="ZARA">ZARA</div>
                <div class="logo-item" data-text="H&M">H&M</div>
                <div class="logo-item" data-text="Starbucks">Starbucks</div>
                <div class="logo-item" data-text="Chipotle">Chipotle</div>
                <div class="logo-item" data-text="AB's">AB's</div>
              </div>
            </div>
          </div>
        </section>

        <!-- Contact Section -->
        <section id="contact" class="contact-page">
          <h2 class="section-title animate-on-scroll" style="margin-bottom: 40px;">Contact</h2>
          <!-- Flip Card Section -->
          <div class="contact-card-container">
            <div class="contact-card">
              
              <!-- Front Face -->
              <div class="card-face card-front">
                <!-- Shine Effect (Inside front face to clip correctly) -->
                <div class="shine-effect"></div>

                <div class="contact-logo">
                  <div class="logo-text">FOOTTFALL</div>
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
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 10px; color: var(--color-accent);">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    info@foottfall.com
                  </div>
                  <div class="contact-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 10px; color: var(--color-accent);">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                    +1 (555) 123-4567
                  </div>
                  <div class="contact-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 10px; color: var(--color-accent);">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    123 Innovation Dr,<br>Tech City, TC 90210
                  </div>
                  
                  <div class="social-icons">
                    <a href="#" class="social-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                        <rect x="2" y="9" width="4" height="12"></rect>
                        <circle cx="4" cy="4" r="2"></circle>
                      </svg>
                    </a>
                    <a href="#" class="social-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                      </svg>
                    </a>
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
            <button id="openFormBtn" class="btn-fill-form">Get in touch</button>
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
                  <label for="phone">Mobile Number (Optional)</label>
                  <input type="tel" id="phone" name="phone" placeholder="Add country code if applicable">
                </div>
                <div class="form-group">
                  <label for="message">Message (Optional)</label>
                  <textarea id="message" name="message" rows="4"></textarea>
                </div>
                <button type="submit" class="btn-submit">Send Message</button>
              </form>
            </div>
          </div>
        </section>
      </div>
    `;
  },
  afterRender: () => {
    // --- EXISTING LANDING PAGE FUNCTIONALITY ---
    // Contact Page Logic (Flip & Modal)

    // --- EXISTING LANDING PAGE FUNCTIONALITY ---
    // Contact Page Logic (Flip & Modal)
    const card = document.querySelector('.contact-card');
    const modal = document.getElementById('contactModal');
    const openBtn = document.getElementById('openFormBtn');
    const closeBtn = document.getElementById('closeFormBtn');
    const form = document.querySelector('.contact-form');

    if (card) {
      card.addEventListener('click', () => card.classList.toggle('flipped'));
    }

    if (openBtn && modal) {
      openBtn.addEventListener('click', () => modal.classList.add('active'));
    }

    if (closeBtn && modal) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        modal.classList.remove('active');
      });
    }

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
      });
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('.btn-submit');
        const originalText = submitBtn.innerText;
        submitBtn.innerText = 'Sending...';
        submitBtn.disabled = true;

        const formData = new FormData(form);
        
        fetch("https://formsubmit.co/ajax/info@foottfall.com", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            alert('Thank you! Your message has been sent successfully.');
            modal.classList.remove('active');
            form.reset();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Something went wrong. Please try again.');
        })
        .finally(() => {
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
        });
      });
    }

    // About Section Animation
    const aboutSection = document.querySelector('.about-section');
    const aboutContent = document.querySelector('.about-content-wrapper');
    const founderImageWrapper = document.querySelector('.founder-image-wrapper');
    
    if (aboutSection && aboutContent) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            aboutContent.classList.add('is-visible');
            if (founderImageWrapper && !founderImageWrapper.classList.contains('revealed')) {
               setTimeout(() => founderImageWrapper.classList.add('revealed'), 2000);
            }
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2 });
      
      observer.observe(aboutSection);
    }



    // Hash Scroll Handling
    if (window.location.hash) {
      setTimeout(() => {
        const targetId = window.location.hash.substring(1);
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500); // Slight delay for rendering
    }
  }
};
