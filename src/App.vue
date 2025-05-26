<script setup>
import { RouterView } from 'vue-router'
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <main>
    <component :is="route.meta.layout">
      <router-view />
    </component>
  </main>
</template>


