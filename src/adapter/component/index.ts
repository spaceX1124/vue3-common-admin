import {
  ElInput,
  ElButton,
  ElSelectV2,
  ElCheckboxGroup,
  ElCheckboxButton,
  ElCheckbox,
  ElRadioGroup,
  ElRadioButton,
  ElRadio,
  ElDatePicker,
  ElCascader
} from 'element-plus'
import { globalShareState } from '@/global/globalState'
import { h, type Component, type SetupContext } from 'vue'
import { ApiRadioGroup, IntervalInput, ApiCheckboxAll, ApiComponent, Upload, RadioSelect } from '@/packages/ui/forms'
import { isArray } from '@/packages/utils/is.ts'

/**
 * 将value处理成字符串
 * */
function dealDataList (arr: Record<string, any>[]) {
  return isArray(arr) ? arr.map(item => {
    return {
      ...item, value: item.value.toString()
    }
  }) : []
}

// 这里需要自行根据业务组件库进行适配，需要用到的组件都需要在这里类型说明
export type ComponentType =
    | 'Input'
    | 'Select'
    | 'ApiSelect'
    | 'CheckboxGroup'
    | 'ApiCheckboxAll'
    | 'RadioGroup'
    | 'ApiRadioGroup'
    | 'IntervalInput'
    | 'FormTitle'
    | 'SlotCustom'
    | 'Search'
    | 'DefaultButton'
    | 'DatePicker'
    | 'Upload'
    | 'Cascader'
    | 'RadioSelect'

// 这个函数可以处理初始的placeholder，不然在Form包中不好去处理
const withDefaultPlaceholder = <T extends Component>(
  component: T,
  txt: string
) => {
  return (props: any, { attrs, slots }: Omit<SetupContext, 'expose'>) => {
    const placeholder = props?.placeholder || txt
    return h(component, { ...props, ...attrs, placeholder }, slots)
  }
}

// 初始化组件适配器
export function initComponentAdapter () {
  const components: Partial<Record<ComponentType, Component>> = {
    Input: withDefaultPlaceholder(ElInput, '请输入'), // 输入框
    // 普通下拉框
    Select: (props, { attrs, slots }) => {
      return h(ElSelectV2, { ...props, options: dealDataList(props.options), attrs }, slots)
    },
    // 异步下拉框-可输入搜索
    ApiSelect: (props, { attrs, slots }) => {
      return h(ApiComponent, { ...props, ...attrs, component: ElSelectV2 }, slots)
    },
    // 普通复选框
    CheckboxGroup: (props, { attrs, slots }) => {
      let defaultSlot
      if (Reflect.has(slots, 'default')) {
        defaultSlot = slots.default
      } else {
        const { options, isButton } = attrs
        if (Array.isArray(options)) {
          defaultSlot = () =>
            dealDataList(options).map((option) =>
              h(isButton ? ElCheckboxButton : ElCheckbox, option)
            )
        }
      }
      return h(
        ElCheckboxGroup,
        { ...props, ...attrs },
        { ...slots, default: defaultSlot }
      )
    },
    // 复杂复选框-可异步/可全选
    ApiCheckboxAll: (props, { attrs, slots }) => {
      return h(ApiCheckboxAll, { ...props, ...attrs }, slots)
    },
    // 普通单选
    RadioGroup: (props, { attrs, slots }) => {
      let defaultSlot
      if (Reflect.has(slots, 'default')) {
        defaultSlot = slots.default
      } else {
        const { options } = attrs
        if (Array.isArray(options)) {
          defaultSlot = () =>
            dealDataList(options).map((option) =>
              h(attrs.isButton ? ElRadioButton : ElRadio, option)
            )
        }
      }
      return h(
        ElRadioGroup,
        { ...props, ...attrs },
        { ...slots, default: defaultSlot }
      )
    },
    // 单选-支持异步/支持选中取消
    ApiRadioGroup: (props, { attrs, slots }) => {
      return h(ApiRadioGroup, { ...props, ...attrs }, slots)
    },
    // 区间输入
    IntervalInput: (props, { attrs, slots }) => {
      return h(
        IntervalInput,
        {
          ...props,
          ...attrs,
          component: IntervalInput
        },
        slots
      )
    },
    // 自定义默认按钮
    DefaultButton: (props, { attrs, slots }) => {
      return h(ElButton, { ...props, attrs }, slots)
    },
    // 日期/日期区间
    DatePicker: (props, { attrs, slots }) => {
      const { name, type } = props
      const extraProps: Recordable<any> = {}
      if (type && type.includes('range')) {
        if (name && !Array.isArray(name)) {
          extraProps.name = [name, `${name}_end`]
        }
      }
      return h(
        ElDatePicker,
        {
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          ...props,
          ...attrs,
          ...extraProps
        },
        slots
      )
    },
    // 上传
    Upload: (props, { attrs, slots }) => {
      return h(Upload, { ...props, ...attrs }, slots)
    },
    // 级联选择器
    Cascader: (props, { attrs, slots }) => {
      return h(ElCascader, { ...props, options: dealDataList(props.options), attrs }, slots)
    },

    // 单选框结合下拉框
    RadioSelect: (props, { attrs, slots }) => {
      return h(RadioSelect, { ...props, ...attrs }, slots)
    }
  }
  globalShareState.setComponents(components)
}