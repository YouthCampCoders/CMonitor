import { MetricsRating } from '../config'

export type MetricsRatingCoustomConfig = typeof MetricsRating['x']

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

export interface IPerformanceNavigationTiming {
  redirect?: number // 重定向耗时
  request?: number // 请求耗时
  response?: number // 响应耗时
  DOMReady?: number // DOM 就绪耗时
  DOMParse?: number // DOM 解析耗时
  resource?: number // 资源加载耗时
  dns?: number
  tcp?: number
  ssl?: number
  TTFB?: number // Time To First Byte
}

export interface LayoutShiftAttribution {
  node?: Node
  previousRect: DOMRectReadOnly
  currentRect: DOMRectReadOnly
}

export interface ILayoutShift extends PerformanceEntry {
  value: number
  sources: LayoutShiftAttribution[]
  hadRecentInput: boolean
  total: number
}
