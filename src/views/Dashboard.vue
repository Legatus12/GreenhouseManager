<template>
    <div class="page">
        <div class="dashboard">
            <!--cabecera-->
            <div class="header">
                <div class="title">
                <h1>Espacios de <span class="font-bold">{{ user.getUsername() }}</span></h1>
                </div>
                <div class="logout" @click="logout()" title="cerrar sesión">
                    <img src="@/assets/img/logout.png">
                </div>
            </div>
            <!--espacios-->
            <div class="spaces">
                <div v-for="space in spaces" class="space">
                    <div class="space-header">
                        <div class="flex gap-4 items-center">
                            <h1 class="space-name">{{ space.name }}</h1>
                            <h1 class="id">{{ space.id }}</h1>
                        </div>
                        <!--control del desplegable del espacio-->
                        <div class="toggle" @click="space.control ? space.control = false : space.control = true">
                            <img src="@/assets/img/menu.png" class="w-8">
                        </div>
                    </div>
                    <!--desplegable que muestra los dispositivos de un espacio implementado como solución temporal a un extraño problema de reactividad-->
                    <div v-if="space.control == true" class="devices">
                        <div v-for="device in devices.filter(x => x.data.space == space.id)">
                            <!--dispositivo-->
                            <div v-if="!device.updating" class="device">
                                <div class="device-info">
                                    <h2 class="name">{{ device.data.name }}</h2>
                                    <h2 class="id">{{ device.id }}</h2>
                                </div>
                                <div class="device-data">
                                    <div v-if="device.data.type == 'sensor'">
                                        {{ device.data.value }} {{ device.data.unit }}
                                    </div>
                                    <div v-if="device.data.type == 'ejecutor'" class="flex items-center gap-4">
                                        <label class="switch">
                                            <input type="checkbox" :checked="device.data.on" @click="toggle(device)">
                                            <span class="slider round"></span>
                                        </label>
                                        <p class="font-light text-sm">última modificación: </p><p class="text-sm"> {{ device.data.date }}</p>
                                    </div>
                                </div>
                                <div class="settings" title="settings" @click="{devices.map(x => x.updating = false); device.updating = true}">
                                    <img src="@/assets/img/settings.png">
                                </div>
                            </div>
                            <!--dispositivo siendo editado-->
                            <div v-else class="device justify-between">
                                <input type="text" :placeholder="device.data.name" v-model="updatedDeviceName" class="device-input">
                                <div class="flex">
                                    <div @click="modifyDevice(device)" class="device-button">
                                        <img src="@/assets/img/done.png" class="w-6">
                                    </div>
                                    <div @click="confirmDeleteDevice(device.id)" class="device-button">
                                        <img src="@/assets/img/trash.png" class="w-6">
                                    </div>
                                    <div @click="{device.updating = false; updatedDeviceName = ''}" class="device-button">
                                        <img src="@/assets/img/cancel.png" class="w-6">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!--opciones del espacio-->
                        <div class="flex justify-between">
                            <button class="space-button" @click="confirmDeleteSpace(space.id)">borrar espacio</button>
                            <div class="flex gap-4">
                                <button class="space-button" @click="{sensorModal = true; newDeviceSpace = {id: space.id, name: space.name}}">+ añadir sensor</button>
                                <button class="space-button" @click="{executorModal = true; newDeviceSpace = {id: space.id, name: space.name}}">+ añadir ejecutor</button>
                            </div>
                        </div>
                    </div>
                </div>
                <button class="new-space" @click="spaceModal = true">+ añadir espacio</button>
            </div>
        </div>
    </div>
    <!--modal de creacion de nuevo espacio-->
    <Teleport to="#spaceModal">
        <div class="modal-bg" v-if="spaceModal">
            <div class="modal">
                <form>
                    <label>Nuevo espacio</label>
                    <input placeholder="nombre" type="text" v-model="newSpaceName">
                </form>
                <p class="message">{{ message }}</p>
                <div class="button-container">
                    <button @click="closeModal()" class="cancel">cancelar</button>
                    <button @click="newSpace()" class="create">añadir</button>
                </div>
            </div>
        </div>
    </Teleport>
    <!--modal de creacion de nuevo sensor-->
    <Teleport to="#sensorModal">
        <div class="modal-bg" v-if="sensorModal">
            <div class="modal">
                <form>
                    <label>Creando nuevo sensor en "{{ newDeviceSpace.name }}"</label>
                    <input placeholder="nombre" v-model="newDeviceName" type="text">
                    <label>¿Qué va a medir este sensor?</label>
                    <select v-model="newSensorUnit">
                        <option value="unidad" selected disabled>unidad</option>
                        <option v-for="unit in units" :value="unit.unit">{{ unit.measurement }} en {{ unit.unit }}</option>
                    </select>
                </form>
                <p class="message">{{ message }}</p>
                <div class="button-container">
                    <button @click="closeModal()" class="cancel">cancelar</button>
                    <button @click="newSensor()" class="create">añadir</button>
                </div>
            </div>
        </div>
    </Teleport>
    <!--modal de creacion de nuevo ejecutor-->
    <Teleport to="#executorModal">
        <div class="modal-bg" v-if="executorModal">
            <div class="modal">
                <form>
                    <label>Creando nuevo ejecutor en "{{ newDeviceSpace.name }}"</label>
                    <input placeholder="nombre" v-model="newDeviceName" type="text">
                </form>
                <p class="message">{{ message }}</p>
                <div class="button-container">
                    <button @click="closeModal()" class="cancel">cancelar</button>
                    <button @click="newExecutor()" class="create">añadir</button>
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

