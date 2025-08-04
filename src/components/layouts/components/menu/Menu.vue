<template>
  <Menus :menus="menus" :collapse="collapse" :default-active="defaultActive"/>
</template>
<script lang="ts" setup>
import { Menus } from '@/packages/ui/menus'
import type { MenuProps, MenuRecordRaw } from '@/packages/ui/menus'
interface PropsType extends MenuProps{
  menus: MenuRecordRaw[];
}
const props = withDefaults(defineProps<PropsType>(), {
  menus: () => []
})
</script>