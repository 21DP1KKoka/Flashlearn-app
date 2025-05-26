<script setup>
import axios from 'axios'
import {onMounted, ref} from "vue";

let catFact = ref();

async function getPlaces() {
  await axios.get("https://catfact.ninja/fact").then((response) => {
    catFact.value = response.data.fact;
  })
}

onMounted(async () => {
  await getPlaces();
});
</script>

<template>
  <main class="w-fill h-screen pt-16">
    <p class="text-center font-medium text-3xl">Sveicināti</p>
    <h1 class="text-center font-bold text-5xl"> FLASHLEARN!</h1>
    <div class="flex justify-center">
      <h1 class="w-2/3  pt-12 text-center font-bold text-2xl">Cat Fact: {{catFact}}</h1>
    </div>


  </main>
</template>
