import * as handlers from './handlers'
import { onShow } from './utils/pageLifeCycle'
import { createReporter } from './utils/reporter'
import { IPerformanceMetricsConfig } from './types'
import { MetricsStore } from './store'

export class PerformanceMetrics {
  instance: PerformanceMetrics
  reporter: ReturnType<typeof createReporter>
  store: MetricsStore = new MetricsStore()
  immediately = true

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
    const { handleInitFCP } = handlers

    onShow(() => {
      handleInitFCP(this.reporter, this.store, this.immediately)
    })
  }

  /**
   * 自定义指标 startMark
   */
  startMark(mark: string) {
    handlers.CustomerMetricsHandler.setStartMark(mark)
  }

  /**
   * 自定义指标 endMark
   */
  endMark(mark: string) {
    const metric = handlers.CustomerMetricsHandler.setEndMark(mark)

    if (metric) {
      this.store.setState(mark, metric)

      if (this.immediately) {
        this.reporter(metric)
      }
    }
  }
}
