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
      <div class="dialog-header flex justify-between items-center">
        <h4 :id="titleId" :class="titleClass">{{title}}</h4>
        <div @click="handleClose" class="close pointer flex-center text-accent">
          <Icons icon="formkit:close"/>
        </div>
      </div>
    </template>
    <div class="dialog-content overflow-auto">
      <slot/>
    </div>
    <template #footer>
      <div class="dialog-footer flex justify-end" v-if="!hiddenFooter">
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
const emit = defineEmits(['confirm', 'close'])
defineProps<PropsType>()

function handleClose () {
  show.value = false
  emit('close')
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
  .dialog-header {
    border-bottom-width: 1px;
    padding: 16px 20px;
    > h4 {
      font-weight: 700;
    }
    .close {
      opacity: 0.5;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      &:hover {
        opacity: 1;
        background-color: rgb(var(--bg-background));
      }
    }
  }
  .dialog-content {
    padding: 16px;
  }
  .dialog-footer {
    padding: 12px;
    border-top-width: 1px;
  }
}
</style>