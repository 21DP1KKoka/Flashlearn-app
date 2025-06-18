<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const users = ref([]);

async function fetchUsers() {
  await axios.get('/users')
      .then((response) => {
        users.value = response.data.data;
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
}
async function denyAccess(userId) {
  const confirmDelete = confirm("Vai esat pārliecināts, ka vēlaties liegt piekļuvi šim lietotājam?");

  if (confirmDelete) {
    await axios.delete(`/users/${userId}`)
        .then(() => {
          users.value = users.value.filter(user => user.id !== userId);
        })
        .catch((error) => {
          console.error("Error deleting user:", error);
        });
  }
}

// Fetch users when component mounts
onMounted(fetchUsers);
</script>

<template>
  <main class="flex flex-col items-center text-center w-fill h-screen pt-16">
    <h1 class="font-bold text-4xl my-4">Administratora panelis</h1>
    <div class="flex flex-col items-center mt-12 bg-white rounded-3xl border-2 border-black w-2/3 min-h-32 h-fill p-4">
      <div v-for="user in users" :key="user.id" class="flex items-center justify-between w-full p-4 border-b">
        <p class="text-xl font-bold">{{ user.username }}</p>
        <button @click="denyAccess(user.id)" class="px-4 py-2 bg-red-500 text-white rounded-lg">Liegt piekļuvi</button>
      </div>
    </div>
  </main>
</template>

<style scoped>

</style>