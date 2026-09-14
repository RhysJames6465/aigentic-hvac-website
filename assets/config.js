/* Public configuration only. Never place API keys here. See INTEGRATION.md. */
window.AIGENTIC_CONFIG = {
  // Owner configuration: replace null only with verified values before launch.
  bookingUrl: null, // The one canonical HTTPS GHL calendar URL.
  contactEndpoint: null, // Existing homepage adapter, if approved later.
  contactFormEndpoint: null, // CONTACT_FORM_ENDPOINT: approved same-origin endpoint only.
  privacyUrl: null, // Reviewed Privacy Policy URL.
  termsUrl: null, // Reviewed Terms and Conditions URL.
  cookiePolicyUrl: null, // Enable only if required by the actual tracking implementation.
  accessibilityUrl: null, // Reviewed Accessibility statement URL.
  smsTermsUrl: null, // Required before implementing SMS marketing.
  business: {legalName:'A Rhys James',email:'hello@aigenticcampaign.com',phone:'+61 478 898 136',region:'Redfern, NSW, Australia',registration:'ABN 61 727 181 363'},
  consent: {
    reviewed: false,
    version: null,
    serviceDisclosure: null, // Jurisdiction-specific review required.
    marketingText: null, // Optional and unticked; never required to book.
    source: 'aigentic-hvac-growth-call'
  },
  integration: {
    spamProtectionVerified: false, // Server-side rate limiting and bot protection required.
    // Populate only after confirming the actual GHL postMessage contract.
    bookingSuccessEvent: null
  }
};
