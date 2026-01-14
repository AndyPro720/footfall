/**
 * Email Service
 * Wrapper around FormSubmit.co API for sending HTML formatted emails
 */

const FORMSUBMIT_URL = 'https://formsubmit.co/ajax/info@foottfall.com';

/**
 * Format data as HTML table for email body
 */
function formatDataAsHTML(type, data) {
  const timestamp = new Date().toLocaleString('en-IN', { 
    timeZone: 'Asia/Kolkata',
    dateStyle: 'full',
    timeStyle: 'short'
  });

  let title = '';
  let sections = [];

  if (type === 'trade_area_filter') {
    title = '🎯 New Trade Area Filter Request';
    sections = [
      {
        name: 'Contact Information',
        rows: [
          ['Name', data.name || 'Not provided'],
          ['Brand Name', data.brandName || 'Not provided'],
          ['Contact', data.contact || 'Not provided'],
          ['Email', data.email || 'Not provided']
        ]
      },
      {
        name: 'Filter Preferences',
        rows: [
          ['City', data.selectedCity || 'Not specified'],
          ['Categories', (data.categories || []).join(', ') || 'None selected'],
          ['Property Size', data.propertySize || 'Not specified'],
          ['Ticket Size', data.ticketSize || 'Not specified']
        ]
      },
      {
        name: 'Results',
        rows: [
          ['Matched Trade Areas', data.matchedCount || 0],
          ['Source', data.source || 'Unknown']
        ]
      }
    ];
  } else if (type === 'find_location') {
    title = '📍 New Location Inquiry - Full Questionnaire';
    sections = [
      {
        name: 'Contact Information',
        rows: [
          ['Name', data.name || 'Not provided'],
          ['Brand Name', data.brandName || 'Not provided'],
          ['Contact', data.contact || 'Not provided'],
          ['Email', data.email || 'Not provided']
        ]
      },
      {
        name: 'Filter Preferences',
        rows: [
          ['City', data.selectedCity || 'Not specified'],
          ['Categories', (data.categories || []).join(', ') || 'None selected'],
          ['Property Size', data.propertySize || 'Not specified'],
          ['Ticket Size', data.ticketSize || 'Not specified']
        ]
      },
      {
        name: 'Your People',
        rows: [
          ['Catchment Type', (data.catchmentType || []).join(', ') || 'Not specified'],
          ['Gender Mix', data.genderMix ? `${data.genderMix.male}% M / ${data.genderMix.female}% F` : 'Not specified'],
          ['Age Groups', (data.ageGroups || []).join(', ') || 'Not specified'],
          ['Rental Bracket', data.rentalBracket || 'Not specified']
        ]
      },
      {
        name: 'Your Business',
        rows: [
          ['Years in Business', data.yearsInBusiness || 'Not specified']
        ]
      },
      {
        name: 'Your Footprint',
        rows: [
          ['HQ City', data.hqCity || 'Not provided'],
          ['Store Count', data.storeCount || 'Not provided'],
          ['Total Leased Sqft', data.totalLeasedSqft || 'Not provided'],
          ['Topline Revenue', data.toplineRevenue || 'Not provided'],
          ['Viable Rent Range', data.viableRentRange || 'Not provided']
        ]
      },
      {
        name: 'Your Aspiration',
        rows: [
          ['Business Format', data.businessFormat || 'Not specified'],
          ['Competing Brands', (data.competingBrands || []).join(', ') || 'Not specified'],
          ['Aspirational Areas', (data.aspirationalAreas || []).join(', ') || 'Not specified'],
          ['Growth Plan (12 months)', data.growthPlan || 'Not specified']
        ]
      },
      {
        name: 'Context',
        rows: [
          ['Current Trade Area', data.currentTradeArea || 'Not selected'],
          ['Source', data.source || 'Unknown']
        ]
      }
    ];
  } else if (type === 'soft_lead') {
    title = '🔔 New Soft Lead Capture';
    sections = [
      {
        name: 'Contact Information',
        rows: [
          ['Name', data.name || 'Not provided'],
          ['Contact', data.contact || 'Not provided'],
          ['Email', data.email || 'Not provided']
        ]
      },
      {
        name: 'Context',
        rows: [
          ['Page', data.currentPage || 'Unknown'],
          ['City', data.selectedCity || 'Not selected'],
          ['Lead Type', 'Warm (Voluntary Submission)']
        ]
      }
    ];
  }

  // Build HTML
  const sectionsHTML = sections.map(section => `
    <tr>
      <td colspan="2" style="background: #1a1a1a; color: #d4af37; padding: 10px 15px; font-weight: bold; font-size: 14px; border-bottom: 2px solid #d4af37;">
        ${section.name}
      </td>
    </tr>
    ${section.rows.map(([label, value]) => `
      <tr>
        <td style="padding: 8px 15px; color: #888; font-size: 13px; border-bottom: 1px solid #333; width: 40%;">${label}</td>
        <td style="padding: 8px 15px; color: #fff; font-size: 13px; border-bottom: 1px solid #333;">${value}</td>
      </tr>
    `).join('')}
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
    </head>
    <body style="margin: 0; padding: 20px; background: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; background: #121212; border-radius: 12px; overflow: hidden; border: 1px solid #333;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%); padding: 25px; text-align: center; border-bottom: 2px solid #d4af37;">
          <img src="https://foottfall.com/logo.png" alt="FOOTTFALL" style="height: 30px; margin-bottom: 10px;" onerror="this.style.display='none'">
          <h1 style="margin: 0; color: #d4af37; font-size: 20px; font-weight: 600;">${title}</h1>
          <p style="margin: 10px 0 0; color: #888; font-size: 12px;">${timestamp}</p>
        </div>
        
        <!-- Content -->
        <table style="width: 100%; border-collapse: collapse;">
          ${sectionsHTML}
        </table>
        
        <!-- Footer -->
        <div style="padding: 20px; text-align: center; background: #0a0a0a; border-top: 1px solid #333;">
          <p style="margin: 0; color: #666; font-size: 11px;">This is an automated email from FOOTTFALL Intelligence Platform</p>
        </div>
      </div>
    </body>
    </html>
  `;
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
      const htmlContent = formatDataAsHTML(type, data);
      
      const subjects = {
        trade_area_filter: `[Trade Area Filter] ${data.brandName || data.name || 'New Lead'} - ${data.selectedCity || 'Unknown City'}`,
        find_location: `[Location Inquiry] ${data.brandName || data.name || 'New Lead'} - ${data.selectedCity || 'Unknown City'}`,
        soft_lead: `[Soft Lead] ${data.name || 'Anonymous'}`
      };

      const formData = new FormData();
      formData.append('_subject', subjects[type] || 'FOOTTFALL Inquiry');
      formData.append('message', htmlContent);
      formData.append('_captcha', 'false');

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
