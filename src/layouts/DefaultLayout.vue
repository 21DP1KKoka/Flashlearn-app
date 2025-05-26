<script setup>
import {RouterLink, useRouter} from "vue-router";
import axios  from "axios"
import {ref} from "vue";
import {expSidebar} from "@/stores/reactives.js";

const router = useRouter()

async function logout() {
  await axios.post("/logout").then(() => {
    localStorage.removeItem("token");
    router.push('/')
  })
}

function expandSidebar() {
  expSidebar.expanded = !expSidebar.expanded
}
</script>

<template>
  <nav class="flex items-center justify-end bg-sky-300 w-full h-14 fixed top-0 border-b-2 border-black shadow-xl">
    <div class="w-full flex justify-start">
      <RouterLink class="flex-none p-2 m-2 rounded-full hover:bg-sky-600 text-3xl font-bold hover:scale-105"
                  to="/home">FlashLearn
      </RouterLink>
    </div>
    <button @click="logout" class="flex-none p-2 m-2 bg-sky-500 rounded-full hover:bg-sky-600 hover:scale-110">
      Izlogoties
    </button>
  </nav>
 <div class="flex h-screen">
   <nav :class="['transition-all duration-200 flex flex-col pt-14 h-full flex-shrink-0 bg-sky-300 ', expSidebar.expanded ? 'w-1/6 min-w-36 max-w-64' : 'w-14']"> <!-- min-w-36 max-w-64 --->
       <button @click="expandSidebar" class="flex-none py-2 w-10 m-2 bg-sky-500 rounded-full hover:bg-sky-600 hover:scale-105">{{ expSidebar.expanded ? '<' : '>' }}</button>
     <RouterLink class="p-2 m-2 bg-sky-500 rounded-full hover:bg-sky-600 hover:scale-105 text-nowrap"
                 to="/dashboard">{{ expSidebar.expanded ? 'Jūsu kolekcijas' : 'Kol' }}
     </RouterLink>
     <RouterLink class="flex-none p-2 m-2 bg-sky-500 rounded-full hover:bg-sky-600 hover:scale-105"
                 to="/profile">{{ expSidebar.expanded ? 'Profils' : 'Prf' }}
     </RouterLink>
   </nav>
   <router-view :class="[' overflow-y-auto flex-1 bg-sky-100 w-fill pt-16 min-h-screen h-fill ']" />
 </div>
</template>

<style scoped>

</style>