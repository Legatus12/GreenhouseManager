<template>
    <div class="page">
        <div class="settings">
            <div class="header">
                <div class="title">
                    <h1>Greenhouses</h1>
                    <div class="dashboard" @click="loadDashboard()" title="dashboard">
                        <img src="@/assets/img/settings.png">
                    </div>
                </div>
                <div class="logout" @click="logout()" title="log out">
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

const loadDashboard = () => router.push({ name: 'dashboard' })

const logout = () => router.push({ name: 'login' })

</script>


<style scoped>

.settings{ @apply w-full h-full bg-darkgreen }

.header{ @apply w-full flex justify-between items-center p-8 border-solid border-b-2 border-white }

.title{ @apply flex gap-8 items-center text-4xl text-white font-bold }

.dashboard{ @apply hover:rotate-90 duration-300 cursor-pointer }

.logout{ @apply hover:scale-125 duration-300 cursor-pointer }

</style>