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

/**
 * 检测当前环境是否支持 performance.timing
 */
export const isPerformanceTimingSupported = () => {
  return Boolean(window?.performance?.timing)
}

/**
 * 检查支持情况报错
 */
export const NotSupportedError = (target: string): Error => {
  const err = new Error(`Browser do not support ${target}`)

  err.name = 'NotSupportedError'

  return err
}
