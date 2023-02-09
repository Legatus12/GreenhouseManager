<template>
    <div class="page">
        <div class="dashboard">
            <div class="header">
                <div class="title">
                    <h1>Greenhouses</h1>
                    <div class="settings" @click="loadSettings()">
                        <img src="@/assets/img/settings.png">
                    </div>
                </div>
                <div class="logout" @click="logout()">
                    <img src="@/assets/img/logout.png">
                </div>
            </div>
            <div class="greehouses">
                
            </div>
        </div>
    </div>
</template>


<script setup>

/* imports */
import { ref } from 'vue'

import { useRouter } from 'vue-router'

//

const router = useRouter()

//



//

const loadSettings = () => router.push({ name: 'settings' })

const logout = () => router.push({ name: 'login' })

</script>


<style scoped>

.dashboard{ @apply w-full h-full }

.header{ @apply w-full flex justify-between items-center p-8 border-solid border-b-2 border-white }

.title{ @apply flex gap-8 items-center text-4xl text-white font-bold }

.settings{ @apply hover:rotate-90 duration-300 cursor-pointer }

.logout{ @apply hover:scale-125 duration-300 cursor-pointer }

</style>