import { IMetrics } from '../types/metrics'

const __start__ = (mark: string) => `${mark}__s__`
const __end__ = (mark: string) => `${mark}__e__`

export class CustomMetricsHandler {
  // 不可被当作构造函数
  private constructor() {
    return null
  }

  private static hasMark(mark: string) {
    return performance.getEntriesByName(mark).length > 0
  }

  private static getMark(mark: string) {
    return performance.getEntriesByName(mark).pop()
  }

  private static setMark(mark: string) {
    return performance.mark(mark)
  }

  private static measure(mark: string) {
    performance.measure(mark, __start__(mark), __end__(mark))
    return performance.getEntriesByName(mark).pop()
  }

  private static clearMark(mark: string) {
    return performance.clearMarks(mark)
  }

  static setStartMark(mark: string) {
    this.setMark(__start__(mark))
  }

  static setEndMark(mark: string) {
    this.setMark(__end__(mark))

    if (this.hasMark(__start__(mark))) {
      const entry = this.measure(mark)

      this.clearMark(__start__(mark))
      this.clearMark(__end__(mark))

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
