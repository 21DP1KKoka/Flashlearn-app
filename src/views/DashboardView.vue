<script setup>
import {ref, onMounted, reactive, useTemplateRef} from "vue";
import {showModal} from "@/stores/reactives.js";
import axios from "axios";
import CreateCollection from "@/components/CreateCollection.vue";
import UpdateCollection from "@/components/UpdateCollection.vue";
import CollectionStatistics from "@/components/CollectionStatistics.vue";

const collections = ref([])
const collectionsStatisticsRef = useTemplateRef("collectionsStatistics")
const collectionUpdateRef = useTemplateRef("collectionUpdate")

async function getUserCollections() {
  await axios.get("/card_collections").then((response) => {
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
  collectionsStatisticsRef.value.show(id)
}

function openUpdateCollectionDialog(id) {
  collectionUpdateRef.value.show(id)
}
</script>

<template>
  <main>
    <h1 class="font-bold text-2xl text-center">Jūsu kolekcijas</h1>
      <button @click="createCollectionToggle"  class="p-2 m-4 bg-sky-400 rounded-xl hover:bg-sky-600 hover:scale-110">
        Jauna kolekcija
      </button>
      <button @click="editCollectionsToggle"  :class="['p-2 m-4 rounded-xl hover:scale-110',  editCollections ? 'bg-red-500 hover:bg-red-600' : 'bg-sky-400 hover:bg-sky-600' ]">
        {{ editCollections ? 'Beigt rediģēt' : 'Rediģēt kolekcijas' }}
      </button>
    <CreateCollection v-if="showModal.visible" @close="getUserCollections()"/>
    <UpdateCollection v-if="editCollections"/>
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
    <CollectionStatistics ref="collectionsStatistics" @close=""/>
  </main>
</template>


