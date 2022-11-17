import { CallAble } from '../types'
import { IMetrics } from '../types/metrics'
import { IReportData } from '../types/report'

/**
 * 生成报告工具
 */
export const createReporter = (callback: CallAble) => {
  return (data: IMetrics) => {
    const reportData: IReportData = {
      data,
      timestamp: Date.now()
    }

    callback(reportData)
  }
}
