import { ref, type Ref } from 'vue'
import type { FormContext } from 'vee-validate'
import type { ISchema } from '@/adapter'

// 表单的一些静态数据
interface IStaticState {
  wrapperClass?: string; // 表单栅格布局
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
      wrapperClass: options.wrapperClass || 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      labelPosition: options.labelPosition || 'top'
    })
    this.callbackGroup = {
      handleSubmit: options.handleSubmit
    }
  }
  // 将vee-validate的useForm的实例传入
  mount (formContext: FormContext) {
    Object.assign(this.form, formContext)
  }
  // 提交表单
  async submit () {
    console.log(this.form.values, 'formData')
    const { valid } = await this.form.validate()
    if (!valid) {
      return
    }
    // 执行外部方法，抛出验证成功的表单数据
    this.callbackGroup.handleSubmit && this.callbackGroup.handleSubmit(this.form.values)
  }
  // 设置单个字段的值
  setFieldValue (fieldKey: string, value: any) {
    this.form.setFieldValue(fieldKey, value)
  }
  // 校验单个字段
  async validField (fieldKey: string) {
    const validateResult = await this.form.validateField(fieldKey)
    if (Object.keys(validateResult?.errors ?? {}).length > 0) {
      console.error('validate error', validateResult?.errors)
    }
    return validateResult
  }
  /**
   * 更新指定字段的值
   * @param fieldKey 字段的键，用于找到要更新的数据对象
   * @param key 字段的键，用于标识需要更新的字段
   * @param value 新的字段值，可以是任意类型
   */
  updateField (fieldKey: string, key: string, value: any) {
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
      current[lastKey as keyof ISchema] = value as never
    } catch {
      console.warn(`路径 ${key} 赋值失败`)
    }
  }
}
