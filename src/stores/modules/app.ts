import { defineStore } from 'pinia'

interface IAppState {
    urlList: string[] // 用于预览的图片链接列表
    previewImgVisible: boolean // 是否显示预览图片
}

export const useAppStore = defineStore({
  id: 'app-app',
  state: (): IAppState => ({
    urlList: [],
    previewImgVisible: false
  }),
  actions: {
    /**
     * 打开图片预览
     * */
    openPreviewImg (urlList: string[]) {
      this.urlList = urlList
      this.previewImgVisible = true
    },
    /**
     * 关闭图片预览
     * */
    closePreviewImg () {
      this.urlList = []
      this.previewImgVisible = false
    }
  }
})