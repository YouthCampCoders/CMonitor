export const MetricsName = {
  NT: 'navigation-timing',
  //
  FCP: 'first-contentful-paint',
  LCP: 'largest-contentful-paint',
  FID: 'first-input-delay',
  CLS: 'comulative-layout-shift',
  TTFB: 'time-to-first-byte'
}

export const MetricsRating = {
  [MetricsName.FCP]: {
    upper: 3000,
    lower: 1800
  },
  [MetricsName.LCP]: {
    upper: 4000,
    lower: 2500
  },
  [MetricsName.FID]: {
    upper: 300,
    lower: 100
  },
  [MetricsName.CLS]: {
    upper: 0.25,
    lower: 0.1
  },
  [MetricsName.TTFB]: {
    upper: 1800,
    lower: 800
  }
}
