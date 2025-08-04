<template>
  <div class="flex flex-wrap gap-3">
    <div v-for="(item, index) in fileList" :key="index" class="upload-item">
      <!-- 文件和视频的样式还没处理 -->
      <template v-if="isVideo(item.url)">
        <video
          style="width: 100%; height: 100%"
          muted
          loop
          controls
          :src="getOssUrl(item.url)"
        />
      </template>
      <template v-if="isFile(item.url)">
        <div class="demo-upload-list-pdf">
          <!-- 想展示具体的文件名称，需要后端配合存储文件名称和url -->
          <a :href="getOssUrl(item.url)" target="_blank">文件</a>
        </div>
      </template>
      <template v-if="isImg(item.url)">
        <img :src="getOssUrl(item.url)" alt="">
        <span class="upload-item__actions">
          <el-icon class="pointer" @click="openPreviewImg(getOssUrl(item.url))"><ZoomIn /></el-icon>
          <el-icon class="pointer ml-2" @click="deleteFile(index)"><Delete /></el-icon>
        </span>
      </template>

    </div>
    <el-upload
      v-if="fileList.length < limit"
      class="my-uploader"
      v-bind="state"
      :before-upload="beforeUpload"
      :on-success="onSuccess"
      :on-exceed="onExceed"
    >
      <div class="icon-box flex-center">
        <Icons icon="mdi-light:plus" class="size-6"/>
      </div>
    </el-upload>
  </div>
</template>
<script lang="ts" setup>
import { ossPath } from '@/packages/utils/http/api.ts'
import { sys } from '@/libs/requestAddress.ts'
import { ref, computed, watch } from 'vue'
import { toMd5 } from '@/packages/utils/aes'
import { Icons } from '@/packages/Icons'
import { ElMessage, type UploadRawFile, type UploadFile } from 'element-plus'
import { getOssUrl } from '@/packages/utils/http'
import { ls } from '@/packages/utils/cache/storageCache.ts'
import { cacheUserInfo } from '@/libs/constants.ts'
import { ZoomIn, Delete } from '@element-plus/icons-vue'
import { useAppStore } from '@/stores/modules/app.ts'
import { isArray, isNullOrUndefOrEmpty, isString } from '@/packages/utils/is'

interface PropsType {
  modelValue?: string | {name: string; url: string;}[]; // 纯url，或则带name的
  multiple?: boolean; // 是否支持同时选多张
  accept?: string; // 接受上传的文件类型
  limit?: number; // 允许上传文件的最大数量
  maxSizeMB?: number; //  单个文件允许上传的文件最大大小，单位为MB
  disabled? : boolean;
  data? : Record<string, any>; // 上传时附带的额外参数
}
const props = withDefaults(defineProps<PropsType>(), {
  maxSizeMB: 30,
  limit: 1
})
const emit = defineEmits(['update:modelValue', 'change'])

const timestamp = Date.now()
// 组件所需属性
const state = computed(() => {
  return {
    ...props,
    action: ossPath + sys.upload, // 上传地址
    headers: { // 设置上传的请求头部
      token: ls.get<{token: string}>(cacheUserInfo)?.token,
      sign: toMd5(undefined, 'POST', timestamp),
      timestamp
    },
    data: props.data || { fileType: 'USER' },
    'show-file-list': false
  }
})

// 图片类型
const imgType = ['jpg', 'jpeg', 'png', 'gif', 'bmp']
// 文件类型
const fileType = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt']
// 视频/音频类型
const videoType = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv']

// 展示出来的文件列表
const fileList = ref<{url: string; name: string;}[]>([])

// 安全获取文件扩展名
const getFileExtension = (fileName: string): string => {
  if (!fileName) return ''
  const parts = fileName.split('.')
  return parts.length > 1 ? parts.pop()!.toLowerCase() : ''
}

const isVideo = (url: string) => {
  const ext = getFileExtension(url)
  return videoType.includes(ext)
}
const isImg = (url: string) => {
  const ext = getFileExtension(url)
  return imgType.includes(ext)
}
const isFile = (url: string) => {
  const ext = getFileExtension(url)
  return fileType.includes(ext)
}

/**
 * 在上传之前处理
 * */
function beforeUpload (rawFile: UploadRawFile) {
  // 校验格式
  const ext = getFileExtension(rawFile.name) // 文件后缀
  const validExtensions = [...imgType, ...fileType, ...videoType] // 默认的文件类型
  const accept = props.accept || validExtensions // 当前文件可支持的类型
  if (!accept.includes(ext)) {
    ElMessage.error(`不支持的文件格式: ${ext ? '.' + ext : '未知格式'}`)
    return false
  }

  // 校验文件大小
  const isLtMaxSize = rawFile.size / (1024 * 1024) < props.maxSizeMB
  if (!isLtMaxSize) {
    ElMessage.error(`文件大小不能超过 ${props.maxSizeMB}MB!`)
    return false
  }
  return true
}
/**
 * 上传成功之后处理
 * */
function onSuccess (response: any, uploadFile: UploadFile) {
  const { code, data, message } = response
  if (code === 0) {
    fileList.value.push({
      url: data,
      name: uploadFile.name
    })
    let val = fileList.value.map(item => item.url).join(',')
    emit('update:modelValue', val)
    emit('change', val)
  } else {
    ElMessage.error(message)
  }
}
/**
 * 当超出限制时，执行的钩子函数
 * */
function onExceed () {
  ElMessage.error('允许上传文件的最大数量为' + props.limit)
}

/**
 * 预览图片
 * */
const appStore = useAppStore()
function openPreviewImg (url: string) {
  appStore.openPreviewImg([url])
}

/**
 * 删除图片
 * */
function deleteFile (index: number) {
  fileList.value.splice(index, 1)
  let val = fileList.value.map(item => item.url).join(',')
  emit('update:modelValue', val)
  emit('change', val)
}

const parseInputValue = (value: string | {name: string; url: string}[] | null | undefined): {name: string; url: string}[] => {
  if (!isNullOrUndefOrEmpty(value)) {
    if (isString(value)) {
      return value.split(',').map(item => ({ name: '', url: item }))
    } else if (isArray(value)) {
      return value
    } else {
      return []
    }
  } else {
    return []
  }
}
watch(() => props.modelValue, (newVal) => {
  fileList.value = parseInputValue(newVal)
}, {
  immediate: true
})
</script>
<style lang="scss" scoped>
.upload-item {
  width: 80px;
  height: 80px;
  position: relative;
  border-radius: 6px;
  background: #fff;
  border: 1px solid #dcdfe6;
  overflow: hidden;
  >img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .upload-item__actions {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    cursor: default;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    color: rgb(255, 255, 255);
    opacity: 0;
    font-size: 20px;
    background-color: rgba(0, 0, 0, .5);
    transition: opacity 0.3s;
    &:hover {
      opacity: 1;
    }
  }
}
.my-uploader {
  :deep(.el-upload) {
    border: 1px dashed #dcdfe6;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: .2s;
    &:hover {
      border-color: rgb(var(--primary));
    }
  }
  .icon-box {
    width: 80px;
    height: 80px;
  }
}
</style>