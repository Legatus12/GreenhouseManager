<template>
    <div class="page">
        <div class="signup">
            <form @submit.prevent="signup()">
            <h1>Create an account</h1>
                <input v-model="username" id="username" type="text" placeholder="username">
                <input v-model="password" id="password" type="password" placeholder="password">
                <button>sign up</button>
                <p @click="router.push({ name: 'login' })">or log in</p>
            </form>
        </div>
    </div>
</template>


<script setup>

/* imports */
import { ref } from 'vue'

import { useRouter } from 'vue-router'

import { useStore } from '@/stores/user.js'

import { addUser, getUser } from '@/firebase.js'

//

const router = useRouter()

const user = useStore()

//

const username = ref("")
const password = ref("")

const signup = () => {
    if(username.value != '' || password.value != ''){
        getUser(username.value, async(docs) => {
            if(docs.size < 1){
                await addUser({
                    username : username.value,
                    password : password.value
                })
                alert('user succesfully created')
                router.push({ name: 'dashboard' })
            } else alert('user already exists')
        })
    } else alert('error: empty fields')
}

</script>


<style scoped>

    .signup{ @apply text-white }

    form{ @apply flex flex-col items-center gap-12 text-xl }

    h1{ @apply font-bold }

    input{ @apply bg-green border-solid border-b-2 border-white focus:outline-none text-white placeholder:text-lightgray placeholder:font-light p-4 }

    button{ @apply w-full bg-white text-[#232323] focus:outline-none focus:bg-lightgray hover:bg-lightgray p-2 rounded-xl shadow-2xl }

    p{ @apply w-fit font-light hover:underline cursor-pointer }

</style>