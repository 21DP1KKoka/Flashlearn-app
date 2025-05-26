<script setup>
import {RouterLink} from "vue-router";


</script>

<template>
  <nav class="flex items-center justify-end  bg-sky-300 w-full h-14 absolute">
    <div class="w-full flex justify-start">
      <RouterLink class="flex-none p-2 m-2 rounded-full hover:bg-sky-600 text-3xl font-bold hover:scale-105"
                  to="/">FlashLearn
      </RouterLink>
    </div>
    <RouterLink class="p-2 m-2 bg-sky-500 rounded-full hover:bg-sky-600 hover:scale-110"
                to="/register">Reģistrējies
    </RouterLink>
    <RouterLink class="p-2 m-2 bg-sky-500 rounded-full hover:bg-sky-600 hover:scale-110"
                to="/login">Ienāc
    </RouterLink>
  </nav>
  <router-view class="bg-sky-100" />
</template>

<style scoped>

</style>