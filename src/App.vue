<script setup lang="ts">
import type { MenuRecordRaw } from '@/types/menu'
import { Menus } from '@/packages/Menus'
import { ref } from 'vue'

const menuList = ref<MenuRecordRaw[]>([
  {
    path: '/a',
    name: 'A',
    icon: 'lucide:layout-dashboard',
    children: [
      {
        path: 'a1',
        name: 'a1',
        icon: 'lucide:layout-dashboard'
      }
    ]
  },
  {
    path: '/b',
    name: 'B',
    icon: 'lucide:layout-dashboard'
  },
  {
    path: '/c',
    name: 'C',
    icon: 'lucide:layout-dashboard',
    children: [
      {
        path: 'c1',
        name: 'C1',
        icon: 'lucide:layout-dashboard',
        children: [
          {
            path: 'c11',
            name: '这是怀旧服当升科技发货发多少',
            icon: 'lucide:layout-dashboard'
          }
        ]
      }
    ]
  }
])
</script>

<template>
  <div style="width: 200px">
    <Menus :menus="menuList"/>
  </div>
</template>
