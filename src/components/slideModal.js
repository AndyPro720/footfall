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
    this.sliderTouched = {}; // Track which sliders have been interacted with
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
              ${this.getNextButtonText(slide)}
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
          return `
            <div class="field-group">
              <label for="${field.name}">${field.label}${requiredStar}</label>
              <input 
                type="text" 
                id="${field.name}" 
                name="${field.name}" 
                value="${value}"
                placeholder="${field.placeholder || ''}"
                ${field.pattern ? `pattern="${field.pattern}"` : ''}
                ${required}
              >
            </div>
          `;
        
        case 'email':
          return `
            <div class="field-group">
              <label for="${field.name}">${field.label}${requiredStar}</label>
              <input 
                type="email" 
                id="${field.name}" 
                name="${field.name}" 
                value="${value}"
                placeholder="${field.placeholder || ''}"
                pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                title="Please enter a valid email address"
                ${required}
              >
            </div>
          `;

        case 'tel':
          return `
            <div class="field-group">
              <label for="${field.name}">${field.label}${requiredStar}</label>
              <input 
                type="tel" 
                id="${field.name}" 
                name="${field.name}" 
                value="${value}"
                placeholder="${field.placeholder || ''}"
                pattern="[+]?[0-9\s-]{7,15}"
                title="Please enter a valid phone number"
                inputmode="tel"
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
          const multiSelectHint = field.options && field.options.length > 1 ? ' <span class="multi-select-hint">(multi-select)</span>' : '';
          return `
            <div class="field-group">
              <label>${field.label}${multiSelectHint}${requiredStar}</label>
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
          let sliderValue = 50;
          if (value !== undefined && value !== null && value !== '') {
            sliderValue = parseInt(value);
            // Safety check for NaN (legacy data support)
            if (isNaN(sliderValue)) sliderValue = 50;
          } else if (field.default !== undefined) {
            sliderValue = field.default;
          }
          
          // Slider is touched if value is present AND different from default "untouched" state
          const isDefault = field.default !== undefined ? field.default : 50;
          const parsedVal = parseInt(value);
          // Ensure we don't treat NaN as touched
          const sliderTouched = this.sliderTouched[field.name] || 
            (value !== undefined && value !== '' && !isNaN(parsedVal) && parsedVal !== isDefault);
          
          const sliderDisplayText = sliderTouched ? `${100 - sliderValue}% / ${sliderValue}%` : 'Drag to set';
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
                  data-touched="${sliderTouched}"
                >
                <span class="slider-label-right">${field.rightLabel || 'Max'}</span>
              </div>
              <div class="slider-value" data-slider-display="${field.name}">${sliderDisplayText}</div>
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
    // Input Sanitization (Mobile Number)
    this.modal.addEventListener('input', (e) => {
      if (e.target.type === 'tel') {
        const val = e.target.value;
        // Allow numbers, spaces, +, -
        const clean = val.replace(/[^0-9+\s-]/g, '');
        if (val !== clean) {
          e.target.value = clean;
        }
      }
    });

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
      const fieldName = slider.name;
      const leftLabel = slider.parentElement.querySelector('.slider-label-left')?.textContent || '';
      const rightLabel = slider.parentElement.querySelector('.slider-label-right')?.textContent || '';
      
      slider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        const display = this.modal.querySelector(`[data-slider-display="${fieldName}"]`);
        if (display) {
          // Mark as touched
          this.sliderTouched[fieldName] = true;
          // Display as Left% / Right%
          display.textContent = `${100 - val}% / ${val}%`;
        }
      });
    });
  }

  /**
   * Get the text for the Next button (Skip vs Next based on optional slide data)
   */
  getNextButtonText(slide) {
    if (!slide.optional) return 'Next';
    
    // Check if any field in this optional slide has data
    const fields = slide.fields || [];
    for (const field of fields) {
      const value = this.formData[field.name];
      if (value && (typeof value === 'string' ? value.trim() : (Array.isArray(value) ? value.length > 0 : true))) {
        return 'Next';
      }
    }
    return 'Skip';
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
    
    // Remove error class on change
    if (e.target.classList.contains('error')) {
      e.target.classList.remove('error');
    }
    
    // Dynamic Button Update
    // Check if we need to switch between "Skip" and "Next"
    const slide = this.slides[this.currentSlide];
    if (slide && slide.optional) {
      const nextBtn = this.modal.querySelector('.slide-btn-next');
      if (nextBtn) {
        const text = this.getNextButtonText(slide);
        // Only update if changed to prevent flickering/SVG reload
        if (!nextBtn.textContent.includes(text)) {
           nextBtn.innerHTML = `
            ${text}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          `;
        }
      }
    }
  }

  /**
   * Validate current slide
   */
  validateCurrentSlide() {
    const slide = this.slides[this.currentSlide];
    let isValid = true;
    
    // 1. Native Browser Validation (Email, Pattern, Required on Inputs)
    // We check ALL inputs, even for optional slides, if data is entered it must be valid
    const inputs = this.modal.querySelectorAll('.slide-modal-content input, .slide-modal-content select, .slide-modal-content textarea');
    inputs.forEach(input => {
      // Reset previous error
      input.classList.remove('error');
      
      // If optional slide and empty, it's valid (browser handles 'required' attr logic)
      // But we manually manage 'required' for optional slides in the previous logic which was flawed
      // Here: if input has 'required', checkValidity() returns false if empty.
      
      // Special case: If slide is optional, we might want to allow empty required fields?
      // No, if the field is marked required in config, it implies "if you answer this slide, this field is needed".
      // But if slide is optional, usually fields shouldn't be required unless they depend on each other.
      // For now, relies on standard checkValidity()
      
      if (!input.checkValidity()) {
        // Only block if:
        // 1. Slide is NOT optional OR
        // 2. Slide IS optional BUT value is not empty (i.e. partial invalid data)
        // Actually, if slide is optional, "required" attribute shouldn't be on inputs if we allow skipping empty.
        // But our render logic adds 'required' based on config.
        
        // Revised Logic:
        // If slide is optional, ignore 'value missing' error. Respect other errors (type mismatch).
        if (slide.optional && input.validity.valueMissing) {
           return;
        }
        
        input.classList.add('error');
        // Only report validity on the first error to avoid spam
        if (isValid) input.reportValidity();
        isValid = false;
      }
    });

    if (!isValid) return false;

    // 2. Custom Validation (Checkbox Groups)
    if (!slide.optional) {
      const requiredFields = (slide.fields || []).filter(f => f.required);
      
      for (const field of requiredFields) {
        if (field.type === 'checkbox-group') {
          const value = this.formData[field.name];
          if (!value || (Array.isArray(value) && value.length === 0)) {
             // Highlight group
             const group = this.modal.querySelector(`.checkbox-group[data-name="${field.name}"]`);
             if (group) {
                // Flash effect or error class
                group.style.border = '1px solid #dc2626';
                group.style.borderRadius = '12px';
                setTimeout(() => group.style.border = '', 2000);
             }
             isValid = false;
          }
        }
      }
    }
    
    return isValid;
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
    
    // Do NOT close modal automatically - let onComplete handle next steps (like acknowledgement)
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
   * Show acknowledgement slide with beautiful animation
   */
  showAcknowledgement(message = "Our team will contact you within 24 hours.", options = {}) {
    const content = this.modal.querySelector('.slide-modal-content');
    const footer = this.modal.querySelector('.slide-modal-footer');
    const progress = this.modal.querySelector('.slide-modal-progress');
    
    if (progress) progress.style.display = 'none';
    
    const title = options.title || 'Hold Tight!';
    const showMatchedAreas = options.showMatchedAreas !== false;
    
    content.innerHTML = `
      <div class="ack-slide ack-slide-animated">
        <div class="ack-icon-wrapper">
          <div class="ack-icon-ring"></div>
          <div class="ack-icon">✓</div>
        </div>
        <h3 class="ack-title">${title}</h3>
        <p class="ack-message">${message}</p>
        ${showMatchedAreas ? '<p class="ack-hint">Your best fit trade areas are shown beside!</p>' : ''}
      </div>
    `;
    
    footer.innerHTML = `
      <div></div>
      <button class="slide-btn slide-btn-done">Got it!</button>
    `;
    
    footer.querySelector('.slide-btn-done').addEventListener('click', () => this.close());
  }
}

export default SlideModal;
