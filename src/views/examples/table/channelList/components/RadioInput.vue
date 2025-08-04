<template>
  <div class="flex-start">
    <el-radio-group :model-value="inputVal[0]">
      <component
        :is="showComponent"
        v-for="(item, index) in showList"
        :key="index"
        :label="item.label"
        :value="item.value"
        :disabled="item.disabled"
        @click="choose(item)"
      >
        {{ item.label }}
      </component>
    </el-radio-group>
    <el-input
      v-if="inputVal[0] === '1'"
      style="width: 150px"
      placeholder="请输入单价"
      clearable
      v-model="inputVal[1]"
      @input="changeInput"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeMount, watch, ref } from 'vue'
import { ElRadioButton, ElRadio } from 'element-plus'

import type { IAsync, ISchema } from '@/adapter'
import { useOptions } from '@/packages/ui/forms/src/components/utils'
import { isNullOrUndefOrEmpty } from '@/packages/utils/is.ts'

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
  return props?.isButton ? ElRadioButton : ElRadio
})

const asyncComputed = computed(() => {
  return {
    immediate: true,
    ...props.async
  }
})
const { showList, getApiList, dealDataList } = useOptions(asyncComputed)

// 没有给el-radio-group双向绑定，绑定change事件不执行
/**
 * 处理单选框选中和取消选中
 * */
function choose (item: Record<string, any>) {
  // 要弹的选项不能取消选中
  let val = inputVal.value[0] === item.value ? '' : item.value
  if (isNullOrUndefOrEmpty(val)) {
    inputVal.value[1] = ''
  }
  inputVal.value[0] = val

  emit('update:modelValue', inputVal.value)
  // if (props.schema?.componentEvent) {
  //   props.schema.componentEvent?.onChange(inputVal.value[0])
  // }
}

function changeInput () {
  emit('update:modelValue', inputVal.value)
}

/**
 * 更新字段异步数据
 * */
watch(() => showList.value, () => {
  emit('updateOptions', showList.value)
})

const inputVal = ref<[string, string]>(['', ''])

watch(() => props.modelValue, (value) => {
  if (value) {
    if (!isNullOrUndefOrEmpty(value[0])) {
      inputVal.value[0] = String(value[0])
    } else {
      inputVal.value[0] = ''
    }
    if (!isNullOrUndefOrEmpty(value[1])) {
      inputVal.value[1] = String(value[1])
    } else {
      inputVal.value[1] = ''
    }
  } else {
    inputVal.value = ['', '']
  }
})

onBeforeMount(async () => {
  if (asyncComputed.value.url && asyncComputed.value.immediate) {
    await getApiList()
    // 用于外部使用，刷新下拉数据
    emit('refreshOptions', getApiList)
  } else {
    dealDataList(props.options)
  }
})

defineOptions({ inheritAttrs: false })
</script>