<template>
  <Menus :menus="menus" :collapse="collapse" :default-active="defaultActive"/>
</template>
<script lang="ts" setup>
import { Menus } from '@/packages/Menus'
import type { MenuProps, MenuRecordRaw } from '@/packages/Menus'
interface PropsType extends MenuProps{
  menus: MenuRecordRaw[];
}
const props = withDefaults(defineProps<PropsType>(), {
  menus: () => []
})
</script>