import { IMetrics } from '../types/metrics'

export class MetricsStore {
  state: Map<string, IMetrics> = new Map<string, IMetrics>()

  setState(key: string, value: IMetrics) {
    this.state.set(key, value)
  }

  getState(key: string) {
    return this.state.get(key)
  }

  hasState(key: string) {
    return this.hasState(key)
  }

  clearState() {
    this.state.clear()
  }

  getAllValues() {
    return [...this.state].reduce((metrics, [key, value]) => {
      return Object.assign(metrics, { [key]: value })
    }, {} as Record<string, IMetrics>)
  }
}
