<template>
  <Dialog
    v-model="show"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    v-bind="$attrs"
    @confirm="confirm"
  >
    <div class="h-[450px]">
      <Form/>
    </div>
  </Dialog>
</template>
<script lang="ts" setup>
import { useForm } from '@/adapter/form'
import type { ISchema } from '@/adapter'
import Dialog from '@/components/common/dialog/Dialog.vue'
interface PropsType {
  schemaList: ISchema[];
  gridCols?: string; // 控制一行展示几个
}
const props = defineProps<PropsType>()
const show = defineModel<boolean>()
const [Form, formMethods] = useForm({
  schema: props.schemaList,
  gridCols: props.gridCols || 'grid-cols-1', // 一行展示一个
  handleSubmit (values) {
    console.log(values, '拿到了表单数据')
  }
})

// 提交表单
function confirm () {
  formMethods.submit()
}
</script>
<style lang="scss" scoped>

</style>