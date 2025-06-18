<script setup>
import axios from "axios";
import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";

const route = useRoute()
const collection = ref()
const dailyCollectionCardIds = ref([])
const flipCard = ref(false)
const cardFliped = ref(false)

const selectedCard = ref()
const results = []

async function getCollection() {
  await axios.get("/card_collections/" + route.params.id).then((response) => {
    collection.value = {
      ...response.data.data,
      showCards: false,
      cards: response.data.data.cards.map(card => ({
        ...card,
        cardUsed: false,
      }))
    };
    console.log("status: ", route.params.status)
    displayCard()
  })
}

async function getDailyCollection() {
  await axios.get(`/daily_test/${route.params.id}`).then((response) => {
    if(response.data.data !== null) {
      dailyCollectionCardIds.value = response.data.data.card_ids
      console.log("aaaaa",dailyCollectionCardIds.value)
    }
  })
}
async function sendResults() {
  await axios.post("/card_results", {
    card_collection_id:  route.params.id,
    card_results: results,
  }).then((response) => {
    console.log(response)
  })
}

async function sendDailyResults() {
  await axios.post("/card_result/daily", {
    card_collection_id:  route.params.id,
    card_results: results,
  }).then((response) => {
    console.log(response)
  })
}

function displayCard() {
  let unusedCards = [];
  if (route.params.status == "true") {
    unusedCards = collection.value.cards.filter(card =>
        !card.cardUsed && dailyCollectionCardIds.value.includes(card.id)
    );
  }
  else {
    console.log("full collection")
    unusedCards = collection.value.cards.filter(card => !card.cardUsed);
    console.log(unusedCards)
  }

  // const unusedCards = collection.value.cards.filter(card => !card.cardUsed);
  if (unusedCards.length === 0) {
    selectedCard.value = null;
    console.log("All cards have been used!");
    console.log(results)
    if (route.params.status == "true") {
      sendDailyResults()
    }
    else{
      sendResults()
    }
    return;
  }
  const randomIndex = Math.floor(Math.random() * unusedCards.length);
  selectedCard.value = unusedCards[randomIndex];
  const usedCard = collection.value.cards.find(card => card.id === selectedCard.value.id);
  usedCard.cardUsed = true;
}
function nextCard(result) {
  results.push({
  card_id: selectedCard.value.id,
  coefficient: result,
  })
  flipCard.value = false
  cardFliped.value = false
  displayCard();
}

onMounted(() => {
  if (route.params.status == "true") {
    getDailyCollection()
  }
  getCollection();
});

</script>

<template>
  <main>
    <div v-if="collection">
      <h1 class="text-center font-medium text-3xl">{{ collection.title }}</h1>
      <div v-if="selectedCard" class="flex flex-col items-center mt-12">
        <div class="flex flex-col justify-center items-center text-center overflow-auto bg-white w-2/5 h-96 border-black border-2 rounded-3xl">
          <div v-if="!flipCard" class="text-2xl font-medium text-wrap hover:text-clip ">{{selectedCard.card_front}}</div>
          <div v-else>
            <h1></h1>
            <h1 class="text-2xl font-medium text-wrap hover:text-clip">{{selectedCard.card_back}}</h1>
          </div>
        </div>
        <button @click="flipCard = !flipCard, cardFliped = true" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">Apgriezt kartīti</button>
      </div>
      <div v-if="selectedCard != null && cardFliped" class="flex gap-8 w-full justify-center mt-8">
        <button @click="nextCard(-1)" class=" px-4 py-2 bg-red-500 text-white rounded-lg">
          Neatceros</button>
        <button @click="nextCard(0)" class=" px-4 py-2 bg-red-400 text-white rounded-lg">
          Slikti atceros</button>
        <button @click="nextCard(1)" class=" px-4 py-2 bg-green-400 text-white rounded-lg">
          Atceros</button>
        <button @click="nextCard(2)" class=" px-4 py-2 bg-green-500 text-white rounded-lg">
          Pārāk vienkārši</button>
      </div>
      <div v-if="selectedCard == null" class="flex flex-col items-center">
        <div v-if="route.params.shared == 'false'" class="flex flex-col items-center">
          <h1 class="text-2xl font-bold text-center my-4">Visas kartītes izskatītas!</h1>
          <router-link to="/dashboard" class=" px-4 py-2 bg-blue-500 text-white rounded-lg">Atgriezties pie kolekcījām</router-link>
        </div>
        <div v-else class="flex flex-col items-center">
          <h1 class="text-2xl font-bold text-center my-4">Visas kartītes izskatītas!</h1>
          <router-link to="/shared_collections" class=" px-4 py-2 bg-blue-500 text-white rounded-lg">Atgriezties pie saņemtajām kolekcījām</router-link>
        </div>

      </div>
    </div>
  </main>
</template>

<style scoped>

</style>