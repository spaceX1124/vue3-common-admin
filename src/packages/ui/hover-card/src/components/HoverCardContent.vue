<script setup lang="ts">
import { computed } from 'vue'

import {
  HoverCardContent,
  type HoverCardContentProps,
  HoverCardPortal,
  useForwardProps
} from 'radix-vue'

const props = withDefaults(
  defineProps<{ class?: any } & HoverCardContentProps>(),
  {
    sideOffset: 4
  }
)

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <HoverCardPortal>
    <HoverCardContent
      v-bind="forwardedProps"
      :class="[
        'hover-card-content',
        props.class,
      ]
      "
    >
      <slot/>
    </HoverCardContent>
  </HoverCardPortal>
</template>
<style lang="scss">
.hover-card-content {
  width: 256px;
  border-radius: 6px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  outline: 2px solid transparent;
  outline-offset: 2px;
}
</style>
