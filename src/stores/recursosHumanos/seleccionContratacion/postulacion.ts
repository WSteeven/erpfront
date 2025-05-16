import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePostulacionStore = defineStore('postulacion', () => {
  const idPostulacion = ref()

  return {
    idPostulacion
  }
})
