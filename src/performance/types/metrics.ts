export enum MetricsRatingText {
  GOOD = 'good',
  ACCEPTABLE = 'acceptable',
  POOR = 'poor'
}

export interface IMetrics {
  /**
   * 指标名称 MetricsName
   */
  name: string
  /**
   * 原 PerformanceEntry 对象
   */
  entry?: PerformanceEntry | PerformanceEntry[]
  /**
   * 指标值 MetricsValue
   */
  value: any
  /**
   * 评分结果 MetricsRatingText
   */
  rating?: MetricsRatingText
}
