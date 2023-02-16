<template>
    <div class="page">
        <div class="dashboard">
            <div class="header">
                <div class="title">
                    <h1>greenhouses</h1>
                    <div class="settings" title="settings">
                        <img src="@/assets/img/settings.png">
                    </div>
                </div>
                <div class="logout" @click="logout()" title="log out">
                    <img src="@/assets/img/logout.png">
                </div>
            </div>
            <div class="spaces">
                <div v-for="space in spaces" class="space">
                    <div class="space-header">
                        <div class="flex gap-8 items-center">
                            <h1 class="name">{{ space.name }}</h1>
                            <h1 class="id">{{ space.id }}</h1>
                        </div>
                        <div class="toggle" @click="space.control ? space.control = false : space.control = true">
                            <img src="@/assets/img/menu.png" class="w-12">
                        </div>
                    </div>
                    <div v-if="space.control == true" class="devices">
                        <div v-for="device in devices.filter(x => x.data.space == space.id)" class="device">
                            {{ device  }}
                        </div>
                        <div class="flex justify-end">
                            <button class="new-device" @click="deviceModal = true">add new device</button>
                        </div>
                    </div>
                </div>
                <button class="new-space" @click="spaceModal = true">+</button>
            </div>
        </div>
    </div>
    <Teleport to="#spaceModal">
        <div class="modal-bg" v-if="spaceModal">
            <div class="modal">
                <form>
                    <label>New space</label>
                    <input placeholder="name" type="text" v-model="newSpaceName">
                </form>
                <p class="text-[#f1121f]">{{ message }}</p>
                <div class="button-container">
                    <button @click="spaceModal = false" class="cancel">cancel</button>
                    <button @click="newSpace()" class="create">create</button>
                </div>
            </div>
        </div>
    </Teleport>
    <Teleport to="#deviceModal">
        <div class="modal-bg" v-if="deviceModal">
            <div class="modal">
                <form>
                    <label>New device</label>
                    <input placeholder="name" type="text">
                </form>
                <p>{{ message }}</p>
                <div class="button-container">
                    <button @click="deviceModal = false" class="cancel">cancel</button>
                    <button @click="newDevice()" class="create">create</button>
                </div>
            </div>
        </div>
    </Teleport>
</template>


<script setup>

/* imports */
import { ref,  onMounted } from 'vue'

import { useRouter } from 'vue-router'

import { useStore } from '@/stores/user.js'

import { getSpaces, getDevices, addSpace, addDevice } from '@/firebase.js'

//

const router = useRouter()

const user = useStore()

//

const spaces = ref([])
const devices = ref([])

const spaceModal = ref(false)
const deviceModal = ref(false)

const newSpaceName = ref('')
const newDeviceName = ref('')

const message = ref('')

const newSpace = () => {
    if(newSpaceName.value != ''){
        addSpace({
            name:  newSpaceName.value,
            user: user.getID()
        })
        spaceModal.value = false
    }
    else message.value = 'name is empty'
}

const newDevice = (space) => {
    if(false){
        addDevice({
            name: newDeviceName.value,
            space: space,
            user: user.getID()
        })
    } else message.value = '???'
}

const loadSpaces = () => {
    getSpaces(user.getID(), (spaceDocs) => {
        spaces.value = []
        spaceDocs.forEach(async(spaceDoc) => {
            spaces.value.push({id: spaceDoc.id, name: spaceDoc.data().name, control : false})
        })
    })
}

const loadDevices = () => {
    getDevices(user.getID(), (docs) => {
        devices.value = []
        docs.forEach(doc => devices.value.push({id: doc.id, data: doc.data()}))
    })
}

onMounted(() => {
    loadSpaces()
    loadDevices()
})

//

const logout = () => {
    user.logout()
    router.push({ name: 'login' })
}

</script>


<style scoped>

.dashboard{ @apply w-full h-full flex flex-col }

.header{ @apply w-full flex justify-between items-center p-8 bg-green }

.title{ @apply flex gap-8 items-center text-4xl text-white font-bold }

.settings{ @apply hover:rotate-90 duration-300 cursor-pointer }

.logout{ @apply hover:scale-125 duration-300 cursor-pointer }

.spaces{ @apply w-full h-full overflow-y-auto p-12 flex flex-col gap-4 }

.space-header{ @apply bg-darkgreen p-4 flex justify-between items-center }

.name{ @apply text-xl text-white font-bold }

.id{  @apply text-[#d6d6d6] font-thin }

.toggle{ @apply hover:bg-[#2f5d40] duration-200 cursor-pointer rounded-2xl p-1 }

.devices{ @apply bg-green p-4 rounded-b-2xl flex flex-col gap-4 }

.device{ @apply bg-none }

.modal-bg{ @apply fixed top-0 left-0 w-full h-full flex justify-center items-center bg-opacity-50 bg-black }

.modal{ @apply relative bg-white p-12 flex flex-col gap-8 rounded-2xl }

form{ @apply w-96 flex flex-col gap-4 }

label{ @apply font-bold }

input{ @apply p-4 rounded-2xl }

.button-container{ @apply flex justify-end gap-4 }

.cancel, .create{ @apply duration-200 p-4 rounded-2xl }

.cancel{ @apply hover:bg-[#d6d6d6] }

.create{ @apply text-white bg-green hover:bg-lightgreen }

.new-space{ @apply bg-lightgreen hover:bg-[#c1e4cf] duration-200 p-2 rounded-2xl }

.new-device{ @apply bg-white p-2 rounded-2xl mt-4 hover:bg-[#d6d6d6] duration-200 }

</style>