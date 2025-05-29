import { type Ref, ref } from 'vue'
import type { FormContext } from 'vee-validate'

import type { ISchema } from '@/adapter'
import { isArray, isFunc, isNullOrUndefOrEmpty, isUndef } from '@/utils/is'

/**
 * sm - min-width: 640px
 * md - min-width: 768px
 * lg - min-width: 1024px
 * xl - min-width: 1280px
 * 2xl - min-width: 1536px
 * */
// 表单的一些静态数据
interface IStaticState {
  gutters?: string; // 表单栅格间隔，控制表单项之间的间距
  gridCols?:string; // 表单栅格列数，控制一行展示几列 如grid-cols-1 md:grid-cols-2 lg:grid-cols-3，宽度大于lg展示3个，大于md小于lg展示2个，小于md，展示一个
  labelPosition?: 'left' | 'right' | 'top'; // 表单label的位置
  hideLabel?: boolean; // 隐藏所有表单项label
}

interface IFormMethods {
  handleSubmit?: (values: Record<string, any>) => void; // 表单提交的回调
}

export interface IFormMethodsProps extends IStaticState, IFormMethods {
  schema: ISchema[];
  isSearch?: boolean; // 是否用于搜索表单
  showCollapseButton?: boolean; // 是否显示折叠按钮
  collapsedRows?: number; // 从第几行开始折叠
}

/**
 * 操作表单的一些方法
 * */
export class FormMethods {
  public form = {} as FormContext // vee-validate的表单实例对象
  public schema: Ref<ISchema[]> // 贯穿整个表单的JSON表单
  public staticState: Ref<IStaticState> // 表单的静态数据
  public callbackGroup: IFormMethods // 表单的回调方法
  public isSearch: boolean = false // 是否用于搜索表单
  public showCollapseButton: boolean = false // 是否显示折叠按钮
  public collapsedRows: number = 1 // 从第几行开始折叠
  public isCollapsed: Ref<boolean> = ref(true) // 当前折叠状态
  constructor (options: IFormMethodsProps) {
    this.schema = ref(options.schema)
    this.staticState = ref({
      gridCols: options.gridCols || 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3', // 一行几列
      gutters: options.gutters || 'gap-x-4', // 表单项间距
      labelPosition: options.labelPosition || 'top', // label的位置
      hideLabel: options.hideLabel || false // 隐藏所有表单项label
    })
    this.callbackGroup = {
      handleSubmit: options.handleSubmit
    }
    this.isSearch = options.isSearch || false
    this.showCollapseButton = options.showCollapseButton || false
    this.collapsedRows = options.collapsedRows || 1
    this.isCollapsed = ref(true)
  }
  // 将vee-validate的useForm的实例传入
  mount (formContext: FormContext) {
    console.log(formContext, 'formContext', this)
    Object.assign(this.form, formContext)
  }

  /**
   * 提交表单
   * */
  async submit () {
    console.log('表单数据', this.getValues())
    const { valid } = await this.form.validate()
    console.log('表单验证结果', valid)
    if (!valid) {
      return
    }
    const rawValues = this.getValues() || {}
    // 执行外部方法，抛出验证成功的表单数据
    this.callbackGroup.handleSubmit && this.callbackGroup.handleSubmit(rawValues)
    return rawValues
  }

  /**
   * 设置单个表单字段的数据
   * @param fieldKey 字段的键，用于找到要更新的数据对象
   * @param value 新的字段值，可以是任意类型
   * */
  setFieldValue (fieldKey: string, value: any) {
    this.form.setFieldValue(fieldKey, value)
  }

  /**
   * 清除单个表单字段的数据
   * @param fieldKey 字段的键，用于找到要更新的数据对象
   * */
  clearFieldValue (fieldKey: string) {
    this.form.resetField(fieldKey)
  }

