<script setup>
import { ref } from 'vue'
import {expSidebar, selectedStatsId} from "../stores/reactives.js";
import axios from "axios";

defineExpose({show})
const emit = defineEmits(["close"])

const showDialog = ref(false)
const collection_id = ref(null)

async function getCollectionStats() {
  await axios.get(`/card_collections/stats/${collection_id.value}`).then((response) => {
    collections.value = response.data.data
  })
}

function show(id) {
  showDialog.value = true
  collection_id.value = id
}

function close() {
  showDialog.value = false
  emit("close", )
}

</script>

<template>
  <div v-if="showDialog" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center overflow-y-auto  w-full h-full pl-32 lg:pl-64 z-50">
    <div class="flex flex-col items-center w-screen mt-32 ">
      <div class="flex flex-col w-2/3 items-center bg-white p-4 mb-12 rounded-2xl">
        <button @click="close" :class="['absolute right-0 mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg', expSidebar.expanded ? 'mr-c15  ' : 'mr-c16']">Aizvērt</button>
        <h1>{{collection_id}}</h1>
        <h1>{{collection_id}}</h1>
      </div>


    </div>
  </div>
</template>

<style scoped>

</style>