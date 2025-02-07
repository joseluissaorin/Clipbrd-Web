'use client';

const UMAMI_WEBSITE_ID = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
const UMAMI_URL = process.env.NEXT_PUBLIC_UMAMI_URL || 'https://analytics.umami.is';

// Track page views (automatically handled by Umami script)
export function trackPageView() {
  // This is handled automatically by the Umami script
  return;
}

// Track custom events
export function trackEvent(eventName, eventData = {}) {
  if (typeof window === 'undefined' || !window.umami) return;

  try {
    window.umami.track(eventName, eventData);
  } catch (error) {
    console.error('Error tracking event:', error);
  }
}

// Track conversion events (purchases, signups)
export function trackConversion(type, value = 0, currency = 'EUR') {
  if (typeof window === 'undefined' || !window.umami) return;

  try {
    window.umami.track('conversion', {
      type,
      value,
      currency
    });
  } catch (error) {
    console.error('Error tracking conversion:', error);
  }
}

// Track license usage
export function trackLicenseUsage(licenseId, eventType) {
  if (typeof window === 'undefined' || !window.umami) return;

  try {
    window.umami.track('license_usage', {
      license_id: licenseId,
      event_type: eventType
    });
  } catch (error) {
    console.error('Error tracking license usage:', error);
  }
}

// Track errors
export function trackError(errorType, errorMessage) {
  if (typeof window === 'undefined' || !window.umami) return;

  try {
    window.umami.track('error', {
      type: errorType,
      message: errorMessage
    });
  } catch (error) {
    console.error('Error tracking error event:', error);
  }
} 