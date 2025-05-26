<script setup>
import {onMounted, ref} from 'vue'
import axios from "axios";

const profileData = ref({
  name: '',
  nickname: '',
  email: '',
})

async function loadUserData() {
  await axios.get("/me").then((response) => {
    profileData.value.name = response.data.data.name
    profileData.value.nickname = response.data.data.nickname
    profileData.value.email = response.data.data.email
  })
}

onMounted(async () => {
  loadUserData();
});
</script>

<template>
  <main class="flex justify-center text-center w-fill h-screen pt-16">
    <div class="mt-12 bg-white rounded-3xl border-2 border-red-500 w-2/3 h-2/3">
      <h1 class="font-bold text-4xl my-4">Profils</h1>
      <p class="text-2xl my-4">Vārds: {{ profileData.name }}</p>
      <p class="text-2xl my-4">Lietotājvārds: {{ profileData.nickname }}</p>
      <p class="text-2xl my-4">E-pasts: {{ profileData.email }}</p>
    </div>
  </main>
</template>