  /**
   * 设置多个表单字段的数据
   *@param fields Record
   * */
  setFieldsValue (fields: Record<string, any>) {
    // 根据数据结构fieldKey去设置
    const formData: Record<string, any> = {}
    this.schema.value.forEach(item => {
      if ((this.isSearch && item.useSearch) || (!this.isSearch && item.useForm)) {
        // 多个key，组装到一个字段中显示
        if (item.fieldKeyArr && item.fieldKeyArr.length) {
          const arrData: any[] = []
          item.fieldKeyArr.forEach((key, index) => {
            const val = fields[key]
            const newVal = isArray(val) ? val.join(',') : String(val)
            // 是否需要处理值的格式化
            const formatVal = item.valueFormatter && item.valueFormatter.from && !isNullOrUndefOrEmpty(val)
              ?
              item.valueFormatter.from({ val, index }) // 如果是fieldKeyArr，告诉外面格式化第几个，外部好判断
              :
              !isNullOrUndefOrEmpty(val) ? newVal : ''

            arrData.push(formatVal)
          })
          formData[item.fieldKey] = arrData
        } else {
          // 考虑如何处理如数据是{a:{b: 1}}， fieldKey = 'a.b'
          const keys = item.fieldKey.split('.')
          if (keys.length > 1) {
            const lastKey: string = keys.pop() as string
            let current = formData
            keys.forEach(key => {
              if (!current[key]) {
                current[key] = {}
              }
              current = current[key]
            })
            const values = keys.reduce((obj, key) => obj?.[key], fields)
            const val = values ? values[lastKey] : ''
            const newVal = isArray(val) ? val.join(',') : String(val)
            // 值统一处理成字符串，如果需要特殊处理，请用valueFormatter
            current[lastKey] = item.valueFormatter && item.valueFormatter.from && !isNullOrUndefOrEmpty(val)
              ? item.valueFormatter.from(val)
              :
              !isNullOrUndefOrEmpty(val) ? newVal : ''
          } else {
            const val = fields[item.fieldKey]
            let newVal
            // 如果是多选，则要数组
            const multiple = item.componentProps?.multiple
            if (multiple) {
              newVal = !isNullOrUndefOrEmpty(val) ? isArray(val) ? val : val.split(',') : []
            } else {
              newVal = isArray(val) ? val.join(',') : String(val)
            }
            formData[item.fieldKey] = item.valueFormatter && item.valueFormatter.from && !isNullOrUndefOrEmpty(val)
              ? item.valueFormatter.from(val)
              :
              !isNullOrUndefOrEmpty(val) ? newVal : ''
          }
        }
      }

    })
    console.log(formData, 'formData11')
    this.form.setValues(formData)
  }

  /**
   * 获取整个表单的数据
   * */
  getValues () {
    const formData: Record<string, any> = {}
    const values = this.form.values
    console.log(values, 'values123')
    this.schema.value.forEach(item => {
      // 搜索表单只取搜索字段 || 新增表单取非隐藏字段
      if((this.isSearch && item.useSearch) || (!this.isSearch && item.useForm)) {
        // 多个key，需要设置它们对应的属性值
        if (item.fieldKeyArr && item.fieldKeyArr.length) {
          item.fieldKeyArr.forEach((key, index) => {
            // 多个key，对应值（values[item.fieldKey]）必须是个数组
            if (values[item.fieldKey] && isArray(values[item.fieldKey])) {
              const val = values[item.fieldKey][index]
              // 值统一处理成字符串，如果需要特殊处理，请用valueFormatter
              const newVal = isArray(val) ? val.join(',') : String(val)
              // 是否需要处理值的格式化
              formData[key] = item.valueFormatter && item.valueFormatter.to && !isNullOrUndefOrEmpty(val)
                ?
                item.valueFormatter.to({ val, index }) // 如果是fieldKeyArr，告诉外面格式化第几个，外部好判断
                :
                !isNullOrUndefOrEmpty(val) ? newVal : ''
            } else {
              formData[key] = ''
            }
          })
        } else {
          const keys = item.fieldKey.split('.') // 考虑'a.b'
          // keys长度大于1才能去处理，不然const value = keys.reduce((obj, key) => obj[key], values)要报错
          if (keys.length > 1) {
            // 从values中获取对应的值
            const value = keys.reduce((obj, key) => obj?.[key], values)
            // 值统一处理成字符串，如果需要特殊处理，请用valueFormatter
            let newVal = isArray(value) ? value.join(',') : String(value)
            // 是否需要处理值的格式化
            if (item.valueFormatter && item.valueFormatter.to) {
              newVal = item.valueFormatter.to(value)
            }
            // 将值设置到formData的对应位置
            let current = formData
            for (let i = 0; i < keys.length - 1; i++) {
              const key = keys[i]
              // 如果当前层不存在，则创建空对象
              current[key] = current[key] || {}
              current = current[key]
            }
            current[keys[keys.length - 1]] = newVal
          } else {
            const val = values[item.fieldKey]
            const newVal = isArray(val) ? val.join(',') : String(val)
            // 是否需要处理值的格式化
            formData[item.fieldKey] = item.valueFormatter && item.valueFormatter.to && !isNullOrUndefOrEmpty(val)
              ?
              item.valueFormatter.to(val) // 如果是fieldKeyArr，告诉外面格式化第几个，外部好判断
              :
              !isNullOrUndefOrEmpty(val) ? newVal : ''
          }
        }
      }
    })
    return formData
  }

