<template>
  <Dialog
    v-model="show"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    :title="title"
    :confirmText="confirmText"
    @confirm="confirm"
    width="800px"
    @close="close"
  >
    <div class="add-form">
      <AddForm>
        <template
          v-for="slotName in delegatedSlots"
          :key="slotName"
          #[slotName]="slotProps"
        >
          <slot :name="slotName" v-bind="slotProps"/>
        </template>
      </AddForm>
    </div>
  </Dialog>
</template>
<script lang="ts" setup>
// @todo，新增表单的弹窗宽度需要考虑外部传入

import { useForm } from '@/adapter/form'
import type { ISchema } from '@/adapter'
import Dialog from '@/components/common/dialog/Dialog.vue'

import type { IApi, IGetFieldListParams } from '@/types/business.ts'
import { computed, onMounted, useSlots, watch } from 'vue'
import { http } from '@/packages/utils/http'
import { isFunc } from '@/packages/utils/is.ts'

interface PropsType {
  getFieldList: (params?: IGetFieldListParams) => ISchema[]; // 字段数据
  addUrl?: IApi; // 新增接口
  updateUrl?: IApi; // 修改接口
  detailUrl?: IApi; // 详情接口
  gridCols?: string;
  title?: string;
  confirmText?: string;
  dataId?: string | number; // 数据id
}

const props = defineProps<PropsType>()
const emit = defineEmits(['closeDetail'])

const show = defineModel<boolean>()

const slots = useSlots()
const delegatedSlots = computed(() => {
  const resultSlots: string[] = []
  for (const key of Object.keys(slots)) {
    if (key !== 'default') {
      resultSlots.push(key)
    }
  }
  return resultSlots
})

const [AddForm, formMethods] = useForm({
  schema: [],
  gridCols: props.gridCols || 'grid-cols-1', // 一行展示一个
  labelPosition: 'right',
  handleSubmit (values) {
    console.log(values, '拿到了表单数据')
  }
})

// 提交表单
async function confirm () {
  let res = await formMethods.submit()
  console.log(res, 'res111')
  console.log(props.addUrl, 'addUrl')
}

function close () {
  emit('closeDetail')
}

// 获取数据详情
async function getDetail () {
  if (props.dataId && props.detailUrl) {
    const { url, method, data } = props.detailUrl
    const apiUrl = isFunc(url) ? url(props.dataId) : url
    let res = await http[method](apiUrl, { ...data, id: props.dataId })
    // 拿到详情数据，设置到表单中
    formMethods.setFieldsValue(res)
    // 值设置成功后，执行方法
    dealBeforeMount()
  }
}

/**
 * 处理表单有值之后，触发beforeMount方法
 * */
function dealBeforeMount () {
  formMethods.schema.value.forEach(item => {
    if (item.beforeMount) {
      let val = formMethods.getFieldValue(item.fieldKey)
      item.beforeMount(val)
    }
  })
}

watch(() => props.getFieldList, () => {
  // 重置表单数据
  formMethods.clearForm()
  // 设置最新的表单字段
  formMethods.setSchema(props.getFieldList({ formMethods }))
})

onMounted(() => {
  // 过滤掉
  formMethods.setSchema(props.getFieldList({ formMethods }))

  // 获取详情数据
  if (props.dataId) {
    getDetail()
  }
})

defineExpose({
  formMethods
})
</script>
<style lang="scss" scoped>
.add-form {
  height: 450px;
}
</style>