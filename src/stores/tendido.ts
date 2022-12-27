import { acciones } from 'config/utils'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTendidoStore = defineStore('tendido', () => {
  const idTendido = ref()
  const accion = ref(acciones.nuevo)

  return {
    idTendido,
    accion,
  }
})
