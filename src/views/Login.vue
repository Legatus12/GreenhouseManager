<template>
    <div class="page">
        <div class="login">
            <form>
                <input v-model="username" id="username" type="text" placeholder="username">
                <input v-model="password" id="password" type="password" placeholder="password">
                <button @click="login()">log in</button>
            </form>
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

const username = ref("")
const password = ref("")

const validate = () => {

}

//

const login = () => router.push({ name: 'dashboard' })

</script>


<style scoped>

    form{ @apply flex flex-col gap-12 text-xl }

    input{ @apply bg-green border-solid border-b-2 border-white focus:outline-none text-white placeholder:text-lightgray placeholder:font-light p-4 }

    button{ @apply bg-white focus:outline-none focus:bg-lightgray hover:bg-lightgray p-2 rounded-xl shadow-2xl }



</style>