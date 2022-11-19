import { PerformanceEntryCallBack } from '../types'

/**
 * 逐一监听 PerformanceEntry
 */
export const observe = (
  type: string,
  callback: PerformanceEntryCallBack
): PerformanceObserver | undefined => {
  if (PerformanceObserver.supportedEntryTypes.includes(type)) {
    const po = new PerformanceObserver((list) =>
      list.getEntries().map(callback)
    )

    po.observe({ type, buffered: true })
    return po
  }
}
