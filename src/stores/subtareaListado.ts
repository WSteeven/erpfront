import { defineStore } from "pinia"
import { ref } from "vue"

export const useSubtareaListadoStore = defineStore('subtareaListado', () => {
  const posicionSubtareaSeleccionada = ref()
  const nuevoElementoInsertado = ref(false)
  const filtroEstadoSeleccionado = ref()
  const subtareaEditada = ref(false)
  const idSubtareaSeleccionada = ref()

  return {
    posicionSubtareaSeleccionada,
    filtroEstadoSeleccionado,
    nuevoElementoInsertado,
    subtareaEditada,
    idSubtareaSeleccionada,
  }
})
