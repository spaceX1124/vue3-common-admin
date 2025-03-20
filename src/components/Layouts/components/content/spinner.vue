<script lang="ts" setup>
import { ref, watch } from 'vue'

interface Props {
  class?: string;
  minLoadingTime?: number; // 最小加载时间
  spinning?: boolean; // loading状态开启
}

defineOptions({
  name: 'zsSpinner'
})

const props = withDefaults(defineProps<Props>(), {
  minLoadingTime: 50
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
    showSpinner.value = true
    // 开始进行加载动画
    // timer.value = setTimeout(() => {
    //   showSpinner.value = true
    //   if (showSpinner.value) {
    //     renderSpinner.value = true
    //   }
    // }, props.minLoadingTime)
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
  <!-- 就是给主题内容上方盖了一层 -->
  <!-- duration-500，就是过渡时间，所以我在切换页面的时候会看到内容都出现了，又随着加载动画出来，慢慢变模糊，所以这个时间不能太长 -->
  <div
    class="flex-center z-[9999] bg-overlay-content absolute left-0 top-0 size-full backdrop-blur-sm transition-all duration-0"
    :class="[
      !showSpinner ? 'invisible opacity-0': '',
      props.class
    ]"
    @transitionend="onTransitionEnd"
  >
    <div
      class="loader relative size-12 before:absolute before:left-0 before:top-[60px] before:h-[5px] before:w-12 before:rounded-[50%] before:content-[''] after:absolute after:left-0 after:top-0 after:h-full after:w-full after:rounded after:content-['']"
    />
  </div>
</template>

<style scoped>
.bg-overlay-content {
  background: rgba(242,242,242,0.45);
}
.loader {
  &::before {
    animation: loader-shadow-ani 0.5s linear infinite;
    background: rgba(var(--primary), 0.5);
  }

  &::after {
    animation: loader-jump-ani 0.5s linear infinite;
    background: rgb(var(--primary));
  }
}

@keyframes loader-jump-ani {
  15% {
    border-bottom-right-radius: 3px;
  }

  25% {
    transform: translateY(9px) rotate(22.5deg);
  }

  50% {
    border-bottom-right-radius: 40px;
    transform: translateY(18px) scale(1, 0.9) rotate(45deg);
  }

  75% {
    transform: translateY(9px) rotate(67.5deg);
  }

  100% {
    transform: translateY(0) rotate(90deg);
  }
}

@keyframes loader-shadow-ani {
  0%,
  100% {
    transform: scale(1, 1);
  }

  50% {
    transform: scale(1.2, 1);
  }
}
</style>
