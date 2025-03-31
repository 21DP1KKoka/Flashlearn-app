<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { Constants } from '@/universal/Constants';
import { ref } from "vue";

let authorized = ref(false)

const token = localStorage.getItem(Constants.LOCAL_STORAGE.TOKEN);
if (!token ) {
  authorized.value = false
} else {
  authorized.value = true
}

const logout = async () => {
  const response = await fetch(Constants.API_URL + '/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(token)
  });
  if (response.error) {
    console.error(response.error);

  } else {
    console.log(response.data);
    localStorage.setItem(Constants.LOCAL_STORAGE.TOKEN, '');
    authorized.value = false
    window.location.href = '/';
  }
};
</script>

<template>
  <div class="bg-sky-100">
    <header>
        <nav class="flex items-center justify-end  bg-sky-300 w-full h-14 absolute">
          <div class="w-full flex justify-start">
            <RouterLink class="flex-none p-2 m-2 bg-sky-500 rounded-full hover:bg-sky-600 hover:scale-110"
                        to="/">Sākumlapa
            </RouterLink>
          </div>
          <RouterLink v-if="authorized === true" class="flex-none p-2 m-2 bg-sky-500 rounded-full hover:bg-sky-600 hover:scale-110"
                      to="/dashboard">Panelis
          </RouterLink>
          <RouterLink v-if="authorized === true" class="flex-none p-2 m-2 bg-sky-500 rounded-full hover:bg-sky-600 hover:scale-110"
                      to="/profile">Profils
          </RouterLink>
          <RouterLink v-if="authorized === false" class="p-2 m-2 bg-sky-500 rounded-full hover:bg-sky-600 hover:scale-110"
                      to="/register">Reģistrējies
          </RouterLink>
          <RouterLink v-if="authorized === false" class="p-2 m-2 bg-sky-500 rounded-full hover:bg-sky-600 hover:scale-110"
                      to="/login">Ienāc
          </RouterLink>
          <button @click="logout" v-if="authorized === true" class="flex-none p-2 m-2 bg-sky-500 rounded-full hover:bg-sky-600 hover:scale-110">
            Izlogoties
          </button>
        </nav>
    </header>

  <RouterView />
  </div>
</template>