  /**
   * 校验单个字段
   * @param fieldKey 字段的键，用于找到要验证的数据对象
   * */
  async validField (fieldKey: string) {
    return await this.form.validateField(fieldKey)
  }

  /**
   * 更新指定字段的属性值
   * @param fieldKey 字段的键，用于找到要更新的数据对象
   * @param key 字段的键，用于标识需要更新的字段
   * @param value 新的字段值，可以是任意类型，如果是undefined，则删除该属性
   */
  updateFieldProperty (fieldKey: string, key: string, value: any) {
    if (!key) return
    // 找对象，必须要加这些判断，否则可能出现多个相同的fieldKey
    const schema = this.schema.value.find(item => item.fieldKey === fieldKey
        && ((this.isSearch && item.useSearch)
        ||
        (!this.isSearch && item.useForm)))
    if (!schema) return
    // 拆分嵌套属性路径
    const pathParts = key?.split('.')
    let current = schema
    // 非嵌套直接赋值
    if (pathParts.length === 1) {
      schema[key as keyof ISchema] = value as never
      return
    }
    // 嵌套属性处理
    try {
      for (let i = 0; i < pathParts.length - 1; i++) {
        const part = pathParts[i]
        // 如果没得这个属性就新增，
        if (!current[part as keyof ISchema]) {
          current[part as keyof ISchema] = {} as never
        }
        current = current[part as keyof ISchema] as never
      }
      const lastKey = pathParts[pathParts.length - 1]
      // 根据链路找到最后一级属性，并赋值
      if (isUndef(value)){
        delete current[lastKey as keyof ISchema]
        return
      }
      current[lastKey as keyof ISchema] = value as never
    } catch {
      console.warn(`路径 ${key} 赋值失败`)
    }
  }

  /**
   * 更新表单的布局，间距，label的位置
   * */
  updateFormLayout (options: IStaticState) {
    this.staticState.value = {
      ...this.staticState.value,
      ...options
    }
  }

  /**
   * 获取字段
   * @param fieldKey 字段的键
   * */
  getField (fieldKey: string) {
    return this.schema.value.find(item => item.fieldKey === fieldKey
        &&
        ((this.isSearch && item.useSearch) || (!this.isSearch && item.useForm)))
  }
  /**
   * 获取单个表单值
   * @param fieldKey 字段的键
   * */
  getFieldValue (fieldKey: string) {
    // @todo， 考虑一下'a.b'
    return this.form.values[fieldKey]
  }

  /**
   * 设置表单折叠状态
   * */
  setCollapse (collapse: boolean) {
    this.isCollapsed.value = collapse
  }

  /**
   * 设置schema的JSON数据
   * */
  setSchema (schema: ISchema[]) {
    this.schema.value = schema
  }

  /**
   * 清空表单数据
   * */
  clearForm () {
    this.form.resetForm()
  }
}
