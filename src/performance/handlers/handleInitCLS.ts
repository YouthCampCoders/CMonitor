import { ReporterCallBack, ILayoutShift, IMetrics } from '../types'
import { MetricsStore } from '../store'
import {
  getMetricsRating,
  isPerformanceObserverSupported,
  NotSupportedError,
  observe,
  onHidden
} from '../utils'
import { MetricsName } from '../config'

const getCLSEntry = (): Promise<ILayoutShift> => {
  return new Promise((resolve, reject) => {
    if (isPerformanceObserverSupported()) {
      const entryHandler = (entry: ILayoutShift) => {
        if (!entry.hadRecentInput) {
          temp += entry.value
          curEntry = entry
        }
      }

      const stopListening = () => {
        po.takeRecords().forEach((entry: ILayoutShift) => {
          if (!entry.hadRecentInput) {
            temp += entry.value
            curEntry = entry
          }
        })

        po.disconnect()

        curEntry.total = temp
        resolve(curEntry)
      }

      const po = observe('layout-shift', entryHandler)

      let curEntry = {} as ILayoutShift
      let temp = 0

      onHidden(stopListening, true)
    } else {
      reject(NotSupportedError('PerformanceObserve object'))
    }
  })
}

export const handleInitCLS = async (
  reporter: ReporterCallBack,
  store: MetricsStore,
  immediately = true
) => {
  try {
    const entry = await getCLSEntry()
    const metric: IMetrics = {
      name: MetricsName.CLS,
      value: entry.total,
      rating: getMetricsRating(MetricsName.CLS, entry.total),
      entry
    }

    store.setState(MetricsName.CLS, metric)

    if (immediately) {
      reporter(metric)
    }
  } catch (error) {
    console.error(error)
  }
}
