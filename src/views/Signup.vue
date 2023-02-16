<template>
    <div class="page bg-darkgreen">
        <div class="signup">
            <form @submit.prevent="signup()">
            <h1>create an account</h1>
                <input v-model="username" id="username" type="text" placeholder="username">
                <input v-model="password" id="password" type="password" placeholder="password">
                <button>sign up</button>
                <p class="message">{{ message }}</p>
                <p class="login" @click="router.push({ name: 'login' })">or log in</p>
            </form>
        </div>
    </div>
</template>


<script setup>

/* imports */
import { ref } from 'vue'

import { useRouter } from 'vue-router'

import { addUser, getUser } from '@/firebase.js'

//

const router = useRouter()

//

const message = ref("")

const username = ref("")
const password = ref("")

const signup = () => {
    if(username.value != "" || password.value != ""){
        getUser(username.value, async(docs) => {
            if(docs.size < 1){
                await addUser({
                    username : username.value,
                    password : password.value
                })
                router.push({ name: 'login' })
            } else message.value = 'user already exists'
        })
    } else message.value = 'empty fields'
}

</script>


<style scoped>

    .signup{ @apply text-white }

    form{ @apply flex flex-col items-center gap-12 text-xl }

    h1{ @apply font-bold }

    input{ @apply bg-darkgreen border-solid border-b-2 border-white focus:outline-none text-white placeholder:text-lightgray placeholder:font-light p-4 }

    button{ @apply w-full bg-white text-[#232323] focus:outline-none focus:bg-lightgray hover:bg-lightgray p-2 rounded-xl shadow-2xl }

    .message{ @apply text-lightgreen italic }

    .login{ @apply w-fit font-light hover:underline cursor-pointer }

</style>