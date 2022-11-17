import {
  isPerformanceObserverSupported,
  isPerformanceSupported,
  NotSupportedError
} from '../utils'
import { MetricsName } from '../config'
import { observe } from '../utils/observe'
import { getFirstHiddenTime } from '../utils/onHiden'
import { IMetrics } from '../types/metrics'
import { getMetricsRating } from '../utils/rating'

const getFCPEntry = (): Promise<PerformanceEntry> => {
  return new Promise((resolve, reject) => {
    if (!isPerformanceObserverSupported()) {
      if (!isPerformanceSupported()) {
        reject(NotSupportedError('Performance object'))
      } else {
        const [entry] = performance.getEntriesByName(MetricsName.FCP)
        entry ? resolve(entry) : reject(new Error(MetricsName.FCP))
      }
    } else {
      const entryHandler = (entry: PerformanceEntry) => {
        if (entry.name === MetricsName.FCP) {
          po.disconnect()
          if (entry.startTime < getFirstHiddenTime().now) {
            resolve(entry)
          }
        }
      }

      const po = observe('paint', entryHandler)
    }
  })
}

export const handleGetFCP = async () => {
  try {
    const entry = await getFCPEntry()
    const metric: IMetrics = {
      name: MetricsName.FCP,
      value: entry.startTime,
      rating: getMetricsRating(MetricsName.FCP, entry.startTime),
      entry
    }

    console.log(metric)
  } catch (error) {
    console.error(error)
  }
}
