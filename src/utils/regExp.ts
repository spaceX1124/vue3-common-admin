/**
 * 正则表达式集合
 * */
export default {
  number: /^\d+$/, // 纯数字
  integer: /^-?\d+$/, // 整数（可以为负数和0）
  positiveInteger: /^[1-9]\d*$/, // 正整数（不包括零）
  notInteger: /^(0|[1-9]\d*)$/, // 非负整数（包括零）
  positiveFloatingDigit1: /^(0|[1-9]\d*)\.\d+$/, // 正的小数（包含小数点，且小数部分至少有一位）
  positiveFloatingDigit2: /^(0|[1-9]\d*)\.\d{1,2}$/, // 正的小数限制位数（包含小数点，且小数部分最多2位）
  positiveFloatingDigit3: /^\d+(\.\d+)?$/, // 非负小数（包括零，且小数部分至少有一位）
  positiveFloatingDigit4: /^\d+(\.\d{1,2})?$/, // 非负小数限制位数（包括零，且小数部分最多2位）
  rangeNumber: /^(100|[1-9]?\d)$/, // 数字在1到100之间，包含1和100
  length: /^\d{6}$/, // 固定数字长度6位
  phone: /^1[3|4|5|6|7|8|9][0-9]{9}$/, // 手机号
  email: /^\w+@[a-zA-Z0-9]+((\.[a-z0-9A-Z]{1,})+)$/, // 邮箱
  idCard: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, // 身份证号
  fullName: /^[\u00B7\u3007\u3400-\u9FFF\uE000-\uF8FF\uF900-\uFAFF\u{20000}-\u{2FFFF}\u{30000}-\u{3FFFF}]+$/u // 中文
}