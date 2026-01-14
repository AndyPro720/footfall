/**
 * Email Service
 * Wrapper around FormSubmit.co API
 */

import { UserProfileService } from './userProfileService.js';

const FORMSUBMIT_URL = 'https://formsubmit.co/ajax/info@foottfall.com';

/**
 * Get device and browser info
 */
function getDeviceInfo() {
  const ua = navigator.userAgent;
  let browser = "Unknown";
  if (ua.indexOf("Firefox") > -1) browser = "Firefox";
  else if (ua.indexOf("SamsungBrowser") > -1) browser = "Samsung Internet";
  else if (ua.indexOf("Opera") > -1 || ua.indexOf("OPR") > -1) browser = "Opera";
  else if (ua.indexOf("Trident") > -1) browser = "Internet Explorer";
  else if (ua.indexOf("Edge") > -1) browser = "Edge";
  else if (ua.indexOf("Chrome") > -1) browser = "Chrome";
  else if (ua.indexOf("Safari") > -1) browser = "Safari";

  return {
    browser: browser,
    platform: navigator.platform,
    screen: `${window.screen.width}x${window.screen.height}`,
    language: navigator.language,
    url: window.location.href
  };
}


/**
 * Prepare flat data object for email submission
 * Flattens the nested data structure into readable key-value pairs for FormSubmit's table template
 */
function prepareData(type, data) {
  const val = (v, fallback = 'Not provided') => (v === null || v === undefined || v === '') ? fallback : v;
  const list = (arr, fallback = 'None selected') => (Array.isArray(arr) && arr.length > 0) ? arr.join(', ') : fallback;

  // Get User Context
  const profile = UserProfileService.get();
  const deviceInfo = getDeviceInfo();
  
  // Determine Lead Status Label
  // If they are submitting a form, they are by definition 'Warm' active leads.
  // We can also check if they were previously Cold (dismissed soft lead).
  let leadStatusLabel = 'Warm Lead (Active Submission)';
  if (profile.leadStatus === 'cold') {
    leadStatusLabel = 'converted Cold Lead (Previously dismissed soft lead)';
  } else if (type === 'soft_lead') {
     leadStatusLabel = 'Warm Lead (Soft Capture)';
  }

  // Common Header Fields (Top of Email)
  const header = {
    'LEAD STATUS': leadStatusLabel.toUpperCase(),
    'User ID': profile.userId || 'Not tracked',
    'Submission Type': type === 'trade_area_filter' ? '🎯 Trade Area Filter' : 
                      type === 'find_location' ? '📍 Location Inquiry (Full)' : 
                      '🔔 Soft Lead',
    'Submission Date': new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'full', timeStyle: 'short' }),
    'Current Page': deviceInfo.url,
  };

  // Device Info (Grouped)
  const device = {
    '--- Device Info ---': '',
    'Browser': `${deviceInfo.browser} on ${deviceInfo.platform}`,
    'Screen': deviceInfo.screen,
    'Language': deviceInfo.language,
  };

  let specificData = {};

  if (type === 'trade_area_filter') {
    specificData = {
      '--- Contact ---': '',
      'Name': val(data.name),
      'Brand Name': val(data.brandName),
      'Contact': val(data.contact),
      'Email': val(data.email),
      
      '--- Details ---': '',
      'City': val(data.selectedCity),
      'Categories': list(data.categories),
      'Property Size': val(data.propertySize),
      'Ticket Size': val(data.ticketSize),
      
      '--- Results ---': '',
      'Matched Trade Areas': val(data.matchedCount, '0'),
      'Source': val(data.source, 'Unknown')
    };
  } 
  
  else if (type === 'find_location') {
    specificData = {
      '--- Contact ---': '',
      'Name': val(data.name),
      'Brand Name': val(data.brandName),
      'Contact': val(data.contact),
      'Email': val(data.email),
      
      '--- Preferences ---': '',
      'City': val(data.selectedCity),
      'Categories': list(data.categories),
      'Property Size': val(data.propertySize),
      'Ticket Size': val(data.ticketSize),

      '--- Target Audience ---': '',
      'Catchment Type': list(data.catchmentType, 'Not specified'),
      'Gender Mix': data.genderMix ? `${val(data.genderMix.male)}% M / ${val(data.genderMix.female)}% F` : 'Not specified',
      'Age Groups': list(data.ageGroups, 'Not specified'),
      'Rental Bracket': val(data.rentalBracket, 'Not specified'),

      '--- Business ---': '',
      'Years in Business': val(data.yearsInBusiness, 'Not specified'),
      'Business Format': val(data.businessFormat, 'Not specified'),
      'Growth Plan (12m)': val(data.growthPlan, 'Not specified'),
      
      '--- Footprint ---': '',
      'HQ City': val(data.hqCity),
      'Store Count': val(data.storeCount),
      'Total Leased Sqft': val(data.totalLeasedSqft),
      'Topline Revenue': val(data.toplineRevenue),
      'Viable Rent Range': val(data.viableRentRange),

      '--- Strategy ---': '',
      'Competing Brands': list(data.competingBrands, 'Not specified'),
      'Aspirational Areas': list(data.aspirationalAreas, 'Not specified'),

      '--- Context ---': '',
      'Current Trade Area': val(data.currentTradeArea, 'Not selected'),
      'Source': val(data.source, 'Unknown')
    };
  } 
  
  else if (type === 'soft_lead') {
    specificData = {
      '--- Contact ---': '',
      'Name': val(data.name),
      'Contact': val(data.contact),
      'Email': val(data.email),
      
      '--- Context ---': '',
      'City': val(data.selectedCity, 'Not selected')
    };
  }

  // Combine all parts
  return { ...header, ...specificData, ...device };
}

export const EmailService = {
  /**
   * Send a lead email
   * @param {string} type - 'trade_area_filter', 'find_location', or 'soft_lead'
   * @param {object} data - Data to include in email
   * @returns {Promise<boolean>} - Success status
   */
  async sendLeadEmail(type, data) {
    try {
      // Prepare flat data for FormSubmit table
      const flatData = prepareData(type, data);
      
      const subjects = {
        trade_area_filter: `[Trade Area Filter] ${data.brandName || data.name || 'New Lead'} - ${data.selectedCity || 'Unknown City'}`,
        find_location: `[Location Inquiry] ${data.brandName || data.name || 'New Lead'} - ${data.selectedCity || 'Unknown City'}`,
        soft_lead: `[Soft Lead] ${data.name || 'Anonymous'}`
      };

      const formData = new FormData();
      
      // Config fields
      formData.append('_subject', subjects[type] || 'FOOTTFALL Inquiry');
      formData.append('_template', 'table'); // Use table template for better formatting
      formData.append('_captcha', 'false');
      
      // Append all data fields
      Object.entries(flatData).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const response = await fetch(FORMSUBMIT_URL, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      
      if (result.success) {
        console.log(`✅ Email sent successfully: ${type}`);
        return true;
      } else {
        console.error('Email send failed:', result);
        return false;
      }
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  }
};

export default EmailService;
