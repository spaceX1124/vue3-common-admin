<template>
  <FieldItem :name="fieldKey" v-slot="slotProps" v-bind="fieldProps">
    <div class="flex items-center pb-6" :class="{'flex-col': labelPosition === 'top'}">
      <FormLabel
        :labelPosition="labelPosition"
        :labelWidth="labelWidth"
        :required="required">
        <span class="truncate">{{fieldName}}</span>
        <span class="ml-[2px]" v-if="labelPosition !== 'top'">:</span>
      </FormLabel>
      <div class="relative w-full">
        <component :is="FieldComponent" v-bind="createComponentProps(slotProps)" :schema="{...props}"/>
        <Transition name="slide-up">
          <FormMessage class="absolute -bottom-[22px]" />
        </Transition>
      </div>
    </div>
  </FieldItem>

</template>
<script lang="ts" setup>
import FormLabel from './form-label.vue'
import { isArray, isEmpty, isFunc, isNullOrUndefOrEmpty, isString, isUndef } from '@/utils/is'
import { computed, onMounted } from 'vue'
import { useFormContext } from '../hooks/useCreateContext'
import { defineRule, Field as FieldItem } from 'vee-validate'
import FormMessage from './form-message.vue'
import type { ISchema } from '@/adapter'

interface PropsType extends ISchema {

}
const props = defineProps<PropsType>()
console.log(props, 'props111')
// 获取透传数据
const { componentMap, defaultComponentProps, componentBindEventMap, formMethods } = useFormContext()
/**
 * 匹配对应的组件-用于渲染
 * */
const FieldComponent = computed(() => {
  const finalComponent = isString(props.component)
    ? componentMap[props.component]
    : props.component
  if (!finalComponent) {
    // 组件未注册
    console.warn(`Component ${props.component} is not registered`)
  }
  return finalComponent
})
/**
 * 给组件component绑定事件
 * */
function fieldBindEvent (slotProps: Record<string, any>) {
  const handler = slotProps.componentField['onUpdate:modelValue']
  const modelValue = slotProps.componentField.modelValue
  const bindEventField = isString(props.component) ? componentBindEventMap?.[props.component] : null
  // @todo，可能不一定是modelValue，ant-design-vue就是value，现在先满足element-plus
  // 这儿是组件双向绑定底层机制
  if (bindEventField) {
    return {
      [`onUpdate:${bindEventField}`]: handler,
      [bindEventField]: modelValue,
      onChange: undefined,
      onInput: undefined
    }
  }
  return {
    onInput: undefined,
    onChange: undefined
  }
}
/**
 * 给组件绑定props和event
 * */
function createComponentProps (slotProps: Record<string, any>) {
  // @todo，思考下怎么绑定时间，以及和外部传入的事件进行耦合， formApi.updateSchema更新字段的options
  const event: Record<string, any> = {}
  if (props.componentEvent) {
    Object.keys(props.componentEvent).forEach(eventKey => {
      if (eventKey.slice(0, 2) === 'on') {
        event[eventKey] = props.componentEvent?.[eventKey]
      } else {
        // 首字母转大写
        let key = eventKey.charAt(0).toUpperCase() + eventKey.slice(1)
        event[key] = props.componentEvent?.[eventKey]
      }
    })
  }
  // 处理事件绑定很重要，之前一直遇到个问题，可输入的下拉框，输入的时候，modelValue的值变成了输入的值
  const bindEvents = fieldBindEvent(slotProps)
  const bind = {
    ...slotProps.componentField, // 这里面存着v-model的语法糖，实现同步变更字段值
    ...bindEvents,
    ...defaultComponentProps, // 默认的组件props
    ...props.componentProps // 外部传入的UI框架自己的props
  }
  return bind
}

/**
 * 给FieldItem绑定props
 * */
const fieldProps = computed(() => {
  const rules = fieldRules.value
  const prop = {
    label: props.fieldName,
    ...(!isEmpty(rules) ? { rules } : {})
  }
  return prop
})

/**
 * 处理表单校验规则
 * 只有required
 * 有required和rules
 * 只有rules
 * 表单校验，处理必填，自定义，异步校验
 * */
const fieldRules = computed(() => {
  const rule: any = {}
  // 如果必填，如果置灰的，就不设置必填规则，只会显示必填的标识
  if (props.required && !props.componentProps?.disabled) {
    // name不能相同
    let name = `isRequiredFor${props.fieldKey}`
    defineRule(name, (value: any) => {
      console.log(value, 'value123')
      // 如果是多个key的字段，值是存在fieldKey上的，需要分发去判断，如区间输入，包含2个key，则必填要满足2个key都有值
      if (props.fieldKeyArr && isArray(value)) {
        const hasValues = props.fieldKeyArr.every((item, i) => !isUndef(value[i]))
        if (!hasValues) {
          return '请填写完整'
        }
      }
      if (isNullOrUndefOrEmpty(value)) {
        return `${props.fieldName}不能为空`
      }
      return true
    })
    rule[name] = `${props.fieldName}不能为空`
  }
  // 如果自定义规则
  if (props.rules) {
    // 可能是函数
    if (isFunc(props.rules)) {
      defineRule(props.fieldKey, props.rules)
    } else {
      // 可能是正则表达式
      const { regExp, msg } = props.rules
      defineRule(props.fieldKey, (value: any) => {
        // 有值的情况下下去校验自定义规则，为了符合非必填但如果填了得按规则来，没值且必填就走上面的必填校验了
        if (!isNullOrUndefOrEmpty(value) && !regExp.test(value)) {
          return msg
        }
        return true
      })
    }
    rule[props.fieldKey] = `${props.fieldName}不满足规则`
  }
  return rule
})

/**
 * label的布局方式
 * */
const labelPosition = computed(() => {
  return formMethods.staticState.value.labelPosition
})

</script>