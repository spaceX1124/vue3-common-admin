<template>
  <div class="flex">
    <el-input placeholder="请输入写字楼名称"
              maxlength="10"
              clearable
              v-model="inputVal[0]"
              @change="change"/>
    <el-input placeholder="请输入楼栋"
              maxlength="10"
              clearable
              v-model="inputVal[1]"
              @change="change"/>
    <el-input  placeholder="请输入单元"
               maxlength="10"
               clearable
               v-model="inputVal[2]"
               @change="change"/>
    <el-input placeholder="请输入楼层"
              clearable
              v-model="inputVal[3]"
              @change="change"/>
    <el-input placeholder="请输入门牌号"
              clearable
              v-model="inputVal[4]"
              @change="change"/>
  </div>
</template>

<script lang="ts" setup>
import { watch, ref } from 'vue'

interface PropsType {
  modelValue?: string;
}
const props = defineProps<PropsType>()
const emit = defineEmits(['update:modelValue'])

const inputVal = ref<string[]>([])

function change () {
  emit('update:modelValue', inputVal.value)
}

watch(() => props.modelValue, (value) => {
  inputVal.value = value?.split(',') || []
})
// @todo，属性在html上全部展示了，考虑下怎么去掉
defineOptions({ inheritAttrs: false })
</script>