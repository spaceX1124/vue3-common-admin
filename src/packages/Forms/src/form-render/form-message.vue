<script lang="ts" setup>
import { toValue } from 'vue'

import { ErrorMessage } from 'vee-validate'

import { useFormFieldValidate } from '../hooks/useFormFieldValidate'

const { name } = useFormFieldValidate()
</script>

<template>
  <ErrorMessage
    :name="toValue(name)"
    as="p"
    class="text-destructive"
  />
</template>
<style lang="scss" scoped>
.text-destructive {
  color: #ff3860;
  font-size: 12px;
}
</style>
