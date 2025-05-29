  <script setup>
  import axios from "axios"
  import {onMounted, ref} from "vue";
  import {showModal, expSidebar} from "@/stores/reactives.js";

  const emit = defineEmits(["close"])

  const newCollection = ref( {
    title: "",
    collection_id: "",
  })

  const newCard = ref( {
    card_front: "",
    card_back: "",
  })

  const updatedCard = ref( {
    card_front: "",
    card_back: "",
  })

  const cards = ref([])

  async function createCollection() {
    await axios.post("/card_collections", newCollection.value).then((response) => {
      newCollection.value.collection_id = response.data.data.id
    })
  }
  function toggleCardEdit(card) {
    // const card = collections.value[collectionIndex].cards[cardIndex];
    card.editCard = !card.editCard;
  }

  async function createCard() {
    await axios.post("/cards", {
      card_collection_id: newCollection.value.collection_id,
      card_front: newCard.value.card_front,
      card_back: newCard.value.card_back,
    }).then((response) => {
      cards.value.push(response.data.data)
      newCard.value.card_front = ""
      newCard.value.card_back = ""
    })
  }

  async function updateCard(id, card) {
    await axios.put(`/cards/${id}`, {
      card_collection_id: newCollection.value.collection_id,
      card_front: updatedCard.value.card_front,
      card_back: updatedCard.value.card_back,
    }).then((response) => {
      console.log(response.data)
      card.card_front = updatedCard.value.card_front
      card.card_back = updatedCard.value.card_back
      toggleCardEdit(card)
    })
  }

  function close() {
    console.log("tatat")
    emit("close",)
  }
  </script>

  <template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center overflow-y-auto w-full h-full pl-14 z-50">
      <div class="flex flex-col items-center w-screen mt-32">
        <button @click="() => { close(); showModal.visible = false; }" class="absolute right-0 mt-4 mr-c17 px-4 py-2 bg-blue-500 text-white rounded-lg">Aizvērt</button>
        <div v-if="!newCollection.collection_id" class="flex flex-col w-2/3 items-center bg-white rounded-2xl p-4 mb-8">
          <h1 class="text-2xl font-medium">{{newCollection.title || "Jauna kolekcija"}}</h1>
          <form @submit.prevent="createCollection" class="flex flex-col items-center w-full">
            <div class="w-2/3 mt-4 border-4 rounded">
              <input class="w-full rounded p-2" type="text" placeholder="Kolekcijas nosaukums" v-model="newCollection.title">
            </div>
            <button type="submit" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">Izveidot</button>
          </form>
        </div>
        <div v-else class="flex flex-col w-2/3 items-center bg-white p-4 mb-12 rounded-2xl">
          <h1 class="text-2xl font-medium">{{newCollection.title}}</h1>
          <h2>Izveido kartītes</h2>
          <form @submit.prevent="createCard" class="flex flex-col items-center w-full mt-8">
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
            <div v-for="(card, index) in cards" :key="card.id" class="flex items-center border-black border-2 rounded-xl w-1/2 xl:w-1/3 p-4 m-4">
              <div v-if="!card.editCard" class="flex-auto ">
<!--                <h1>card_id: {{ card.id }}</h1> &lt;!&ndash; nozīmē to ka glabā card_id lai varētu edit un delete&ndash;&gt;-->
                <h1 class="font-medium">Kartītes priekšpuse:</h1>
                <h1>{{ card.card_front }}</h1>
                <h1 class="font-medium" >Kartītes mugurpuse:</h1>
                <h1>{{ card.card_back }}</h1>
                <button @click="toggleCardEdit(card)" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">Rediģēt</button>
              </div>


              <form v-else @submit.prevent="updateCard(card.id, card)" class="flex flex-col items-left w-full ">
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

  </template>

  <style scoped>

  </style>