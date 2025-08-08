<script setup lang="ts">
import { computed } from 'vue'

import {
  TooltipContent,
  type TooltipContentEmits,
  type TooltipContentProps,
  TooltipPortal,
  useForwardPropsEmits
} from 'radix-vue'

defineOptions({
  inheritAttrs: false
})

const props = withDefaults(
  defineProps<{ class?: any } & TooltipContentProps>(),
  {
    class: '',
    side: 'right',
    sideOffset: 5
  }
)

const emits = defineEmits<TooltipContentEmits>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <TooltipPortal>
    <TooltipContent
      v-bind="{ ...forwarded, ...$attrs }"
      :class="
        [
          'tooltip-content z-popup bg-accent overflow-hidden',
          props.class,
        ]
      "
    >
      <slot/>
    </TooltipContent>
  </TooltipPortal>
</template>

<style lang="scss">
.tooltip-content {
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 12px;
  line-height: 16px;
}
</style>
