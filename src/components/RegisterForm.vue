<script setup>
import { ref } from 'vue'
import {Constants} from "@/universal/Constants.js";

const formData = ref({
  name: '',
  nickname: '',
  email: '',
  password: '',
  password_confirmation: '',
})

const register = async () => {
  try {
    const response = await fetch(Constants.API_URL + '/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData.value)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Kļūda');
    }
    localStorage.setItem(Constants.LOCAL_STORAGE.TOKEN, result.data.token);
    console.log(result.data);
    window.location.href = '/';
    alert('Reģistrācija veiksmīga!');
  } catch (error) {
    alert('Kļūda: ' + error.message);
  }
};


</script>

<template>
  <main class="flex justify-center text-center w-screen h-screen pt-12">
    <div class="mt-12 bg-white rounded-3xl w-2/3 h-2/3">
      <div class="w-full flex flex-col items-center justify-center">
        <h1 class="mt-12 font-bold text-2xl">Reģistrācija</h1>
        <form @submit.prevent="register" class="flex flex-col items-center justify-center w-3/4 mt-8">
            <div class="w-2/3 mt-4 border-4">
                <input class="w-full" type="text" placeholder="vārds" v-model="formData.name">
            </div>
            <div class="w-2/3 mt-4 border-4">
                <input class=" w-full" type="text" placeholder="Lietotājvārds" v-model="formData.nickname">
            </div>
            <div class="w-2/3 mt-4 border-4">
                <input class="w-full" type="text" placeholder="e-pasts" v-model="formData.email">
            </div>
            <div class="w-2/3 mt-4 border-4">
                <input class="w-full" type="password" placeholder="parole" v-model="formData.password">
            </div>
            <div class="w-2/3 mt-4 border-4">
                <input class="w-full" type="password" placeholder="atkārtota parole" v-model="formData.password_confirmation">
            </div>
          <button type="submit" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Reģistrēties</button>
        </form>
      </div>
    </div>
  </main>
</template>
