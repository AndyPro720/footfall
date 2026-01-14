/**
 * User Profile Service
 * Manages user data persistence via tiered storage:
 * - localStorage: Persistent data (survives reloads) - soft lead data, dismissals, contact info
 * - sessionStorage: Transient data (session only) - intro animation played
 * 
 * Hard Reset: Press Ctrl+Shift+D to clear all persistent data
 */

const SESSION_STORAGE_KEY = 'foottfall_session';
const PERSIST_STORAGE_KEY = 'foottfall_user_persist';

// 24 hours in milliseconds
const SOFT_LEAD_COOLDOWN_MS = 24 * 60 * 60 * 1000;

const defaultProfile = {
  // Contact Info
  name: '',
  brandName: '',
  contact: '',
  email: '',
  
  // Filter Preferences
  selectedCity: '',
  categories: [],
  propertySize: '',
  ticketSize: '',
  
  // Your People
  catchmentType: [],      // residential, offices, institutes, factories, transit, medical
  genderMix: 50,          // Changed from object to number (0-100 representing % Male)
  ageGroups: [],          // 18-25, 25-35, 35-50, 50+, all
  rentalBracket: '',
  
  // Your Business
  yearsInBusiness: '',
  
  // Your Footprint (Optional)
  hqCity: '',
  storeCount: '',
  totalLeasedSqft: '',
  toplineRevenue: '',
  viableRentRange: '',
  
  // Your Aspiration
  businessFormat: '',
  competingBrands: [],
  aspirationalAreas: [],
  growthPlan: '',
  
  // Meta
  leadStatus: null,           // 'warm', 'cold', or null
  contactCapturedAt: null,
  softLeadDismissedAt: null,  // Timestamp when user dismissed soft lead
  lastUpdated: null,
  sessionId: null
};


export const UserProfileService = {
  /**
   * Get the full user profile from localStorage (persistent)
   */
  get() {
    try {
      const stored = localStorage.getItem(PERSIST_STORAGE_KEY);
      if (stored) {
        return { ...defaultProfile, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('Failed to parse user profile:', e);
    }
    return { ...defaultProfile };
  },

  /**
   * Save partial profile updates (merges with existing) to localStorage
   * Note: Empty strings and empty arrays are IGNORED to prevent overwriting existing values
   */
  save(data) {
    try {
      const current = this.get();
      
      // Filter out empty strings and empty arrays to prevent overwriting existing data
      const filteredData = {};
      for (const [key, value] of Object.entries(data)) {
        // Skip empty strings
        if (value === '') continue;
        // Skip empty arrays
        if (Array.isArray(value) && value.length === 0) continue;
        // Skip null/undefined
        if (value === null || value === undefined) continue;
        
        filteredData[key] = value;
      }
      
      const updated = {
        ...current,
        ...filteredData,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(PERSIST_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('Failed to save user profile:', e);
      return null;
    }
  },

  /**
   * Check if contact info has been captured
   */
  isContactCaptured() {
    const profile = this.get();
    return !!(profile.contactCapturedAt);
  },

  /**
   * Check if soft lead data has been submitted (any field filled)
   */
  hasSoftLeadData() {
    const profile = this.get();
    return !!(profile.name || profile.brandName || profile.contact);
  },

  /**
   * Mark contact as captured with timestamp
   */
  markContactCaptured() {
    this.save({ contactCapturedAt: new Date().toISOString() });
  },

  /**
   * Mark soft lead as dismissed (starts 24h cooldown)
   */
  markSoftLeadDismissed() {
    this.save({ 
      softLeadDismissedAt: new Date().toISOString(),
      leadStatus: 'cold'
    });
    console.log('Soft lead dismissed - 24h cooldown started');
  },

  /**
   * Check if soft lead was dismissed within the last 24 hours
   */
  isSoftLeadDismissedRecently() {
    const profile = this.get();
    if (!profile.softLeadDismissedAt) return false;
    
    const dismissedAt = new Date(profile.softLeadDismissedAt).getTime();
    const now = Date.now();
    const elapsed = now - dismissedAt;
    
    return elapsed < SOFT_LEAD_COOLDOWN_MS;
  },

  /**
   * Combined check: Should we show the soft lead capture?
   * Returns true if:
   * - User has NOT submitted soft lead data AND
   * - User has NOT been marked as warm lead AND
   * - (User never dismissed OR 24h+ since last dismissal)
   */
  shouldShowSoftLead() {
    const profile = this.get();
    
    // Already submitted data or warm lead - never show
    if (this.hasSoftLeadData() || profile.leadStatus === 'warm') {
      return false;
    }
    
    // Check if dismissed recently (within 24h)
    if (this.isSoftLeadDismissedRecently()) {
      return false;
    }
    
    return true;
  },

  /**
   * Get filter preferences
   */
  getFilterPrefs() {
    const profile = this.get();
    return {
      selectedCity: profile.selectedCity,
      categories: profile.categories,
      propertySize: profile.propertySize,
      ticketSize: profile.ticketSize
    };
  },

  /**
   * Save filter preferences
   */
  saveFilterPrefs(prefs) {
    this.save({
      selectedCity: prefs.selectedCity || '',
      categories: prefs.categories || [],
      propertySize: prefs.propertySize || '',
      ticketSize: prefs.ticketSize || ''
    });
  },

  /**
   * Set lead status
   */
  setLeadStatus(status) {
    this.save({ leadStatus: status });
  },

  /**
   * Check if user dismissed the soft capture (cold lead)
   */
  isColdLead() {
    return this.get().leadStatus === 'cold';
  },

  /**
   * Check if user is a warm lead
   */
  isWarmLead() {
    return this.get().leadStatus === 'warm';
  },

  /**
   * Clear all persistent data (localStorage) - for hard reset
   * Note: Does NOT clear sessionStorage (intro animation stays)
   */
  hardReset() {
    try {
      localStorage.removeItem(PERSIST_STORAGE_KEY);
      console.log('🔄 UserProfileService: Hard reset complete - all persistent data cleared');
    } catch (e) {
      console.error('Failed to hard reset user profile:', e);
    }
  },

  /**
   * Clear all stored data (for testing) - clears both storages
   */
  clear() {
    try {
      localStorage.removeItem(PERSIST_STORAGE_KEY);
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear user profile:', e);
    }
  }
};

export default UserProfileService;
