<script setup>
import {onMounted, ref} from 'vue'
import axios from "axios";
import ApexCharts from 'apexcharts';

defineExpose({show})
const emit = defineEmits(["close"])

const showDialog = ref(false)
const collection_title = ref(null)
const collection_id = ref(null)
const statistics = ref([])
const lineChartSeries = ref([])
const stats_loaded = ref(false)
const daily_test_available = ref(false)
const daily_test_card_count = ref(null)
const sharedURL = ref();
const link_coppied = ref(false);

async function getCollectionStats(collection_id) {
  await axios.get(`/collection_statistics/${collection_id}`).then((response) => {

    statistics.value = response.data.data.reduce((acc, item) => {
      acc[item.coefficient] = (acc[item.coefficient] || 0) + 1;
      return acc;
    }, {});
    if (Object.keys(statistics.value).length === 0) {
      return; // nav datu ko parādīt diagrammā.
    }

    lineChartSeries.value = [
      {
        name: "Kartītes",
        data: Array.from({ length: 11 }, (_, i) => statistics.value[i] || 0),
      }
    ]
    stats_loaded.value = true
  })
}

async function getDailyTestInfo(collection_id) {
  await axios.get(`/daily_test/info/${collection_id}`).then((response) => {
    if(response.data.data == null || response.data.data.card_ids.length === 0) {
      return; // nav dienas kolekcijas
    }
    daily_test_card_count.value = response.data.data.card_ids.length
    daily_test_available.value = true
  })
}

function show(collection) {
  showDialog.value = true
  collection_title.value = collection.title
  collection_id.value = collection.id
  getCollectionStats(collection.id);
  getDailyTestInfo(collection.id)
}

function close() {
  showDialog.value = false
  lineChartSeries.value = []
  stats_loaded.value = false
  daily_test_available.value = false
  link_coppied.value = false
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

async function getShareLink(collection_id) {
  await axios.get(`/card_collections/generateURL/${collection_id}`).then((response) => {
    console.log(response.data)
    sharedURL.value = "http://localhost:5173/collection_received/" + response.data.slice(45)
  })
  await navigator.clipboard.writeText(sharedURL.value);
  link_coppied.value = true
}
async function coppyLink() {
  await navigator.clipboard.writeText(sharedURL.value);
}

</script>

<template>
  <div v-if="showDialog" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center overflow-y-auto w-full h-full pl-14 z-50">
    <div class="flex flex-col items-center w-screen mt-32 ">
      <button @click="close" class="absolute right-0 mt-4 mr-c17 px-4 py-2 bg-blue-500 text-white rounded-lg">Aizvērt</button>
      <div class="absolute left-0 ml-c20 flex max-w-64 flex-col">
        <button v-if="link_coppied" @click="coppyLink()" class="max-w-1/3 text-wrap mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">Atkārtoti kopēt saiti</button>
      </div>

      <div class="flex flex-col w-2/3 items-center bg-white p-4 pb-24 rounded-2xl">
        <h1 class="text-2xl">KOLEKCIJA</h1>
        <h1 class="text-2xl pb-4">{{collection_title}}</h1>
        <h1>Mācības</h1>
        <div class="flex gap-12 pb-4 w-full justify-center">
          <router-link :to="`/collections/${collection_id}/daily_test=${false}/shared=${true}`" class="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg">
            Pilnais tests
          </router-link>
          <router-link  v-if="daily_test_available" :to="`/collections/${collection_id}/daily_test=${true}/shared=${true}`" class="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg">
            Dienas tests
          </router-link>

        </div>
        <h1 v-if="daily_test_available" class=" pb-4">Dienas tests sastāv no : {{daily_test_card_count}} kartītes</h1>


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