import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useStore = defineStore('user', () => {
  const id = ref('')
  const getID = () => id.value
  const setID = (newID) => id.value = newID
  const logout = () => id.value = null

  return { getID, setID, logout }
})