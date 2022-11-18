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

const getLCPEntry = (): Promise<PerformanceEntry> => {
  return new Promise((resolve, reject) => {
    if (isPerformanceObserverSupported()) {
      const entryHandler = (entry: PerformanceEntry) => {
        if (entry.startTime < getFirstHiddenTime().now) {
          curEntry = entry
        }
      }

      const stopListening = () => {
        po.takeRecords().forEach((entry: PerformanceEntry) => {
          if (entry.startTime < getFirstHiddenTime().now) {
            curEntry = entry
          }
        })

        po.disconnect()

        resolve(curEntry)
      }

      const po = observe('largest-contentful-paint', entryHandler)
      let curEntry = {} as PerformanceEntry

      // 隐藏页面或用户交互后停止监听
      onHidden(stopListening, true)
      ;['keydown', 'click'].forEach((type: string) =>
        addEventListener(type, stopListening, { once: true, capture: true })
      )
    } else {
      reject(NotSupportedError('PerformanceObserver object'))
    }
  })
}

export const handleInitLCP = async (
  reporter: ReporterCallBack,
  store: MetricsStore,
  immediately = true
) => {
  try {
    const entry = await getLCPEntry()
    const metric: IMetrics = {
      name: MetricsName.LCP,
      value: entry.startTime,
      rating: getMetricsRating(MetricsName.LCP, entry.startTime),
      entry
    }

    if (immediately) {
      reporter(metric)
    }

    store.setState(MetricsName.LCP, metric)
  } catch (error) {
    console.error(error)
  }
}
