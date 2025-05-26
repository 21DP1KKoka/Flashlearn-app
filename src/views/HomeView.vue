<script setup>
import axios from 'axios'
import {onMounted, ref} from "vue";


let catFact = ref();
async function getPlaces() {
  await axios.get("https://catfact.ninja/fact").then((response) => {
    console.log(response.data)
    catFact.value = response.data.fact;
  })
}

onMounted(async () => {
  await getPlaces();
});
</script>

<template>
  <main class="pt-16 w-screen h-full">
    <p class="text-center font-medium text-3xl">Sveicināti</p>
    <h1 class="text-center font-bold text-5xl"> FLASHLEARN!</h1>
    <h1>cat fact: {{catFact }}</h1>


  </main>
</template>
