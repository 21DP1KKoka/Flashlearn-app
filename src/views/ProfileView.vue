<script setup>
import {onMounted, ref} from 'vue'
import axios from "axios";

const profileData = ref({
  username: '',
  email: '',
})
const profileDataUpdate = ref({
  username: "",
  email: "",
})
const edit = ref(false)

async function loadUserData() {
  await axios.get("/me").then((response) => {
    profileData.value.username = response.data.data.username
    profileData.value.email = response.data.data.email


  })
}
function toggleEdit(){
  edit.value = !edit.value;
  if (edit.value) {
  profileDataUpdate.value.username = profileData.value.username;
  profileDataUpdate.value.email = profileData.value.email;
  }
  else {
    profileDataUpdate.value.username = "";
    profileDataUpdate.value.email = "";
  }
}

async function updateUser() {
  const updatedFields = {};

  if (profileDataUpdate.value.username !== profileData.value.username) {
    updatedFields.username = profileDataUpdate.value.username;
  }

  if (profileDataUpdate.value.email !== profileData.value.email) {
    updatedFields.email = profileDataUpdate.value.email;
  }

  // If there are no changes, exit early
  if (Object.keys(updatedFields).length === 0) {
    return;
  }

  // Send only the changed fields
  await axios.post('/user/update', updatedFields).then((response) => {
    profileData.value.username = response.data.data.username;
    profileData.value.email = response.data.data.email;
  });
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
    <div class=" flex flex-col items-center mt-12 bg-white rounded-3xl border-2 border-black w-2/3 h-fill">
      <h1 class="font-bold text-4xl my-4">Profils</h1>
      <p class="text-xl font-bold ">Lietotājvārds: </p>
      <p class="text-2xl mb-4">{{ profileData.username }}</p>
      <p class="text-xl font-bold">E-pasts: </p>
      <p class="text-2xl mb-4">{{ profileData.email }}</p>
      <button v-if="!edit" @click="toggleEdit" type="submit" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded mb-4">Rediģēt</button>
      <form v-if="edit" @submit.prevent="login" class="flex flex-col items-center justify-center w-3/4 mt-8">
        <div class="w-2/3 mt-4 border-4">
          <input class="w-full" type="text" placeholder="Lietotājvārds" v-model="profileDataUpdate.username">
        </div>
        <div class="w-2/3 mt-4 border-4">
          <input class="w-full" type="text" placeholder="e-pasts" v-model="profileDataUpdate.email">
        </div>
        <button @click="updateUser" type="submit" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded mb-4">Atjaunot</button>
        <button @click="toggleEdit" type="submit" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded mb-4">Atcelt</button>
      </form>
    </div>

    <router-link v-if="profileData.username === 'admin'" :to="`/admin_panel`" class="mt-4 w-1/6 max-w-48 px-4 py-2 bg-blue-500 text-white rounded-lg">
      Administratora Panelis
    </router-link>
    <button v-if="profileData.username === 'admin'" @click="forceCoef" class="mt-4 w-1/6 max-w-48 px-4 py-2 bg-blue-500 text-white rounded-lg">GalaKoef/statistika</button>
    <button v-if="profileData.username === 'admin'" @click="forceTest" class="mt-4 w-1/6 max-w-48 px-4 py-2 bg-blue-500 text-white rounded-lg">Dienas tests</button>
  </main>
</template>
