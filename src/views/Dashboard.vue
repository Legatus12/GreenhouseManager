<template>
    <div class="page">
        <div class="dashboard">
            <div class="header">
                <div class="title">
                    <h1>Greenhouses</h1>
                    <div class="settings" @click="loadSettings()" title="settings">
                        <img src="@/assets/img/settings.png">
                    </div>
                </div>
                <div class="logout" @click="logout()" title="log out">
                    <img src="@/assets/img/logout.png">
                </div>
            </div>
            <div class="greenhouses">
                <div v-for="space in spaces" class="space">
                    <div>{{ space.name }}</div>
                    <div v-for="device in space.devices">{{ device  }}</div>
                </div>
            </div>
        </div>
    </div>
</template>


<script setup>

/* imports */
import { ref, shallowRef, reactive, onMounted } from 'vue'

import { useRouter } from 'vue-router'

import { useStore } from '@/stores/user.js'

import { getSpaces, getDevices } from '@/firebase.js'

//

const router = useRouter()

const user = useStore()

//

const spaces = ref([])

onMounted(() => {
    getSpaces(user.getUserID(), (docs) => {
        docs.forEach(async(doc) => {
            const space = doc.id
            const name = doc.data().name
            const devices = []
            await getDevices(user.getUserID(), space, (docs) => {
                docs.forEach(doc => {
                    devices.push(doc.data())
                console.log(doc.data())
                })
            })
            spaces.value.push({name, devices})
        })
    })
    spaces.value = [...spaces.value]
})

//

const loadSettings = () => router.push({ name: 'settings' })

const logout = () => router.push({ name: 'login' })

</script>


<style scoped>

.dashboard{ @apply w-full h-full flex flex-col }

.header{ @apply w-full flex justify-between items-center p-8 border-solid border-b-2 border-white }

.title{ @apply flex gap-8 items-center text-4xl text-white font-bold }

.settings{ @apply hover:rotate-90 duration-300 cursor-pointer }

.logout{ @apply hover:scale-125 duration-300 cursor-pointer }

.greenhouses{ @apply w-full h-full overflow-y-auto p-12 }

</style>