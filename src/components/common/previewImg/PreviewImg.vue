<template>
  <div>
    <el-image-viewer
      v-if="appStore.previewImgVisible"
      :url-list="appStore.urlList"
      :z-index="3000"
      :infinite="false"
      @close="close"
    />
  </div>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/stores/modules/app.ts'

const appStore = useAppStore()

const close = () => {
  appStore.closePreviewImg()
}
</script>
