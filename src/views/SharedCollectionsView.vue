<script setup>
import {ref, onMounted, reactive, useTemplateRef} from "vue";
import {showModal} from "@/stores/reactives.js";
import axios from "axios";
import SharedCollectionStatistics from "@/components/SharedCollectionStatistics.vue";

const collections = ref([])
const sharedCollectionsStatisticsRef = useTemplateRef("sharedCollectionsStatistics")

async function getUserCollections() {
  await axios.get("/card_collection/shared").then((response) => {
    collections.value = response.data.data
  })
}

function createCollectionToggle() {
  showModal.visible = !showModal.visible
  if (!showModal.visible) {
    getUserCollections();
  }
}

const editCollections = ref(false)

function editCollectionsToggle() {
  editCollections.value = !editCollections.value
  if (!editCollections.value) {
    getUserCollections();
  }
}



onMounted(() => {
  getUserCollections();
});

function openStatisticsDialog(id) {
  sharedCollectionsStatisticsRef.value.show(id)
}
</script>

<template>
  <main>
    <h1 class="font-bold text-2xl text-center">Saņemtās kolekcijas</h1>
    <div v-if="!editCollections" class="flex flex-row flex-wrap justify-center  w-fill rounded-xl mx-4">
      <div v-for="(collection) in collections" :key="collection.id" class="flex items-center bg-white border-black border-2 rounded-xl max-h-32 min-w-80 w-1/3 lg:w-1/3 xl:w-1/4 p-4 m-4">
        <div class="grow pr-4 overflow-auto ">
          <h1 class="text-2xl font-medium text-ellipsis break-words truncate hover:text-clip">{{ collection.title }}</h1>
        </div>
        <div class="flex flex-col text-center">

          <button @click="openStatisticsDialog(collection)" class=" px-4 py-2 bg-blue-500 text-white rounded-lg">Atvērt</button>
        </div>
      </div>
    </div>
    <SharedCollectionStatistics ref="sharedCollectionsStatistics" @close=""/>
  </main>
</template>


