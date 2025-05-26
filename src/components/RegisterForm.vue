<script setup>
import { ref } from 'vue'
import axios from "axios";
import {useRouter} from "vue-router";

const router = useRouter()

const formData = ref({
  username: '',
  email: '',
  password: '',
  password_confirmation: '',
})

async function register() {
  await axios.post("/register", formData.value).then((response) => {
    console.log(response.data.data)
    localStorage.setItem("token", response.data.data.token);
    router.push('/dashboard')
  })
}
</script>

<template>
  <main class="flex justify-center text-center w-screen h-screen pt-12">
    <div class="mt-12 bg-white rounded-3xl w-2/3 h-2/3">
      <div class="w-full flex flex-col items-center justify-center">
        <h1 class="mt-12 font-bold text-2xl">Reģistrācija</h1>
        <form @submit.prevent="register" class="flex flex-col items-center justify-center w-3/4 mt-8">
            <div class="w-2/3 mt-4 border-4">
                <input class=" w-full" type="text" placeholder="Lietotājvārds" v-model="formData.username">
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
