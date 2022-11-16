/**
 * 检测当前环境是否支持 performance
 */
export const isPerformanceSupported = () => {
  return Boolean(window?.performance?.getEntries)
}

/**
 * 检测当前环境是否支持 performanceObserver
 */
export const isPerformanceObserverSupported = () => {
  return Boolean(window?.PerformanceObserver)
}
