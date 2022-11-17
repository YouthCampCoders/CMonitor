import { IMetrics } from '../types/metrics'
import { isPerformanceSupported, NotSupportedError } from '../utils'

export class CustomerMetricsHandler {
  private constructor() {
    return null
  }

  private static hasMark(mark: string) {
    if (!isPerformanceSupported()) {
      return console.error(NotSupportedError('Performance object').message)
    }

    return performance.getEntriesByName(mark).length > 0
  }

  private static getMark(mark: string) {
    if (!isPerformanceSupported()) {
      return console.error(NotSupportedError('Performance object').message)
    }

    return performance.getEntriesByName(mark).pop()
  }

  private static setMark(mark: string) {
    if (!isPerformanceSupported()) {
      return console.error(NotSupportedError('Performance object').message)
    }

    return performance.mark(mark)
  }

  private static measure(mark: string) {
    if (!isPerformanceSupported()) {
      return console.error(NotSupportedError('Performance object').message)
    }

    performance.measure(mark, `${mark}__s__`, `${mark}__e__`)
    return performance.getEntriesByName(mark).pop()
  }

  private static clearMark(mark: string) {
    if (!isPerformanceSupported()) {
      return console.error(NotSupportedError('Performance object').message)
    }

    return performance.clearMarks(mark)
  }

  static setStartMark(mark: string) {
    this.setMark(`${mark}__s__`)
  }

  static setEndMark(mark: string) {
    this.setMark(`${mark}__e__`)

    if (this.hasMark(`${mark}__s__`)) {
      const entry = this.measure(mark)

      this.clearMark(`${mark}__s__`)
      this.clearMark(`${mark}__e__`)

      const metric: IMetrics = {
        name: mark,
        value: entry && entry.duration
      }

      if (entry) {
        Object.assign(metric, { entry })
      }

      return metric
    } else {
      console.warn(`Please run setStart of metric "${mark}" first`)
      return
    }
  }
}
