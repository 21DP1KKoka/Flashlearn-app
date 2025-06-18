<script setup>
import axios from "axios";
import {onMounted, ref} from "vue";
import {RouterLink, useRoute} from "vue-router";
import {expSidebar} from "@/stores/reactives.js";

const route = useRoute()
const collection_not_received = ref(0)
const collection_title = ref()

async function checkIfOwner() {
  await axios.get(`checkOwner/${route.params.url}`).catch(function (error) {
    console.log(error.response.status);
    if (error.response.status == 422) {
      return collection_not_received.value = 422;
    }

  }).then((response) => {
    if (response.status == 200)
      receiveColletion();
  })
}
async function receiveColletion() {
  await axios.post('/card_collections/shared/' + route.fullPath.slice(21)).then((response) => {
    if(response.status == 200) {
      collection_title.value = response.data.data.title;
      collection_not_received.value = 200;
    }
    else {
      collection_not_received.value = 403;
    }
  })
}

onMounted(() => {
  checkIfOwner();
});
</script>

<template>
  <main>
    <h1 class="font-bold text-2xl text-center pb-4">Saņemtā kolekcija</h1>
    <div v-if="collection_not_received == 0" class="flex flex-col items-center">
      <h1 class="text-2xl ">Lūdzu uzgaidiet!</h1>
      <h1 class="text-2xl mb-4">Kolekcijas pieprasījums tiek apstrādāts!</h1>
    </div>
    <div v-else-if="collection_not_received == 403" class="flex flex-col items-center">
      <h1 class="text-2xl ">Notikusi kļūda!</h1>
      <h1 class="text-2xl mb-4">Kolekcijas piekļuves saite nepastāv vai jau ir izmantota!</h1>
    </div>
    <div v-else-if="collection_not_received == 422" class="flex flex-col items-center">
      <h1 class="text-2xl ">Šī ir jūsu kolekcija!</h1>
      <h1 class="text-2xl mb-4">Kolekcijas saite netika izmantota!</h1>
    </div>
    <div v-else class="flex flex-col items-center">
      <h1 class="text-2xl ">Kolekcijas piekļuve saņemta!</h1>
      <h1 class="text-2xl mb-4">Saņemtā kolekcija: {{collection_title}}</h1>
    </div>
    <div v-if="collection_not_received != 0 && collection_not_received != 422" class="flex flex-col items-center">
      <p>Doties uz saņemtajām kolekcijām kolekcijām</p>
      <RouterLink class="p-2 m-2 bg-sky-500 rounded-full hover:bg-sky-600 hover:scale-105 text-nowrap"
                  to="/shared_collections">Saņemtās kolekcijas
      </RouterLink>
    </div>
    <div v-if="collection_not_received == 422" class="flex flex-col items-center">
      <p>Atgriezties pie kolekcijām</p>
      <RouterLink class="p-2 m-2 bg-sky-500 rounded-full hover:bg-sky-600 hover:scale-105 text-nowrap"
                  to="/dashboard">Jūsu kolekcijas!
      </RouterLink>
    </div>
  </main>
</template>

<style scoped>

</style>