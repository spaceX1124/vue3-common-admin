/**
 * 单位转换
 * */

import BigNumber from 'bignumber.js'

type UnitType = 'fen' | 'yuan' | 'wan';
type ConvertOptions = {
  precision?: number; // 精度
  allowNegative?: boolean; // 是否允许负数
  defaultValue?: number; // 默认值
};
/**
 * 万，元，分转换
 */
export function moneyTransform (
  value: string | number,
  fromUnit: UnitType,
  toUnit: UnitType,
  options: ConvertOptions = {}
) {
  const { precision = 2, allowNegative = false, defaultValue = 0 } = options

  try {
    // 输入清洗（兼容千分位和单位符号）
    const cleanValue = String(value)
    .replace(/[^0-9.-]/g, '')
    .replace(/,/g, '')
    .replace(/[元万]/g, '')

    const numericValue = new BigNumber(cleanValue)

    // 输入验证
    if (numericValue.isNaN() || !numericValue.isFinite()) return defaultValue
    if (!allowNegative && numericValue.isNegative()) return defaultValue

    // 单位转换计算
    let result = numericValue
    switch (`${fromUnit}=>${toUnit}`) {
      case 'fen=>yuan':
        result = numericValue.dividedBy(100)
        break
      case 'yuan=>wan':
        result = numericValue.dividedBy(10000)
        break
      case 'fen=>wan':
        result = numericValue.dividedBy(1000000)
        break
      case 'wan=>yuan':
        result = numericValue.times(10000)
        break
      case 'yuan=>fen':
        result = numericValue.times(100)
        break
      case 'wan=>fen':
        result = numericValue.times(1000000)
        break
      default:
        throw new Error('Unsupported unit conversion')
    }

    // 精度处理与格式化
    return Number(
      result.toFormat(precision, BigNumber.ROUND_HALF_UP, {
        decimalSeparator: '.',
        groupSeparator: ''
      })
    )
  } catch (error) {
    console.error('[Amount Converter]', error)
    return defaultValue
  }
}
