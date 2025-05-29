<script setup>
import {onMounted, ref} from 'vue'
import {expSidebar, selectedStatsId} from "../stores/reactives.js";
import axios from "axios";
import ApexCharts from 'apexcharts';

defineExpose({show})
const emit = defineEmits(["close"])

const showDialog = ref(false)
const collection_title = ref(null)
const statistics = ref([])
const lineChartSeries = ref([])
const stats_loaded = ref(false)

async function getCollectionStats(collection_id) {
  await axios.get(`/collection_statistics/${collection_id}`).then((response) => {

    statistics.value = response.data.data.reduce((acc, item) => {
      acc[item.coefficient] = (acc[item.coefficient] || 0) + 1;
      return acc;
    }, {});
    console.log(statistics.value)
    if (Object.keys(statistics.value).length === 0) {
      console.log("No data available, not updating chart.");
      return;
    }

    lineChartSeries.value = [
      {
        name: "Kartītes",
        data: Array.from({ length: 11 }, (_, i) => statistics.value[i] || 0),
      }
    ]
    console.log(stats_loaded.value)
    stats_loaded.value = true
    console.log(stats_loaded.value)
  })
}

function show(collection) {
  showDialog.value = true
  collection_title.value = collection.title
  getCollectionStats(collection.id);
}

function close() {
  showDialog.value = false
  lineChartSeries.value = []
  stats_loaded.value = false
  emit("close", )
}


const lineChartOptions = ref({
  xaxis: {
    text: "test",
    categories: [0,1,2,3,4,5,6,7,8,9,10],
  },
  chart: {
    toolbar: {
      show: true,
      offsetX: 0,
      offsetY: 0,
      tools: {
        download: true,
        selection: false,
        zoom: false,
        zoomin: false,
        zoomout: false,
        pan: false,
        reset: false | '<img src="/static/icons/reset.png" width="20">',
        customIcons: []
      },
    },
  },
  title: {
    text: "Koeficienti",
    align: "left"
  },
});
</script>

<template>
  <div v-if="showDialog" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center overflow-y-auto w-full h-full pl-14 z-50">
    <div class="flex flex-col items-center w-screen mt-32 ">
      <button @click="close" class="absolute right-0 mt-4 mr-c17 px-4 py-2 bg-blue-500 text-white rounded-lg">Aizvērt</button>
      <div class="flex flex-col w-2/3 items-center bg-white p-4 mb-12 rounded-2xl">

        <h1 class="text-2xl">{{collection_title}}</h1>
        <h1>Statistika par kolekciju</h1>

        <div class="w-2/3 flex flex-col text-center">
          <apexchart
              type="bar"
              :series="lineChartSeries"
              :options="lineChartOptions"/>
          <h1 v-if="!stats_loaded" class="font-bold text-2xl">Izvēlētajai kolekcijai šobrīd nepastāv dati!</h1>
          <h1 v-if="!stats_loaded" class=" text-md">Kolekciju dati atjaunojas reizi diennaktī plkst. 00:00</h1>
        </div>

      </div>


    </div>
  </div>
</template>

<style scoped>

</style>