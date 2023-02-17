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
                            <img src="@/assets/img/menu.png" class="w-8">
                        </div>
                    </div>
                    <div v-if="space.control == true" class="devices">
                        <div v-for="device in devices.filter(x => x.data.space == space.id)">
                            <div v-if="!device.updating" class="device">
                                <div class="flex gap-8 items-center">
                                    <h1 class="name">{{ device.data.name }}</h1>
                                    <h1 class="id">{{ device.id }}</h1>
                                </div>
                                <div @click="device.updating = true">
                                    <img src="@/assets/img/edit.png" class="w-8">
                                </div>
                            </div>
                            <div v-else class="device">
                                <div class="flex gap-8 items-center">
                                    <input type="text" :value="device.data.name">
                                    <input type="text" :value="device.id">
                                </div>
                                <div @click="device.updating = false">
                                    <img src="@/assets/img/done.png" class="w-8">
                                </div>
                            </div>
                        </div>
                        <div class="flex justify-end">
                            <button class="new-device" @click="{deviceModal = true; newDeviceSpace = space.id}">+ add new device</button>
                        </div>
                    </div>
                </div>
                <button class="new-space" @click="spaceModal = true">+ add new greenhouse</button>
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
                <p class="message">{{ message }}</p>
                <div class="button-container">
                    <button @click="{spaceModal = false; message = ''}" class="cancel">cancel</button>
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
                    <input placeholder="name" v-model="newDeviceName" type="text">
                    <select v-model="newDeviceUnit">
                        <option value="unit" selected disabled>unit</option>
                        <option v-for="unit in units">{{ unit.measurement }} in {{ unit.unit }}</option>
                    </select>
                </form>
                <p class="message">{{ message }}</p>
                <div class="button-container">
                    <button @click="{deviceModal = false; message = ''}" class="cancel">cancel</button>
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

import { getSpaces, getDevices, addSpace, addDevice, deleteDevice, getUnits } from '@/firebase.js'

//

const router = useRouter()

const user = useStore()

//

const spaces = ref([])
const devices = ref([])

const units = ref([])

const spaceModal = ref(false)
const deviceModal = ref(false)

const newSpaceName = ref('')

const newDeviceName = ref('')
const newDeviceUnit = ref('unit')
const newDeviceSpace = ref('')

const message = ref('')

const newSpace = () => {
    if(newSpaceName.value != ''){
        addSpace({
            name:  newSpaceName.value,
            user: user.getID()
        })
        newSpaceName.value = ''
        //
        spaceModal.value = false
    }
    else message.value = 'your new greenhouse needs a name !'
}

const newDevice = () => {
    if(newDeviceName.value == '')
        message.value = 'your new device needs a name !'
    else if(newDeviceUnit.value == 'unit')
        message.value = 'select an unit to measure'
    else {
        addDevice({
            name: newDeviceName.value,
            space: newDeviceSpace.value,
            value: '-',
            user: user.getID()
        })
        newDeviceName.value = ''
        newDeviceUnit.value = 'unit'
        newDeviceSpace.value = ''
        //
        deviceModal.value = false
    }
}


const loadSpaces = () => {
    getSpaces(user.getID(), (spaceDocs) => {
        spaces.value = []
        spaceDocs.forEach(spaceDoc => {
            spaces.value.push({id: spaceDoc.id, name: spaceDoc.data().name, control : false})
        })
    })
}

const loadDevices = () => {
    getDevices(user.getID(), deviceDocs => {
        devices.value = []
        deviceDocs.forEach(deviceDoc => devices.value.push({id: deviceDoc.id, data: deviceDoc.data(), updatig : false}))
    })
}

const loadUnits = () => {
    getUnits((unitDocs) => {
        units.value = []
        unitDocs.forEach(unitDoc => units.value.push(unitDoc.data()))
    })
}

onMounted(() => {
    loadSpaces()
    loadDevices()
    loadUnits()
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

.device{ @apply flex justify-between items-center h-16 }

.modal-bg{ @apply fixed top-0 left-0 w-full h-full flex justify-center items-center bg-opacity-50 bg-black }

.modal{ @apply relative bg-white p-12 flex flex-col gap-8 rounded-2xl }

.message{ @apply text-[#f1121f] h-4 }

form{ @apply w-96 flex flex-col gap-4 }

label{ @apply font-bold }

input, select{ @apply p-4 rounded-2xl }

.button-container{ @apply flex justify-end gap-4 }

.cancel, .create{ @apply duration-200 p-4 rounded-2xl }

.cancel{ @apply hover:bg-[#d6d6d6] }

.create{ @apply text-white bg-green hover:bg-lightgreen }

.new-space{ @apply font-bold hover:bg-[#d6d6d6] duration-200 p-2 rounded-2xl }

.new-device{ @apply text-white font-bold p-2 rounded-2xl mt-4 hover:bg-lightgreen duration-200 }

</style>