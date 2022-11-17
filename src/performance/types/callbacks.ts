import { createReporter } from '../utils/reporter'

export type CallAble = (...arg: any[]) => any
export type EventCallBack = (event: Event) => void
export type PerformanceEntryCallBack = (entry: PerformanceEntry) => void
export type ReporterCallBack = ReturnType<typeof createReporter>
