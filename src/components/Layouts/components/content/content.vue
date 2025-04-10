<template>
  <!--  <div class="h-full flex-1 flex flex-col mx-4 my-4 mb-[0px]">-->
  <!--    <router-view/>-->
  <!--  </div>-->
  <div class="relative h-full">
    <!--    <RouterView v-slot="{ Component, route }">-->
    <!--      <Transition name="fade" appear mode="out-in">-->
    <!--        <component-->
    <!--          :is="Component"-->
    <!--          :key="route.fullPath"-->
    <!--        />-->
    <!--      </Transition>-->
    <!--    </RouterView>-->
    <router-view/>
  </div>
</template>
<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>