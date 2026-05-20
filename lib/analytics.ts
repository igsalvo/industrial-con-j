type AnalyticsEventParams = Record<string, unknown>;

declare global {
  interface Window {
    dataLayer?: AnalyticsEventParams[];
  }
}

export function trackEvent(eventName: string, params: AnalyticsEventParams = {}) {
  if (typeof window === "undefined") {
    return;
  }

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({
    event: eventName,
    ...params
  });
}
