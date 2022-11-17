import { CallAble } from './callbacks'

export * from './callbacks'

export interface IPerformanceMetricsConfig {
  reportCallback?: CallAble
  immediately?: boolean
}
