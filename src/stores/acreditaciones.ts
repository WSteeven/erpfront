import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAcreditacionesStore = defineStore('acreditaciones', () => {
  const idAcreditacion = ref()
  const idAcreditacionSeleccionada = ref()
  const posicionAcreditacionSeleccionada = ref()
  const esta_acreditado = ref()


  return {
    idAcreditacion,
    idAcreditacionSeleccionada,
    esta_acreditado,
    posicionAcreditacionSeleccionada,
  }
})
