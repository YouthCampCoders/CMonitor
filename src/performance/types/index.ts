import { CallableObject } from './callbacks'

export * from './callbacks'
export * from './metrics'
export * from './report'

export interface IPerformanceMetricsConfig {
  reportCallback?: CallableObject
  immediately?: boolean
}
