<template>
  <div>
    <el-checkbox
      v-if="isAll"
      v-model="checkAll"
      :indeterminate="isIndeterminate"
      @change="handleCheckAllChange"
    >
      全选
    </el-checkbox>
    <el-checkbox-group
      v-model="selectVal"
      @change="handleCheckedChange"
    >
      <el-checkbox
        v-for="(item, index) in showList"
        :key="index"
        :label="item.label"
        :value="item.value"
        :disabled="item.disabled"
      >
        {{ item.label }}
      </el-checkbox>
    </el-checkbox-group>
  </div>
</template>

<script lang="ts" setup>
import { ref, onBeforeMount, watch, computed } from 'vue'
import { type CheckboxValueType } from 'element-plus'

import type { IAsync } from '@/adapter'
import { useOptions } from '@/packages/ui/forms/src/components/utils'
import { isArray, isNullOrUndefOrEmpty, isString } from '@/packages/utils/is.ts'

interface PropsType {
  async?: IAsync;
  modelValue?: string | string[];
  // checked?: string | string[]; // 如果双向绑定底层是checked，就用这个，如ant-design-vue
  options?: Record<string, any>[]
  isAll?: boolean;
}

const props = withDefaults(defineProps<PropsType>(), {})
const emit = defineEmits(['update:modelValue', 'update:checked', 'refreshOptions', 'updateOptions', 'change'])

const checkAll = ref<boolean>(false)
const isIndeterminate = ref(false)
const selectVal = ref<string[]>([])

const asyncComputed = computed(() => {
  return {
    immediate: true,
    ...props.async
  }
})

const { showList, getApiList, dealDataList } = useOptions(asyncComputed)

function handleCheckAllChange (val: CheckboxValueType) {
  let values = []
  val && (values = showList.value.filter(item => !item.disabled).map(item => item.value))
  isIndeterminate.value = false
  emit('update:modelValue', values)
  // emit('update:checked', values)
  emit('change', values)
  // if (props.schema?.componentEvent) {
  //   props.schema.componentEvent?.onChange(values)
  // }
}
function handleCheckedChange (value: string[]) {
  const checkedCount = value.length
  checkAll.value = checkedCount === showList.value.filter(item => !item.disabled).length
  isIndeterminate.value = checkedCount > 0 && checkedCount < showList.value.filter(item => !item.disabled).length
  emit('update:modelValue', value)
  // emit('update:checked', value)
  emit('change', value)
}

/**
 * 更新字段异步数据
 * */
watch(() => showList.value, () => {
  emit('updateOptions', showList.value)
  // 处理全选和半选
  checkAll.value = selectVal.value.length === showList.value.filter(item => !item.disabled).length
  isIndeterminate.value = selectVal.value.length > 0 && selectVal.value.length < showList.value.filter(item => !item.disabled).length
})

const parseInputValue = (value: string | string[] | null | undefined): string[] => {
  if (!isNullOrUndefOrEmpty(value)) {
    if (isString(value)) {
      return value.split(',')
    } else if (isArray(value)) {
      return value
    } else {
      return [value]
    }
  } else {
    return []
  }
}

watch(() => props.modelValue, (newVal) => {
  selectVal.value = parseInputValue(newVal)
}, {
  immediate: true
})
// 兼容如ant-design-vue
// watch(() => props.checked, (newVal) => {
//   selectVal.value = parseInputValue(newVal)
// }, {
//   immediate: true
// })

onBeforeMount(async () => {
  if (asyncComputed.value.url && asyncComputed.value.immediate) {
    await getApiList()
    // 用于外部使用，刷新下拉数据
    emit('refreshOptions', getApiList)
  } else {
    dealDataList(props.options)
  }
})
</script>