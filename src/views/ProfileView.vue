<script setup>
import {onMounted, ref} from 'vue'
import axios from "axios";

const profileData = ref({
  username: '',
  email: '',
})

async function loadUserData() {
  await axios.get("/me").then((response) => {
    profileData.value.username = response.data.data.username
    profileData.value.email = response.data.data.email
  })
}

async function forceCoef() {
  await axios.get("/t").then((response) => {
    console.log(response.data)
  })
}

async function forceTest() {
  await axios.get("/tt").then((response) => {
    console.log(response.data)
  })
}

onMounted(async () => {
  loadUserData();
});
</script>

<template>
  <main class="flex flex-col items-center text-center w-fill h-screen pt-16">
    <div class="mt-12 bg-white rounded-3xl border-2 border-red-500 w-2/3 h-2/3">
      <h1 class="font-bold text-4xl my-4">Profils</h1>
      <p class="text-2xl my-4">Lietotājvārds: {{ profileData.username }}</p>
      <p class="text-2xl my-4">E-pasts: {{ profileData.email }}</p>
    </div>
    <button v-if="profileData.username == 'admin'" @click="forceCoef" class="mt-4 w-1/6 max-w-48 px-4 py-2 bg-blue-500 text-white rounded-lg">EndCoef/statistika</button>
    <button v-if="profileData.username == 'admin'" @click="forceTest" class="mt-4 w-1/6 max-w-48 px-4 py-2 bg-blue-500 text-white rounded-lg">DailyTest</button>
  </main>
</template>
