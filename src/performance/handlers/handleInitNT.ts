import { IMetrics, ReporterCallBack } from '../types'
import { MetricsStore } from '../store'
import {
  isPerformanceObserverSupported,
  isPerformanceSupported,
  isPerformanceTimingSupported,
  NotSupportedError,
  formatNumberDigit
} from '../utils'
import { IPerformanceNavigationTiming } from '../types'
import { observe } from '../utils/observe'
import { MetricsName } from '../config'

const handleTimingMeticsFormat = (target: IPerformanceNavigationTiming) => {
  const clone: IPerformanceNavigationTiming = {}

  Object.keys(target).forEach((key: string) => {
    clone[key] = formatNumberDigit(target[key])
  })

  return clone
}

const handleTimingMetrics = (entry: PerformanceNavigationTiming) => {
  const {
    startTime,
    redirectStart,
    redirectEnd,
    fetchStart,
    domainLookupStart,
    domainLookupEnd,
    connectStart,
    connectEnd,
    requestStart,
    responseStart,
    responseEnd,
    secureConnectionStart,
    domInteractive,
    domContentLoadedEventStart,
    domContentLoadedEventEnd,
    domComplete
  } = entry

  return handleTimingMeticsFormat({
    redirect: redirectEnd - redirectStart,
    request: responseStart - requestStart,
    response: responseEnd - responseStart,
    resource: domComplete - domContentLoadedEventStart,
    ssl: connectEnd - secureConnectionStart,
    tcp: connectEnd - connectStart,
    dns: domainLookupEnd - domainLookupStart,
    DOMParse: domInteractive - responseEnd,
    DOMReady: domContentLoadedEventEnd - fetchStart,
    TTFB: responseStart - startTime
  })
}

const getNavigationTiming = (): Promise<IMetrics> => {
  return new Promise((resolve, reject) => {
    if (
      isPerformanceObserverSupported() &&
      PerformanceObserver.supportedEntryTypes.includes('navigation')
    ) {
      const entryHandler = (entry: PerformanceNavigationTiming) => {
        if (entry.entryType === 'navigation') {
          po.disconnect()

          const temp = handleTimingMetrics(entry)

          resolve({
            name: MetricsName.NT,
            value: temp,
            entry
          })
        }
      }

      const po = observe('navigation', entryHandler)
    } else if (isPerformanceSupported()) {
      const entry = performance.getEntriesByType(
        'navigation'
      )?.[0] as PerformanceNavigationTiming

      const temp = handleTimingMetrics(entry)

      resolve({
        name: MetricsName.NT,
        value: temp,
        entry
      })
    } else if (isPerformanceTimingSupported()) {
      const entry = performance.timing as unknown as PerformanceNavigationTiming

      const temp = handleTimingMetrics(entry)

      resolve({
        name: MetricsName.NT,
        value: temp,
        entry
      })
    } else {
      reject(NotSupportedError('performance navigation timing'))
    }
  })
}

export const handleInitNT = async (
  reporter: ReporterCallBack,
  store: MetricsStore,
  immediately = true
) => {
  try {
    const metric = await getNavigationTiming()
    const TTFBMetric =
      metric.value?.TTFB &&
      ({
        name: MetricsName.TTFB,
        entry: metric.entry,
        value: metric.value?.TTFB
      } as IMetrics)

    if (immediately) {
      reporter(metric)
      TTFBMetric && reporter(TTFBMetric)
    }

    store.setState(MetricsName.NT, metric)
    TTFBMetric && store.setState(MetricsName.TTFB, TTFBMetric)
  } catch (error) {
    console.error(error)
  }
}
