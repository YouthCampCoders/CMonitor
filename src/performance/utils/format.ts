/**
 * 更改小数位保留
 */
export const formatNumberDigit = (n: number, digit = 2) => {
  return n.toFixed(digit)
}