const spaces = ref([]) // espacios de un usuario
const devices = ref([]) // dispositivos de un usuario

const spaceModal = ref(false) // control del modal de creacion de espacios
const sensorModal = ref(false) // control del modal de creacion de sensores
const executorModal = ref(false) // control del modal de creacion de ejecutores

const newSpaceName = ref('') // v-model del input del nuevo nombre que tiene un espacio creado

const newDeviceName = ref('') // v-model del input del nuevo nombre que tiene un dispositivo creado
const updatedDeviceName = ref('') // v-model del input del nuevo nombre que tiene un dispositivo editado
const newSensorUnit = ref('unidad') // v-model del input del nuevo parámetro que mide un dispositivo creado
const newDeviceSpace = ref({}) // id y nombre del espacio a asignar a la hora de crear un nuevo dispositivo

const units = ref([]) // unidades de medida utlizadas en la creacion de sensores

const message = ref('')

const newSpace = () => {
    if(newSpaceName.value != ''){
        addSpace({
            name: newSpaceName.value,
            user: user.getID()
        })
        closeModal()
    }
    else message.value = '¡Tu nuevo espacio necesita un nombre!'
}

const newSensor = () => {
    if(newDeviceName.value == '')
        message.value = '¡Tu nuevo sensor necesita un nombre!'
    else if(newSensorUnit.value == 'unidad')
        message.value = 'selecciona una unidad a medir'
    else {
        addDevice({
            type: 'sensor',
            name: newDeviceName.value,
            space: newDeviceSpace.value.id,
            value: '-',
            unit: newSensorUnit.value,
            user: user.getID()
        })
        closeModal()
    }
}

const newExecutor = () => {
    if(newDeviceName.value == '')
        message.value = '¡Tu nuevo ejecutor necesita necesita un nombre!'
    else {
        addDevice({
            type: 'ejecutor',
            name: newDeviceName.value,
            space: newDeviceSpace.value.id,
            on: false,
            user: user.getID(),
            date: '-'
        })
        closeModal()
    }
}

const closeModal = () => {
    newSpaceName.value = ''
    newDeviceName.value = ''
    newDeviceSpace.value = {}
    newSensorUnit.value = 'unidad'
    spaceModal.value = false
    sensorModal.value = false
    executorModal.value = false
    message.value = ''
}

const modifyDevice = (device) => {
    if(updatedDeviceName.value == '')
        alert('el nombre no puede estar vacío')
    else {
        updateDevice(device.id, { name: updatedDeviceName.value })
        device.updating = false
        updatedDeviceName.value = ''
    }
}

const confirmDeleteDevice = (id) => {
    if(confirm('¿desea continuar con el borrado?'))
        deleteDevice(id)
}

const confirmDeleteSpace = (id) => {
    if(confirm('¿desea continuar con el borrado?'))
        deleteSpace(id)
}

const toggle = (device) => updateDevice(device.id, { on: !device.data.on, date: generateDate() })

const generateDate = () => {
    const date = new Date()
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth()+1).padStart(2, '0')}/${String(date.getFullYear()).substring(2)} - ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`
}

// obtencion de los espacios de un usuario
const loadSpaces = () => {
    getSpaces(user.getID(), (spaceDocs) => {
        spaces.value = []
        spaceDocs.forEach(spaceDoc => {
            spaces.value.push({id: spaceDoc.id, name: spaceDoc.data().name, control : false})
        })
    })
}

// obtencion de los dispositivos de un usuario
const loadDevices = () => {
    getDevices(user.getID(), deviceDocs => {
        devices.value = []
        deviceDocs.forEach(deviceDoc => devices.value.push({id: deviceDoc.id, data: deviceDoc.data(), updatig : false}))
    })
}

// obtencion de las unidades que puede medir un sensor
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
    if(confirm('¿desea cerrar la sesión?')){
        user.logout()
        router.push({ name: 'login' })
    }
}

</script>


<style scoped>

.dashboard{ @apply w-full h-full flex flex-col }

.header{ @apply w-full flex justify-between items-center p-8 bg-green }

.title{ @apply text-4xl text-white }

.settings{ @apply w-8 hover:rotate-90 duration-300 cursor-pointer }

.logout{ @apply hover:scale-125 duration-300 cursor-pointer w-8 }

.space-name{ @apply text-3xl text-white font-black }

.spaces{ @apply w-full h-full overflow-y-auto p-12 flex flex-col gap-4 }

.space-header{ @apply bg-darkgreen p-4 flex justify-between items-center }

.name{ @apply text-xl text-white font-bold }

.id{  @apply text-[#d6d6d6] text-sm font-thin }

.toggle{ @apply hover:bg-[#2f5d40] duration-200 cursor-pointer rounded-xl p-1 }

.devices{ @apply bg-green p-4 rounded-b-2xl flex flex-col gap-4 }

.device{ @apply flex items-center h-16 border-solid border-b-2 border-lightgreen }

.device-info{ @apply basis-1/2 flex items-center gap-4 }

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

.new-space{ @apply hover:bg-[#d6d6d6] duration-200 p-2 rounded-2xl }

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