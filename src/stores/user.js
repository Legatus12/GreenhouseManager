import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useStore = defineStore('user', () => {
  const id = ref('')
  const username = ref('')
  const getID = () => id.value
  const setID = (newID) => id.value = newID
  const getUsername = () => username.value
  const setUsername = (newUsername) => username.value = newUsername
  const logout = () => id.value = null

  return { getID, setID, getUsername, setUsername, logout }
})