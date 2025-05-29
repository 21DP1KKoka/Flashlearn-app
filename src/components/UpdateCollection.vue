<script setup>
import axios from "axios"
import {onMounted, ref} from "vue";

const emit = defineEmits(["close"])

const updatedCard = ref( {
  card_front: "",
  card_back: "",
})

const collections = ref([])
const cards = ref([])
const newCard = ref( {
  card_front: "",
  card_back: "",
})

function toggleCards(collection) {
  // collections.value[index].showCards = !collections.value[index].showCards;
  collection.showCards = !collection.showCards;
}
function toggleCardEdit(card) {
  // const card = collections.value[collectionIndex].cards[cardIndex];
  card.editCard = !card.editCard;
  if (card.editCard) {
    updatedCard.value.card_front = card.card_front
    updatedCard.value.card_back = card.card_back
  }
  else {
    updatedCard.value.card_front = ""
    updatedCard.value.card_back = ""
  }
}

async function getUserCollections() {
  await axios.get("/card_collections").then((response) => {
    collections.value = response.data.data.map(collection => {
      return {
        ...collection,
        showCards: false,
        cards: collection.cards.map(card => ({
          ...card,
          editCard: false
        }))
      };
    })
  })
}
// TODO pievienot editam un new card
async function createCard(collection) {
  await axios.post("/cards", {
    card_collection_id: collection.id,
    card_front: newCard.value.card_front,
    card_back: newCard.value.card_back,
  }).then((response) => {
    cards.value.push(response.data.data)
    newCard.value.card_front = ""
    newCard.value.card_back = ""
    // getUserCollections()
  })
}
async function updateCard(id, collection_id, card) {
  await axios.put(`/cards/${id}`, {
    card_collection_id: collection_id,
    card_front: updatedCard.value.card_front,
    card_back: updatedCard.value.card_back,
  }).then((response) => {
    console.log(response.data)
    card.card_front = updatedCard.value.card_front
    card.card_back = updatedCard.value.card_back
    toggleCardEdit(card)
  })
}

onMounted(() => {
  getUserCollections();
});

function close() {
  emit("close",)
}
</script>

<template>
  <div class="flex flex-row flex-wrap justify-center  w-fill rounded-xl mx-4">
    <div v-for="collection in collections" :key="collection.id" class="flex items-center bg-white border-black border-2 rounded-xl w-1/3 xl:w-1/4 p-4 m-4">
      <div class="flex-auto ">
        <h1 class=" text-2xl font-medium">{{ collection.title }}</h1>

        <div v-if="collection.showCards" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center overflow-y-auto w-full h-full pl-14 z-50">
          <div class="flex flex-col items-center w-screen mt-32">
            <button @click="toggleCards(collection)" class="absolute right-0 mt-4 mr-c17 px-4 py-2 bg-blue-500 text-white rounded-lg">Aizvērt</button>
            <button @click="toggleCards(collection)" class="absolute left-0 mt-4 ml-c20 px-4 py-2 bg-blue-500 text-white rounded-lg">Dzēst kolekciju</button>
            <div class="flex flex-col w-2/3 items-center bg-white p-4 mb-12 rounded-2xl">
              <h1 class="text-2xl font-bold">{{ collection.title }}</h1>
              <h2>Izveido kartītes vai rediģē tās</h2>
              <form @submit.prevent="createCard(collection)" class="flex flex-col items-center w-full mt-8">
                <label class="w-2/3 text-">Ievadi kartītes priekšpusi</label>
                <div class="w-2/3 border-4">
                  <input class="w-full rounded p-2" type="text" placeholder="Kartītes priekšpuse" v-model="newCard.card_front">
                </div>
                <label class="w-2/3 mt-4">Ievadi kartītes mugurpusi</label>
                <div class="w-2/3 border-4">
                  <input class="w-full rounded p-2" type="text" placeholder="Kartītes mugurpuse" v-model="newCard.card_back">
                </div>
                <button type="submit" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg ">Izveidot</button>
              </form>
              <div class="flex flex-row flex-wrap justify-center bg-white w-full">
                <div v-for="card in collection.cards" :key="card.id" class="flex items-center border-black border-2 rounded-xl w-1/2 xl:w-1/3 p-4 m-4">
                  <div v-if="!card.editCard" class="flex-auto ">
                    <div class="h-full w-full">
                      <h1 class="font-medium">Kartītes priekšpuse:</h1>
                      <h1>{{ card.card_front }}</h1>
                      <h1 class="font-medium" >Kartītes mugurpuse:</h1>
                      <h1>{{ card.card_back }}</h1>
                    </div>
                    <button @click="toggleCardEdit(card)" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">Rediģēt</button>
                  </div>

                  <form v-else @submit.prevent="updateCard(card.id, collection.id, card)" class="flex flex-col items-left w-full ">
                    <label class="w-2/3 text-">Ievadi kartītes priekšpusi</label>
                    <div class="w-fill border-4">
                      <input class="w-full" type="text" placeholder="Kartītes priekšpuse" v-model="updatedCard.card_front">
                    </div>
                    <label class="w-2/3 mt-4">Ievadi kartītes mugurpusi</label>
                    <div class="w-fill border-4">
                      <input class="w-full" type="text" placeholder="Kartītes mugurpuse" v-model="updatedCard.card_back">
                    </div>
                    <button type="submit" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg flex-1 ">Atjaunot</button>
                    <button @click="toggleCardEdit(card); updatedCard.card_front = '';  updatedCard.card_back = '';"
                            type="reset" class="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg flex-1 ">Atcelt
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button @click="toggleCards(collection)" class=" px-4 py-2 bg-blue-500 text-white rounded-lg">Rediģēt</button>
    </div>
  </div>
</template>

<style scoped>

</style>