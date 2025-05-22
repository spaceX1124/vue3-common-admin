import { ElInput, ElButton } from 'element-plus'
import { globalShareState } from '@/global/globalState'
import { h, type Component, type SetupContext } from 'vue'
import { Select, RadioGroup, IntervalInput, CheckboxGroup, DatePicker } from '@/packages/Forms'

// 这里需要自行根据业务组件库进行适配，需要用到的组件都需要在这里类型说明
export type ComponentType =
    | 'Input'
    | 'Select'
    | 'CheckboxGroup'
    | 'RadioGroup'
    | 'IntervalInput'
    | 'FormTitle'
    | 'SlotCustom'
    | 'Search'
    | 'DefaultButton'
    | 'DatePicker'

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
    // 下拉-支持单选，多选，异步
    Select: (props, { attrs, slots }) => {
      return h(
        Select,
        {
          placeholder: '请选择',
          ...props,
          ...attrs,
          component: Select
        },
        slots
      )
    },
    // 复选框-带全选（可异步），将异步和同步写在一个组件中，因为有全选操作
    CheckboxGroup: (props, { attrs, slots }) => {
      return h(
        CheckboxGroup,
        {
          ...props,
          ...attrs,
          component: CheckboxGroup
        },
        slots
      )
    },
    // 单选-支持异步
    RadioGroup: (props, { attrs, slots }) => {
      return h(
        RadioGroup,
        {
          ...props,
          ...attrs,
          component: RadioGroup
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
    },
    // 自定义默认按钮
    DefaultButton: (props, { attrs, slots }) => {
      return h(ElButton, { ...props, attrs }, slots)
    },
    DatePicker: (props, { attrs, slots }) => {
      return h(
        DatePicker,
        {
          ...props,
          ...attrs,
          component: DatePicker
        },
        slots
      )
    }
  }
  globalShareState.setComponents(components)
}