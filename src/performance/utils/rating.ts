import { MetricsRating } from '../config'
import { MetricsRatingText } from '../types/metrics'

/**
 * 计算指标的分数
 */
export const getMetricsRating = (
  name: string,
  value: number
): MetricsRatingText => {
  const MetricsRatingConfig = MetricsRating[name]
  const { lower, upper } = MetricsRatingConfig

  return value > upper
    ? MetricsRatingText.POOR
    : value < lower
    ? MetricsRatingText.GOOD
    : MetricsRatingText.ACCEPTABLE
}
