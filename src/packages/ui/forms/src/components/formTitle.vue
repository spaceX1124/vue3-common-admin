<template>
  <div class="formTitle">{{fieldName}}</div>
</template>
<script lang="ts" setup>
import type { ISchema } from '@/adapter'

interface PropsType extends ISchema {}
defineProps<PropsType>()
</script>
<style lang="scss" scoped>
.formTitle {
  font-weight: 500;
  font-size: 16px;
  color: #000000;
  line-height: 22px;
  margin-bottom: 20px;
  &::before {
    content: ' ';
    display: inline-block;
    width: 3px;
    height: 14px;
    background: #0354fb;
    margin-right: 4px;
  }

}
</style>