<template>
  <div class="flex flex-wrap gap-4">
    <div>
      <div>营业执照</div>
      <Upload v-model="inputVal[0]" @change="change"/>
    </div>
    <div>
      <div>门头照</div>
      <Upload v-model="inputVal[1]" @change="change"/>
    </div>
    <div>
      <div>场地照片</div>
      <Upload v-model="inputVal[2]" @change="change"/>
    </div>
    <div>
      <div>场地视频</div>
      <Upload v-model="inputVal[3]" @change="change"/>
    </div>
    <div>
      <div>合同照片</div>
      <Upload v-model="inputVal[4]" @change="change"/>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { watch, ref } from 'vue'

import { Upload } from '@/packages/ui/forms'

interface PropsType {
  fieldKeyArr: string[];
  modelValue?: string[];
}
const props = defineProps<PropsType>()
const emit = defineEmits(['update:modelValue'])

const inputVal = ref<[string, string, string, string, string]>(['', '', '', '', ''])

function change () {
  emit('update:modelValue', inputVal.value)
}

watch(() => props.modelValue, (value) => {
  if (value) {
    props.fieldKeyArr.forEach((key, index) => {
      inputVal.value[index] = value[index]
    })
  } else {
    inputVal.value = ['', '', '', '', '']
  }
})
// @todo，属性在html上全部展示了，考虑下怎么去掉
defineOptions({ inheritAttrs: false })
</script>