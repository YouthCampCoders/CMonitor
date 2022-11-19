import { MetricsRating } from '../config'
import { MetricsRatingText } from '../types/metrics'

/**
 * 计算指标的分数
 */
export const getMetricsRating = (
  name: string,
  value: number,
  customConfig?: typeof MetricsRating
): MetricsRatingText => {
  const ratingConfig = { ...MetricsRating, ...customConfig }
  const MetricsRatingConfig = ratingConfig[name]
  const { lower, upper } = MetricsRatingConfig

  return value > upper
    ? MetricsRatingText.POOR
    : value < lower
    ? MetricsRatingText.GOOD
    : MetricsRatingText.ACCEPTABLE
}
