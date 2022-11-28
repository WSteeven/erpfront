import { Subtarea } from 'pages/tareas/subtareas/domain/Subtarea'
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

export const useTrabajoAsignadoStore = defineStore('trabajoAsignado', () => {
  // const posicionSubtareaSeleccionada = ref()
  // const nuevoElementoInsertado = ref(false)
  // const filtroEstadoSeleccionado = ref()
  // const subtareaEditada = ref(false)
  const idSubtareaSeleccionada = ref()
  const idTipoTrabajoSubtarea = ref()
  const subtarea = reactive(new Subtarea())

  return {
    /*posicionSubtareaSeleccionada,
    filtroEstadoSeleccionado,
    nuevoElementoInsertado,
    subtareaEditada,*/
    idSubtareaSeleccionada,
    idTipoTrabajoSubtarea,
    subtarea,
  }
})
