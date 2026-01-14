/**
 * Slide Modal Controller
 * Reusable multi-slide modal component with progress indicator
 */

import { UserProfileService } from '../utils/userProfileService.js';

export class SlideModal {
  constructor(options = {}) {
    this.slides = options.slides || [];
    this.onComplete = options.onComplete || (() => {});
    this.onClose = options.onClose || (() => {});
    this.onSlideChange = options.onSlideChange || (() => {}); // New callback
    this.title = options.title || 'Complete Your Profile';
    this.currentSlide = 0;
    this.formData = {};
    this.modal = null;
    this.skipConditions = options.skipConditions || {};
  }

  /**
   * Create and show the modal
   */
  show() {
    this.prefillFromProfile();
    this.render();
    document.body.appendChild(this.modal);
    
    // Animate in
    requestAnimationFrame(() => {
      this.modal.classList.add('visible');
    });
  }

  /**
   * Prefill form data from user profile
   */
  prefillFromProfile() {
    const profile = UserProfileService.get();
    this.formData = { ...profile };
  }

  /**
   * Render the modal
   */
  render() {
    this.modal = document.createElement('div');
    this.modal.className = 'slide-modal-overlay';
    this.modal.innerHTML = this.getModalHTML();
    
    this.attachEventListeners();
  }

  /**
   * Get the modal HTML structure
   */
  getModalHTML() {
    const slide = this.slides[this.currentSlide];
    const totalSlides = this.slides.length;
    const progress = ((this.currentSlide + 1) / totalSlides) * 100;

    return `
      <div class="slide-modal">
        <!-- Header -->
        <div class="slide-modal-header">
          <h2 class="slide-modal-title">${this.title}</h2>
          <button class="slide-modal-close" aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <!-- Progress -->
        <div class="slide-modal-progress">
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${progress}%"></div>
          </div>
          <span class="progress-text">Step ${this.currentSlide + 1} of ${totalSlides}</span>
        </div>

        <!-- Slide Content -->
        <div class="slide-modal-content">
          <div class="slide-section-title">${slide.section || ''}</div>
          <div class="slide-fields">
            ${this.renderFields(slide.fields)}
          </div>
        </div>

        <!-- Footer -->
        <div class="slide-modal-footer">
          ${this.currentSlide > 0 ? `
            <button class="slide-btn slide-btn-back">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
              Back
            </button>
          ` : '<div></div>'}
          
          ${this.currentSlide < totalSlides - 1 ? `
            <button class="slide-btn slide-btn-next">
              ${slide.optional ? 'Skip' : 'Next'}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          ` : `
            <button class="slide-btn slide-btn-submit">
              Submit
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </button>
          `}
        </div>
      </div>
    `;
  }

