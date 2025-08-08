<script lang="ts" setup>
import { ref, watch } from 'vue'

interface Props {
  class?: string;
  /**
   * @zh_CN 最小加载时间
   * @en_US Minimum loading time
   */
  minLoadingTime?: number;

  /**
   * @zh_CN loading状态开启
   */
  spinning?: boolean;
  /**
   * @zh_CN 文字
   */
  text?: string;
}

defineOptions({
  name: 'ZsLoading'
})

const props = withDefaults(defineProps<Props>(), {
  minLoadingTime: 50,
  text: ''
})
const showSpinner = ref(false)
const renderSpinner = ref(true)
const timer = ref<ReturnType<typeof setTimeout>>()

watch(
  () => props.spinning,
  (show) => {
    if (!show) {
      showSpinner.value = false
      clearTimeout(timer.value)
      return
    }
    timer.value = setTimeout(() => {
      showSpinner.value = true
      if (showSpinner.value) {
        renderSpinner.value = true
      }
    }, props.minLoadingTime)
  },
  {
    immediate: true
  }
)

function onTransitionEnd () {
  if (!showSpinner.value) {
    renderSpinner.value = false
  }
}
</script>

<template>
  <div
    :class="[
      'loading-box absolute flex w-full h-full flex-col items-center justify-center transition-all',
      {
        'invisible opacity-0': !showSpinner,
      },
      props.class
    ]
    "
    @transitionend="onTransitionEnd"
  >
    <span class="dot relative">
      <i
        v-for="index in 4"
        :key="index"
        class="bg-primary absolute"
      />
    </span>
    <div v-if="text" class="loading-txt">{{ text }}</div>
  </div>
</template>

<style lang="scss" scoped>
.loading-box {
  left: 0;
  top: 0;
  .loading-txt {
    font-size: 12px;
    line-height: 16px;
    margin-top: 20px;
  }
  .dot {
    display: inline-block;
    width: 36px;
    height: 36px;
    font-size: 30px;
    line-height: 36px;
    transform: rotate(45deg);
    animation: rotate-ani 1.2s infinite linear;
    i {
      animation: spin-move-ani 1s infinite linear alternate;
      width: 16px;
      height: 16px;
      transform-origin: 50% 50%;
      display: block;
      transform: scale(.75);
      border-radius: 9999px;
      opacity: 0.3;
    }
    i:nth-child(1) {
      top: 0;
      left: 0;
    }
    i:nth-child(2) {
      top: 0;
      right: 0;
      animation-delay: 0.4s;
    }
    i:nth-child(3) {
      right: 0;
      bottom: 0;
      animation-delay: 0.8s;
    }
    i:nth-child(4) {
      bottom: 0;
      left: 0;
      animation-delay: 1.2s;
    }
  }
}

@keyframes rotate-ani {
  to {
    transform: rotate(405deg);
  }
}

@keyframes spin-move-ani {
  to {
    opacity: 1;
  }
}
</style>
