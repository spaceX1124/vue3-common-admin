import type { Ref } from 'vue'
import type { FormContext } from 'vee-validate'
import { ref, toRaw } from 'vue'

import type { ISchema } from '@/adapter'
import { isArray, isNullOrUndefOrEmpty, isUndef } from '@/utils/is'

// 表单的一些静态数据
interface IStaticState {
  gutters?: string; // 表单栅格间隔，控制表单项之间的间距
  gridCols?:string; // 表单栅格列数，控制一行展示几列
  labelPosition?: 'left' | 'right' | 'top'; // 表单label的位置
}

interface IFormMethods {
  handleSubmit?: (values: Record<string, any>) => void; // 表单提交的回调
}

export interface IFormMethodsProps extends IStaticState, IFormMethods {
  schema: ISchema[]
}

/**
 * 操作表单的一些方法
 * */
export class FormMethods {
  public form = {} as FormContext // vee-validate的表单实例对象
  public schema: Ref<ISchema[]> // 贯穿整个表单的JSON表单
  public staticState: Ref<IStaticState> // 表单的静态数据
  public callbackGroup: IFormMethods // 表单的回调方法
  constructor (options: IFormMethodsProps) {
    this.schema = ref(options.schema)
    this.staticState = ref({
      gridCols: options.gridCols || 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3', // 一行几列
      gutters: options.gutters || 'gap-x-4', // 表单项间距
      labelPosition: options.labelPosition || 'top' // label的位置
    })
    this.callbackGroup = {
      handleSubmit: options.handleSubmit
    }
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
    const { valid } = await this.form.validate()
    console.log('表单验证结果', valid)
    console.log('表单数据', this.getValues())
    if (!valid) {
      return
    }
    const rawValues = this.getValues() || {}
    // 执行外部方法，抛出验证成功的表单数据
    this.callbackGroup.handleSubmit && this.callbackGroup.handleSubmit(rawValues)
  }

  /**
   * 设置单个表单字段的数据
   * @param fieldKey 字段的键，用于找到要更新的数据对象
   * @param value 新的字段值，可以是任意类型
   * */
  setFieldValue (fieldKey: string, value: any) {
    console.log(value, 'valuer')
    this.form.setFieldValue(fieldKey, value)
  }

  /**
   * 设置多个表单字段的数据
   *@param fields Record
   * */
  setFieldsValue (fields: Record<string, any>) {
    // 根据数据结构fieldKey去设置
    const formData: Record<string, any> = {}
    this.schema.value.forEach(item => {
      if (item.fieldKeyArr && item.fieldKeyArr.length) {
        const arrData: any[] = []
        item.fieldKeyArr.forEach(i => {
          arrData.push(isNullOrUndefOrEmpty(fields[i]) ? '' : (isArray(fields[i]) ? fields[i] : String(fields[i])))
        })
        formData[item.fieldKey] = arrData
      } else {
        // 数组则直接赋值，非数组转成字符串
        formData[item.fieldKey] = isNullOrUndefOrEmpty(fields[item.fieldKey])
          ? ''
          : (isArray( fields[item.fieldKey]) ? fields[item.fieldKey] : String(fields[item.fieldKey]))
      }
    })
    this.form.setValues(formData)
  }

  /**
   * 获取整个表单的数据
   * */
  getValues () {
    const formData: Record<string, any> = {}
    const values = this.form.values
    this.schema.value.forEach(item => {
      // 多个key，需要设置它们对应的属性值
      if (item.fieldKeyArr && item.fieldKeyArr.length) {
        item.fieldKeyArr.forEach((key, i) => {
          if (values[item.fieldKey]) {
            formData[key] = values[item.fieldKey][i] || ''
          } else {
            formData[key] = ''
          }
        })
      } else {
        // 数组则直接赋值，非数组转成字符串
        formData[item.fieldKey] = isArray(values[item.fieldKey]) ? values[item.fieldKey] : String(values[item.fieldKey])
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
    const schema = this.schema.value.find(item => item.fieldKey === fieldKey)
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
    return this.schema.value.find(item => item.fieldKey === fieldKey)
  }
}
