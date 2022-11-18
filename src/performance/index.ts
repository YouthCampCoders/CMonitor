import * as handlers from './handlers'
import { onShow } from './utils/pageLifeCycle'
import { createReporter } from './utils/reporter'
import { IPerformanceMetricsConfig } from './types'
import { MetricsStore } from './store'
import { NotSupportedError, isPerformanceSupported } from './utils'
import { getMetricsRating } from './utils/rating'
import { MetricsRating } from './config'

export class PerformanceMetrics {
  private store: MetricsStore = new MetricsStore()
  private reporter: ReturnType<typeof createReporter>
  private immediately = true

  constructor(config: IPerformanceMetricsConfig = {}) {
    const { reportCallback = console.log, immediately = true } = config

    this.immediately = immediately
    this.reporter = createReporter(reportCallback)

    this.initHandlers()

    console.log('CMonitor-SDK-Performance: Start Capture 🤗')
  }

  /**
   * 初始化各个指标的获取
   */
  initHandlers() {
    const { handleInitFCP, handleInitNT } = handlers

    onShow(() => {
      handleInitFCP(this.reporter, this.store, this.immediately)
      handleInitNT(this.reporter, this.store, this.immediately)
    })
  }

  /**
   * 自定义指标 startMark
   */
  startMark(mark: string) {
    if (!isPerformanceSupported()) {
      return console.error(NotSupportedError('Performance object').message)
    }

    handlers.CustomMetricsHandler.setStartMark(mark)
  }

  /**
   * 自定义指标 endMark
   */
  endMark(mark: string, ratingConfig?: typeof MetricsRating) {
    if (!isPerformanceSupported()) {
      return console.error(NotSupportedError('Performance object').message)
    }

    const metric = handlers.CustomMetricsHandler.setEndMark(mark)

    if (metric) {
      if (ratingConfig) {
        metric.rating = getMetricsRating(mark, metric.value, ratingConfig)
      }

      this.store.setState(mark, metric)

      if (this.immediately) {
        this.reporter(metric)
      }
    }
  }

  /**
   * 获取 store 种所有 metrics
   * */
  getAllMetricsInStore() {
    return this.store.getAllValues()
  }

  /**
   * 清除 store 种所有 metrics
   * */
  clearAllMetricsInStore() {
    this.store.clearState()
  }
}
