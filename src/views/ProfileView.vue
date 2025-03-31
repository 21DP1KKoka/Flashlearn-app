<script setup>
import {onMounted, ref} from 'vue'
import {Constants} from "@/universal/Constants.js";

const profileData = ref({
  name: '',
  nickname: '',
  email: '',
})

const loadUserData = async () => {
  try {
    const response = await fetch(Constants.API_URL + '/me', {
      method: 'get',
      headers: {
        Authorization: `Bearer ${localStorage.getItem(
            Constants.LOCAL_STORAGE.TOKEN
        )}`,
        'Content-Type': 'application/json'
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Something went wrong');
    }
    profileData.value.name = result.data.name;
    profileData.value.nickname = result.data.nickname;
    profileData.value.email = result.data.email;
  } catch (error) {
    alert('Error: ' + error.message);
  }
};
onMounted(async () => {
  console.log('Component mounted, fetching data...');
  // loading.value = true;
  await loadUserData();
  // loading.value = false;
});
</script>

<template>
  <main class="flex justify-center text-center w-screen h-screen pt-12">
    <div class="mt-12 bg-white rounded-3xl border-2 border-red-500 w-2/3 h-2/3">
      <h1 class="font-bold text-4xl my-4">Profils</h1>
      <p class="text-2xl my-4">Vārds: {{ profileData.name }}</p>
      <p class="text-2xl my-4">Lietotājvārds: {{ profileData.nickname }}</p>
      <p class="text-2xl my-4">E-pasts: {{ profileData.email }}</p>
    </div>
  </main>
</template>
