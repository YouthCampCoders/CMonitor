import { IMetrics, ReporterCallBack } from '../types'
import { MetricsStore } from '../store'
import {
  getFirstHiddenTime,
  getMetricsRating,
  isPerformanceObserverSupported,
  NotSupportedError,
  observe,
  onHidden
} from '../utils'
import { MetricsName } from '../config'

const getFIDEntry = (): Promise<PerformanceEventTiming> => {
  return new Promise((resolve, reject) => {
    if (isPerformanceObserverSupported()) {
      const entryHandler = (entry: PerformanceEventTiming) => {
        if (entry.startTime < getFirstHiddenTime().now) {
          po.disconnect()
        }

        resolve(entry)
      }

      const po = observe('first-input', entryHandler)

      onHidden(() => {
        po.takeRecords().map(entryHandler)
        po.disconnect()
      }, true)
    } else {
      reject(NotSupportedError('PerformanceObserver object'))
    }
  })
}

export const handleInitFID = async (
  reporter: ReporterCallBack,
  store: MetricsStore,
  immediately = true
) => {
  try {
    const entry = await getFIDEntry()
    const metric: IMetrics = {
      name: MetricsName.FID,
      value: entry.processingStart - entry.startTime,
      rating: getMetricsRating(
        MetricsName.FID,
        entry.processingStart - entry.startTime
      ),
      entry
    }

    if (immediately) {
      reporter(metric)
    }

    store.setState(MetricsName.FID, metric)
  } catch (error) {
    console.error(error)
  }
}
