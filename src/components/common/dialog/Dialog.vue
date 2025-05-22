<template>
  <el-dialog
    :model-value="show"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    class="custom-dialog"
    v-bind="$props"
  >

    <template #header="{titleId, titleClass}">
      <div class="flex justify-between items-center border-b px-5 py-4">
        <h4 :id="titleId" :class="titleClass" class="font-bold">{{title}}</h4>
        <div @click="handleClose" class="cursor-pointer hover:bg-accent-hover w-6 h-6 rounded-full flex-center text-accent opacity-50 hover:text-accent hover:opacity-100">
          <Icons icon="formkit:close"/>
        </div>
      </div>
    </template>
    <div class="p-4 overflow-auto">
      <slot/>
    </div>
    <template #footer>
      <div class="flex p-3 border-t justify-end" v-if="!hiddenFooter">
        <el-button @click="handleClose">{{ cancelText || '取消' }}</el-button>
        <el-button type="primary" @click="handleConfirm">{{confirmText || '确认'}}</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { Icons } from '@/packages/Icons'

const show = defineModel<boolean>()
interface PropsType {
  title?: string; // 标题
  confirmText?: string; // 确认文字
  cancelText?: string; // 取消文字
  hiddenFooter?: boolean; // 隐藏底部
}
const emit = defineEmits(['confirm'])
defineProps<PropsType>()

function handleClose () {
  show.value = false
}

function handleConfirm () {
  emit('confirm')
}
</script>
<style lang="scss">
.custom-dialog {
  padding: 0;
  .el-dialog__header {
    padding: 0;
  }

}
</style>