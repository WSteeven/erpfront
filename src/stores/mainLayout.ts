import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMainLayoutStore = defineStore('mainLayout', () => {
  const tituloPagina = ref()

  return {
    tituloPagina,
  }
})
