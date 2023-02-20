<template>
    <div class="page">
        <div class="dashboard">
            <div class="header">
                <div class="title">
                <h1>{{ user.getUsername() }}'s greenhouses</h1>
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
                                <h1 class="name">{{ device.data.name }}</h1>
                                <div class="device-data">
                                    <div v-if="device.data.hasOwnProperty('value')">{{ device.data.value }}</div>
                                    <div v-if="device.data.hasOwnProperty('unit')">{{ device.data.unit }}</div>
                                    <label v-if="device.data.hasOwnProperty('on')" class="switch">
                                        <input type="checkbox" :checked="device.data.on" @click="toggle(device)">
                                        <span class="slider round"></span>
                                    </label>
                                </div>
                                <div class="settings" title="settings" @click="device.updating = true">
                                    <img src="@/assets/img/settings.png">
                                </div>
                            </div>
                            <div v-else class="device justify-between">
                                <input type="text" :placeholder="device.data.name" v-model="updatedDeviceName" class="device-input">
                                <div class="flex">
                                    <div @click="modifyDevice(device)" class="device-button">
                                        <img src="@/assets/img/done.png" class="w-6">
                                    </div>
                                    <div @click="confirmDeleteDevice(device.id)" class="device-button">
                                        <img src="@/assets/img/trash.png" class="w-6">
                                    </div>
                                    <div @click="device.updating = false" class="device-button">
                                        <img src="@/assets/img/cancel.png" class="w-6">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="flex justify-between">
                            <button class="space-button" @click="confirmDeleteSpace(space.id)">delete greenhouse</button>
                            <div class="flex gap-4">
                                <button class="space-button" @click="{sensorModal = true; newDeviceSpace = space.id}">+ add new sensor</button>
                                <button class="space-button" @click="{executorModal = true; newDeviceSpace = space.id}">+ add new executor</button>
                            </div>
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
    <Teleport to="#sensorModal">
        <div class="modal-bg" v-if="sensorModal">
            <div class="modal">
                <form>
                    <label>New sensor</label>
                    <input placeholder="name" v-model="newDeviceName" type="text">
                    <select v-model="newSensorUnit">
                        <option value="unit" selected disabled>unit</option>
                        <option v-for="unit in units" :value="unit.unit">{{ unit.measurement }} in {{ unit.unit }}</option>
                    </select>
                </form>
                <p class="message">{{ message }}</p>
                <div class="button-container">
                    <button @click="{sensorModal = false; message = ''}" class="cancel">cancel</button>
                    <button @click="newSensor()" class="create">create</button>
                </div>
            </div>
        </div>
    </Teleport>
    <Teleport to="#executorModal">
        <div class="modal-bg" v-if="executorModal">
            <div class="modal">
                <form>
                    <label>New executor</label>
                    <input placeholder="name" v-model="newDeviceName" type="text">
                </form>
                <p class="message">{{ message }}</p>
                <div class="button-container">
                    <button @click="{executorModal = false; message = ''}" class="cancel">cancel</button>
                    <button @click="newExecutor()" class="create">create</button>
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

import { getSpaces, getDevices, addSpace, deleteSpace, addDevice, deleteDevice, updateDevice, getUnits } from '@/firebase.js'

//

const router = useRouter()

const user = useStore()

//

const spaces = ref([])
const devices = ref([])

const units = ref([])

const spaceModal = ref(false)
const sensorModal = ref(false)
const executorModal = ref(false)

const newSpaceName = ref('')

const newDeviceName = ref('')
const newSensorUnit = ref('unit')
const newDeviceSpace = ref('')
const updatedDeviceName = ref('')

const message = ref('')

const newSpace = () => {
    if(newSpaceName.value != ''){
        addSpace({
            name: newSpaceName.value,
            user: user.getID()
        })
        newSpaceName.value = ''
        //
        spaceModal.value = false
    }
    else message.value = 'your new greenhouse needs a name !'
}

const newSensor = () => {
    if(newDeviceName.value == '')
        message.value = 'your new device needs a name !'
    else if(newSensorUnit.value == 'unit')
        message.value = 'select an unit to measure'
    else {
        addDevice({
            type: 'sensor',
            name: newDeviceName.value,
            space: newDeviceSpace.value,
            value: '-',
            unit: newSensorUnit.value,
            user: user.getID()
        })
        newDeviceName.value = ''
        newSensorUnit.value = 'unit'
        newDeviceSpace.value = ''
        //
        sensorModal.value = false
    }
}

const newExecutor = () => {
    if(newDeviceName.value == '')
        message.value = 'your new device needs a name !'
    else {
        addDevice({
            type: 'executor',
            name: newDeviceName.value,
            space: newDeviceSpace.value,
            on: false,
            user: user.getID()
        })
        newDeviceName.value = ''
        newDeviceSpace.value = ''
        //
        executorModal.value = false
    }
}

const modifyDevice = (device) => {
    if(updatedDeviceName.value == '')
        alert('name is empty')
    else {
        updateDevice(device.id, { name: updatedDeviceName.value })
        device.updating = false
    }
}

const confirmDeleteDevice = (id) => {
    if(confirm('continue deleting?'))
        deleteDevice(id)
}

const confirmDeleteSpace = (id) => {
    if(confirm('continue deleting?'))
        deleteSpace(id)
}

const toggle = (device) => updateDevice(device.id, { on: !device.data.on })

//

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

.title{ @apply text-4xl text-white font-bold }

.settings{ @apply w-8 hover:rotate-90 duration-300 cursor-pointer }

.logout{ @apply hover:scale-125 duration-300 cursor-pointer w-8 }

.spaces{ @apply w-full h-full overflow-y-auto p-12 flex flex-col gap-4 }

.space-header{ @apply bg-darkgreen p-4 flex justify-between items-center }

.name{ @apply text-xl text-white font-bold p-2 basis-1/2 }

.id{  @apply text-[#d6d6d6] font-thin }

.toggle{ @apply hover:bg-[#2f5d40] duration-200 cursor-pointer rounded-xl p-1 }

.devices{ @apply bg-green p-4 rounded-b-2xl flex flex-col gap-4 }

.device{ @apply flex items-center h-16 border-solid border-b-2 border-lightgreen }

.device-data{ @apply basis-1/2 flex gap-4 text-white font-bold }

.device-button{ @apply hover:bg-lightgreen cursor-pointer rounded-xl p-2 }

.device-input{ @apply p-2 rounded-xl }

.modal-bg{ @apply fixed top-0 left-0 w-full h-full flex justify-center items-center bg-opacity-50 bg-black }

.modal{ @apply relative bg-white p-12 flex flex-col gap-8 rounded-2xl }

.message{ @apply text-[#f1121f] h-4 }

form{ @apply w-96 flex flex-col gap-4 }

label{ @apply font-bold }

.modal input, .modal select{ @apply p-4 rounded-2xl }

.button-container{ @apply flex justify-end gap-4 }

.cancel, .create{ @apply duration-200 p-4 rounded-2xl }

.cancel{ @apply hover:bg-[#d6d6d6] }

.create{ @apply text-white bg-green hover:bg-lightgreen }

.new-space{ @apply font-bold hover:bg-[#d6d6d6] duration-200 p-2 rounded-2xl }

.space-button{ @apply text-white p-2 rounded-xl hover:bg-lightgreen duration-200 }

.switch, .switch input, .slider, .slider::before{ @apply rounded-2xl }

/* The switch - the box around the slider */
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: #264a33;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: #86cba2;
}

input:focus + .slider {
  box-shadow: 0 0 1px #86cba2;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

</style>