<template>
  <label
    class="flex flex-shrink-0 text-sm leading-8"
    :style="{
      width: labelPosition !== 'top' && labelWidth ? `${labelWidth}px` : '100%'
    }"
    :class="{
      'justify-end': labelPosition === 'right',
      'mr-2': labelPosition !== 'top',
    }">
    <span v-if="required" class="required mr-0.5">*</span>
    <slot/>
  </label>
</template>
<script lang="ts" setup>
interface PropsType {
  required?: boolean;
  labelPosition?: 'left' | 'right' | 'top';
  labelWidth?: number;
}
const props = defineProps<PropsType>()
</script>
<style lang="scss" scoped>
.required  {
  color: #FF3860;
}
</style>