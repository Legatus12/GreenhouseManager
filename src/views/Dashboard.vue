<template>
    <div class="page">
        <div class="dashboard">
            <div class="header">
                <div class="title">
                    <h1>Greenhouses</h1>
                    <div class="settings" title="settings">
                        <img src="@/assets/img/settings.png">
                    </div>
                </div>
                <div class="logout" @click="logout()" title="log out">
                    <img src="@/assets/img/logout.png">
                </div>
            </div>
            <div class="greenhouses">
                <div v-for="space in spaces" class="space">
                    <div>
                        <h2>{{ space.id }}</h2>
                        <div class="flex gap-4">
                            <h2>{{ space.name }}</h2><button @click="space.control ? space.control = false : space.control = true">+</button>
                        </div>
                        <div v-if="space.control == true">
                            <p v-for="device in devices.filter(x => x.data.space == space.id)" class="device">{{ device  }}</p>
                            <button @click="newDevice(space.id)">+ new device</button>
                        </div>
                    </div>
                </div>
                <button class="bg-[#a2cbaf] p-2" @click="newSpace()">+</button>
            </div>
        </div>
    </div>
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

const newSpace = () => {
    addSpace({
        name:  "newSpace",
        user: user.getID()
    })
}

const newDevice = (space) => {
    addDevice({
        name: "newDEvice",
        space: space,
        user: user.getID()
    })
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

.greenhouses{ @apply w-full h-full overflow-y-auto p-12 flex flex-col gap-4 }

.space{ @apply bg-green p-2 }

h2{ @apply p-2 }

.device{ @apply bg-white }

</style>