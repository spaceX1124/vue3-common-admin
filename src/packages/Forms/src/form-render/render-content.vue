<script lang="ts">
import type { Component, PropType } from 'vue'
import { defineComponent, h } from 'vue'

import { isFunc, isObj } from '@/utils/is'

export default defineComponent({
  name: 'RenderContent',
  props: {
    content: {
      default: undefined as
        | PropType<(() => any) | Component | string>
        | undefined,
      type: [Object, String, Function]
    }
  },
  setup (props, { attrs, slots }) {
    return () => {
      if (!props.content) {
        return null
      }
      const isComponent = (isObj(props.content) || isFunc(props.content)) && props.content !== null
      if (!isComponent) {
        return props.content
      }
      return h(props.content as never, {
        ...attrs,
        props: {
          ...props,
          ...attrs
        },
        slots
      })
    }
  }
})
</script>
