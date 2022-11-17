import {
  isPerformanceObserverSupported,
  isPerformanceSupported
} from '../utils'
import { MetricsName } from '../config'
import { observe } from '../utils/observe'
import { getFirstHiddenTime } from '../utils/onHiden'

const getFCPEntry = (): Promise<PerformanceEntry> => {
  return new Promise((resolve, reject) => {
    if (!isPerformanceObserverSupported()) {
      if (!isPerformanceSupported()) {
        reject(new Error('browser do not support Performance object'))
      } else {
        const [entry] = performance.getEntriesByName(MetricsName.FCP)

        entry ? resolve(entry) : reject(new Error('browser do not support FCP'))
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
    console.log(entry)
  } catch (error) {
    console.error(error)
  }
}
