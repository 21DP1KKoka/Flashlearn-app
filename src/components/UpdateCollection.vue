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
  collection.showCards = !collection.showCards;
  newCard.value = [{card_front: "", card_back: ""}]
}
function toggleCardEdit(card) {
  collections.value.forEach(collection => {
    collection.cards.forEach(c => {
      if (c !== card) {
        c.editCard = false;
      }
    });
  });
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
        confirmDelete: false,
        cards: collection.cards.map(card => ({
          ...card,
          editCard: false,
          confirmDelete: false,
        }))
      };
    })
  })
}

async function createCard(collection) {
  await axios.post("/cards", {
    card_collection_id: collection.id,
    card_front: newCard.value.card_front,
    card_back: newCard.value.card_back,
  }).then((response) => {
    const newCardData = response.data.data;

    // Find the correct collection in `collections.value`
    const targetCollection = collections.value.find(c => c.id === collection.id);

    if (targetCollection) {
      targetCollection.cards.push({
        ...newCardData,
        editCard: false
      });
    }

    // Reset new card fields
    newCard.value.card_front = "";
    newCard.value.card_back = "";
  });
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

function confirmDelete(card) {
  if (card.confirmDelete) {
    deleteCard(card.id);
  } else {
    card.confirmDelete = true;
    setTimeout(() => {
      card.confirmDelete = false; // Reset confirmation after a few seconds
    }, 3000);
  }
}

async function deleteCard(id) {
  await axios.delete(`/cards/${id}`).then((response) => {
    console.log(response.data);
    collections.value.forEach(collection => {
      collection.cards = collection.cards.filter(card => card.id !== id);
    });
  });
}

function confirmDeleteCollection(collection) {
  if (collection.confirmDelete) {
    deleteCollection(collection.id);
  } else {
    collection.confirmDelete = true;
    setTimeout(() => {
      collection.confirmDelete = false; // Reset confirmation after a few seconds
    }, 3000);
  }
}

async function deleteCollection(id) {
  await axios.delete(`/card_collections/${id}`).then((response) => {
    console.log(response.data);
    collections.value = collections.value.filter(collection => collection.id !== id);
  });
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
      <div class="grow pr-4 overflow-auto ">
        <h1 class="text-2xl font-medium text-ellipsis break-words truncate hover:text-clip">{{ collection.title }}</h1>

        <div v-if="collection.showCards" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center overflow-y-auto w-full h-full pl-14 z-50">
          <div class="flex flex-col items-center w-screen mt-32">
            <button @click="toggleCards(collection)" class="absolute right-0 mt-4 mr-c17 px-4 py-2 bg-blue-500 text-white rounded-lg">Aizvērt</button>
            <button @click="confirmDeleteCollection(collection)" class="absolute left-0 mt-4 ml-c20 px-4 py-2 bg-red-500 text-white rounded-lg">{{ collection.confirmDelete ? 'Vai tiešām dzēst' : 'Dzēst Kolekciju?' }}</button>
            <div class="flex flex-col w-2/3 items-center bg-white p-4 mb-12 rounded-2xl">
              <h1 class="text-2xl font-bold">{{ collection.title }}</h1>
              <h2>Izveido kartītes vai rediģē tās</h2>
              <form @submit.prevent="createCard(collection)" class="flex flex-col items-center w-full mt-8">
                <label class="w-2/3 text-">Ievadi kartītes priekšpusi</label>
                <div class="w-2/3 border-4">
                  <input class="w-full rounded p-2" type="text" maxlength="255" placeholder="Kartītes priekšpuse" v-model="newCard.card_front">
                </div>
                <label class="w-2/3 mt-4">Ievadi kartītes mugurpusi</label>
                <div class="w-2/3 border-4">
                  <input class="w-full rounded p-2" type="text" maxlength="255" placeholder="Kartītes mugurpuse" v-model="newCard.card_back">
                </div>
                <button type="submit" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg ">Izveidot</button>
              </form>
              <div class="flex flex-row flex-wrap justify-center bg-white w-full">
                <div v-for="card in collection.cards" :key="card.id" class="flex items-start border-black border-2 rounded-xl w-1/2 xl:w-1/3 p-4 m-4">
                  <div v-if="!card.editCard" class="flex-auto ">
                    <div class="h-full  flex">
                      <div class="grow overflow-auto mr-4">
                        <h1 class="font-medium">Kartītes priekšpuse:</h1>
                        <h1 class="text-wrap hover:text-clip max-w-64 ">{{ card.card_front }}</h1>
                        <h1 class="font-medium" >Kartītes mugurpuse:</h1>
                        <h1 class="text-wrap hover:text-clip max-w-56">{{ card.card_back }}</h1>
                      </div>
                      <button @click="confirmDelete(card)" class="max-h-12 mt-4 px-4 py-2 bg-red-500 text-white rounded-lg">{{ card.confirmDelete ? 'Jā' : 'Dzēst?' }}</button>
                    </div>
                    <button @click="toggleCardEdit(card)" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">Rediģēt</button>
                  </div>

                  <form v-else @submit.prevent="updateCard(card.id, collection.id, card)" class="flex flex-col items-left w-full ">
                    <label class="w-2/3 text-">Ievadi kartītes priekšpusi</label>
                    <div class="w-fill border-4">
                      <input class="w-full" type="text" maxlength="256" placeholder="Kartītes priekšpuse" v-model="updatedCard.card_front">
                    </div>
                    <label class="w-2/3 mt-4">Ievadi kartītes mugurpusi</label>
                    <div class="w-fill border-4">
                      <input class="w-full" type="text" maxlength="256" placeholder="Kartītes mugurpuse" v-model="updatedCard.card_back">
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