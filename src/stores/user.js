import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useStore = defineStore('user', () => {
  const username = ref('')
  const id = ref('')
  const getUsername = () => username.value
  const getUserID = () => id.value
  const setUsername = (newUsername) => username.value = newUsername
  const setUserID = (newID) => id.value = newID

  return { getUsername, getUserID, setUsername, setUserID }
})