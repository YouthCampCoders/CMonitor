import {
  isPerformanceObserverSupported,
  isPerformanceSupported,
  NotSupportedError
} from '../utils'
import { MetricsName } from '../config'
import { observe } from '../utils/observe'
import { getFirstHiddenTime } from '../utils/pageLifeCycle'
import { IMetrics } from '../types/metrics'
import { getMetricsRating } from '../utils/rating'
import { ReporterCallBack } from '../types'
import { MetricsStore } from '../store'

/**
 * 获取 FCP PerformanceEntry
 */
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

/**
 * 初始化 FCP 获取
 */
export const handleInitFCP = async (
  reporter: ReporterCallBack,
  store: MetricsStore,
  immediately = true
) => {
  try {
    const entry = await getFCPEntry()
    const metric: IMetrics = {
      name: MetricsName.FCP,
      value: entry.startTime,
      rating: getMetricsRating(MetricsName.FCP, entry.startTime),
      entry
    }

    if (immediately) {
      reporter(metric)
    }

    store.setState(MetricsName.FCP, metric)
  } catch (error) {
    console.error(error)
  }
}
