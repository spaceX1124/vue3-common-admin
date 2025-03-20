import { ElInput, ElSelectV2, ElCheckbox, ElCheckboxGroup, ElCheckboxButton, ElRadio, ElRadioGroup, ElRadioButton } from 'element-plus'
import { globalShareState } from '@/global/globalState'
import { h, ref, type Component, type SetupContext } from 'vue'
import { ApiSelect, CheckboxGroupAll, ApiCheckboxGroup, ApiRadioGroup, IntervalInput } from '@/packages/Forms'

// 这里需要自行根据业务组件库进行适配，需要用到的组件都需要在这里类型说明
export type ComponentType =
    | 'Input'
    | 'Select'
    | 'ApiSelect'
    | 'ApiCheckboxGroup'
    | 'CheckboxGroupAll'
    | 'CheckboxGroup'
    | 'RadioGroup'
    | 'ApiRadioGroup'
    | 'IntervalInput'

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
    Select: withDefaultPlaceholder(ElSelectV2, '请选择'), // 普通下拉
    // 异步下拉
    ApiSelect: (props, { attrs, slots }) => {
      return h(
        ApiSelect,
        {
          placeholder: '请选择',
          ...props,
          ...attrs,
          component: ApiSelect
        },
        slots
      )
    },
    // 异步复选框
    ApiCheckboxGroup: (props, { attrs, slots }) => {
      return h(
        ApiCheckboxGroup,
        {
          ...props,
          ...attrs,
          component: ApiCheckboxGroup
        },
        slots
      )
    },
    // 复选框-带全选（包含异步）
    CheckboxGroupAll: (props, { attrs, slots }) => {
      return h(
        CheckboxGroupAll,
        {
          ...props,
          ...attrs,
          component: CheckboxGroupAll
        },
        slots
      )
    },
    // 复选框
    CheckboxGroup: (props, { attrs, slots }) => {
      let defaultSlot
      if (Reflect.has(slots, 'default')) {
        defaultSlot = slots.default
      } else {
        const { options, isButton } = attrs
        if (Array.isArray(options)) {
          defaultSlot = () =>
            options.map((option) =>
              h(isButton ? ElCheckboxButton : ElCheckbox, option)
            )
        }
      }
      return h(ElCheckboxGroup, { ...props, ...attrs }, { ...slots, default: defaultSlot })
    },
    // 单选框
    RadioGroup: (props, { attrs, slots }) => {
      let defaultSlot
      if (Reflect.has(slots, 'default')) {
        defaultSlot = slots.default
      } else {
        const { options } = attrs
        if (Array.isArray(options)) {
          defaultSlot = () =>
            options.map((option) =>
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
    // 异步单选框
    ApiRadioGroup: (props, { attrs, slots }) => {
      return h(
        ApiRadioGroup,
        {
          ...props,
          ...attrs,
          component: ApiRadioGroup
        },
        slots
      )
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
    }
  }
  globalShareState.setComponents(components)
}