  /**
   * Render fields for current slide
   */
  renderFields(fields) {
    if (!fields || fields.length === 0) return '';

    return fields.map(field => {
      const value = this.formData[field.name] || field.default || '';
      const required = field.required ? 'required' : '';
      const requiredStar = field.required ? '<span class="required-star">*</span>' : '';

      switch (field.type) {
        case 'text':
        case 'email':
        case 'tel':
          return `
            <div class="field-group">
              <label for="${field.name}">${field.label}${requiredStar}</label>
              <input 
                type="${field.type}" 
                id="${field.name}" 
                name="${field.name}" 
                value="${value}"
                placeholder="${field.placeholder || ''}"
                ${required}
              >
            </div>
          `;

        case 'select':
          return `
            <div class="field-group">
              <label for="${field.name}">${field.label}${requiredStar}</label>
              <select id="${field.name}" name="${field.name}" ${required}>
                <option value="">Select...</option>
                ${field.options.map(opt => `
                  <option value="${opt.value}" ${value === opt.value ? 'selected' : ''}>
                    ${opt.label}
                  </option>
                `).join('')}
              </select>
            </div>
          `;

        case 'checkbox-group':
          const selectedValues = Array.isArray(value) ? value : [];
          return `
            <div class="field-group">
              <label>${field.label}${requiredStar}</label>
              <div class="checkbox-group" data-name="${field.name}">
                ${field.options.map(opt => `
                  <label class="checkbox-item ${selectedValues.includes(opt.value) ? 'checked' : ''}">
                    <input 
                      type="checkbox" 
                      name="${field.name}" 
                      value="${opt.value}"
                      ${selectedValues.includes(opt.value) ? 'checked' : ''}
                    >
                    <span class="checkbox-label">${opt.label}</span>
                  </label>
                `).join('')}
              </div>
            </div>
          `;

        case 'radio-group':
          return `
            <div class="field-group">
              <label>${field.label}${requiredStar}</label>
              <div class="radio-group" data-name="${field.name}">
                ${field.options.map(opt => `
                  <label class="radio-item ${value === opt.value ? 'checked' : ''}">
                    <input 
                      type="radio" 
                      name="${field.name}" 
                      value="${opt.value}"
                      ${value === opt.value ? 'checked' : ''}
                    >
                    <span class="radio-label">${opt.label}</span>
                  </label>
                `).join('')}
              </div>
            </div>
          `;

        case 'slider':
          const sliderValue = value || field.default || 50;
          return `
            <div class="field-group">
              <label>${field.label}</label>
              <div class="slider-container">
                <span class="slider-label-left">${field.leftLabel || 'Min'}</span>
                <input 
                  type="range" 
                  id="${field.name}" 
                  name="${field.name}" 
                  min="${field.min || 0}" 
                  max="${field.max || 100}" 
                  value="${sliderValue}"
                >
                <span class="slider-label-right">${field.rightLabel || 'Max'}</span>
              </div>
              <div class="slider-value">${sliderValue}%</div>
            </div>
          `;

        case 'textarea':
          return `
            <div class="field-group">
              <label for="${field.name}">${field.label}${requiredStar}</label>
              <textarea 
                id="${field.name}" 
                name="${field.name}" 
                rows="${field.rows || 3}"
                placeholder="${field.placeholder || ''}"
                ${required}
              >${value}</textarea>
            </div>
          `;

        default:
          return '';
      }
    }).join('');
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    // Close button
    this.modal.querySelector('.slide-modal-close').addEventListener('click', () => this.close());
    
    // Overlay click
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.close();
    });

    // Back button
    const backBtn = this.modal.querySelector('.slide-btn-back');
    if (backBtn) {
      backBtn.addEventListener('click', () => this.prevSlide());
    }

    // Next button
    const nextBtn = this.modal.querySelector('.slide-btn-next');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.nextSlide());
    }

    // Submit button
    const submitBtn = this.modal.querySelector('.slide-btn-submit');
    if (submitBtn) {
      submitBtn.addEventListener('click', () => this.submit());
    }

    // Field change handlers
    this.modal.querySelectorAll('input, select, textarea').forEach(input => {
      input.addEventListener('change', (e) => this.handleFieldChange(e));
      input.addEventListener('input', (e) => this.handleFieldChange(e));
    });

    // Checkbox/radio visual feedback - rely on change event to update classes
    this.modelInputHandler = (e) => {
      const item = e.target.closest('.checkbox-item, .radio-item');
      if (item) {
        // Classes updated in handleFieldChange
      }
    };

    // Slider value display
    this.modal.querySelectorAll('input[type="range"]').forEach(slider => {
      slider.addEventListener('input', (e) => {
        const valueDisplay = slider.parentElement.nextElementSibling;
        if (valueDisplay) valueDisplay.textContent = `${e.target.value}%`;
      });
    });
  }

  /**
   * Handle field value changes
   */
  handleFieldChange(e) {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      // Handle checkbox groups
      if (!this.formData[name]) this.formData[name] = [];
      if (checked) {
        if (!this.formData[name].includes(value)) {
          this.formData[name].push(value);
        }
      } else {
        this.formData[name] = this.formData[name].filter(v => v !== value);
      }
      
      // Update visual state
      const item = e.target.closest('.checkbox-item');
      if (item) item.classList.toggle('checked', checked);
    } else if (type === 'radio') {
      this.formData[name] = value;
      
      // Update visual state
      const group = e.target.closest('.radio-group');
      if (group) {
        group.querySelectorAll('.radio-item').forEach(item => {
          item.classList.toggle('checked', item.querySelector('input').checked);
        });
      }
    } else {
      this.formData[name] = value;
    }
  }

  /**
   * Validate current slide
   */
  validateCurrentSlide() {
    const slide = this.slides[this.currentSlide];
    if (slide.optional) return true;

    const requiredFields = (slide.fields || []).filter(f => f.required);
    
    for (const field of requiredFields) {
      const value = this.formData[field.name];
      if (!value || (Array.isArray(value) && value.length === 0)) {
        // Highlight missing field
        const input = this.modal.querySelector(`[name="${field.name}"]`);
        if (input) {
          input.classList.add('error');
          input.focus();
        }
        return false;
      }
    }
    return true;
  }

  /**
   * Check if a slide should be skipped
   */
  shouldSkipSlide(index) {
    const slide = this.slides[index];
    if (!slide || !slide.skipIf) return false;
    
    return slide.skipIf(this.formData);
  }

  /**
   * Go to next slide
   */
  nextSlide() {
    if (!this.validateCurrentSlide()) return;

    // Save to profile incrementally
    UserProfileService.save(this.formData);

    let nextIndex = this.currentSlide + 1;
    
    // Skip slides based on conditions
    while (nextIndex < this.slides.length && this.shouldSkipSlide(nextIndex)) {
      nextIndex++;
    }

    if (nextIndex < this.slides.length) {
      this.currentSlide = nextIndex;
      this.updateModal();
      this.onSlideChange(this.currentSlide, this.formData); // Trigger callback
    }
  }

  /**
   * Go to previous slide
   */
  prevSlide() {
    let prevIndex = this.currentSlide - 1;
    
    // Skip slides based on conditions
    while (prevIndex >= 0 && this.shouldSkipSlide(prevIndex)) {
      prevIndex--;
    }

    if (prevIndex >= 0) {
      this.currentSlide = prevIndex;
      this.updateModal();
    }
  }

  /**
   * Update modal content
   */
  updateModal() {
    const modalContent = this.modal.querySelector('.slide-modal');
    const newModal = document.createElement('div');
    newModal.innerHTML = this.getModalHTML();
    
    modalContent.innerHTML = newModal.querySelector('.slide-modal').innerHTML;
    this.attachEventListeners();
  }

  /**
   * Submit the form
   */
  submit() {
    if (!this.validateCurrentSlide()) return;

    // Save final data
    UserProfileService.save(this.formData);
    UserProfileService.markContactCaptured();

    // Call completion handler
    this.onComplete(this.formData);
    
    // Close modal
    this.close();
  }

  /**
   * Close the modal
   */
  close() {
    this.modal.classList.remove('visible');
    
    setTimeout(() => {
      this.modal.remove();
      this.onClose();
    }, 300);
  }

  /**
   * Show acknowledgement slide
   */
  showAcknowledgement(message = "Thank you! Our team will contact you within 24 hours.") {
    const content = this.modal.querySelector('.slide-modal-content');
    const footer = this.modal.querySelector('.slide-modal-footer');
    const progress = this.modal.querySelector('.slide-modal-progress');
    
    if (progress) progress.style.display = 'none';
    
    content.innerHTML = `
      <div class="ack-slide">
        <div class="ack-icon">✓</div>
        <h3 class="ack-title">Request Submitted!</h3>
        <p class="ack-message">${message}</p>
      </div>
    `;
    
    footer.innerHTML = `
      <div></div>
      <button class="slide-btn slide-btn-done">Done</button>
    `;
    
    footer.querySelector('.slide-btn-done').addEventListener('click', () => this.close());
  }
}

export default SlideModal;
