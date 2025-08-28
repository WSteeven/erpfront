import { defineStore } from 'pinia'
import { ref } from 'vue'
import { acciones } from 'config/utils'

export const usePostulacionStore = defineStore('postulacion', () => {
  const idPostulacion = ref()
  const accionEntrevista = ref(acciones.nuevo)

  return {
    idPostulacion,
    accionEntrevista
  }
})
