<template>
  <div>
    <el-radio-group :model-value="inputVal[0]">
      <component
        :is="showComponent"
        v-for="(item, index) in showList"
        :key="index"
        :label="item.label"
        :value="item.value"
        :disabled="item.disabled"
        @click="choose(item)"
        :ref="(el) => setRadioRef(el as ComponentPublicInstance<typeof ElRadio>, index)"
      >
        {{ item.label }}
      </component>
    </el-radio-group>
    <el-popover
      ref="popoverRef"
      :virtual-ref="currentRadioElement"
      virtual-triggering
      trigger="click"
      placement="bottom"
      :persistent="false"
      :width="400"
      :title="popoverTitle"
    >
      <div>
        <ApiCheckboxAll
          v-model="inputVal[1]"
          :options="popoverShowList"
          :schema="{
            extraConfig: {
              isAll: true
            }
          }"
          @change="changeCheckbox"
        />
      </div>
    </el-popover>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeMount, watch, ref, unref, type ComponentPublicInstance } from 'vue'
import { ElRadioButton, ElRadio } from 'element-plus'

import type { IAsync } from '@/adapter'
import { useOptions } from '@/packages/ui/forms/src/components/utils'
import { ApiCheckboxAll } from '@/packages/ui/forms'
import { isNullOrUndefOrEmpty, isString, isArray } from '@/packages/utils/is.ts'

interface PropsType {
  async?: IAsync;
  modelValue?: string[];
  options?: Record<string, any>[];
  isButton?: boolean;

  popoverTitle?: string;
  popoverShowList?: Record<string, any>[]; // popover要展示的数据
  popoverShowRadioVal?: string;// 哪个选项要弹popover
}
const props = withDefaults(defineProps<PropsType>(), {
  popoverShowList: () => []
})
const emit = defineEmits(['update:modelValue', 'refreshOptions', 'updateOptions'])

const showComponent = computed(() => {
  return props.isButton ? ElRadioButton : ElRadio
})

const { showList, getApiList, dealDataList } = useOptions(props.async)
const popoverRef = ref()

// 没有给el-radio-group双向绑定，绑定change事件不执行
/**
 * 处理单选框选中和取消选中
 * */
function choose (item: Record<string, any>) {
  unref(popoverRef).popperRef?.delayHide?.()
  // 要弹的选项不能取消选中
  if (props.popoverShowRadioVal !== item.value) {
    let val = inputVal.value[0] === item.value ? '' : item.value
    inputVal.value[1] = []
    inputVal.value[0] = val
  } else {
    inputVal.value[0] = item.value
  }

  emit('update:modelValue', inputVal.value)
  // if (props.schema?.componentEvent) {
  //   props.schema.componentEvent?.onChange(inputVal.value[0])
  // }
}

/**
 * 更新字段异步数据
 * */
watch(() => showList.value, () => {
  emit('updateOptions', showList.value)
})

const inputVal = ref<[string, string[]]>(['', []])

watch(() => props.modelValue, (value) => {
  if (value) {
    if (!isNullOrUndefOrEmpty(value[0])) {
      inputVal.value[0] = String(value[0])
    } else {
      inputVal.value[0] = ''
    }
    if (!isNullOrUndefOrEmpty(value[1])) {
      if (isString(value[1])) {
        inputVal.value[1] = value[1].split(',')
      } else if (isArray(value[1])) {
        inputVal.value[1] = value[1]
      } else {
        inputVal.value[1] = [value[1]]
      }
    } else {
      inputVal.value[1] = []
    }
  } else {
    inputVal.value = ['', []]
  }
}, {
  immediate: true
})

onBeforeMount(async () => {
  if (props.async && props.async?.url) {
    await getApiList()
    // 用于外部使用，刷新下拉数据
    emit('refreshOptions', getApiList)
  } else {
    dealDataList(props.options)
  }
})

const radioRefs = ref<(HTMLElement | null)[]>([])
// 动态设置 ref 引用
const setRadioRef = (el: ComponentPublicInstance<typeof ElRadio> | null, index: number) => {
  radioRefs.value[index] = el?.$el || null
}

// 当前选中的元素引用
const currentRadioElement = computed(() => {
  const index = showList.value.findIndex(item => item.value === props.popoverShowRadioVal)
  return radioRefs.value[index] || null
})

function changeCheckbox () {
  emit('update:modelValue', inputVal.value)
}

defineOptions({ inheritAttrs: false })
</script>