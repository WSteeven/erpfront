import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useFamiliarStore = defineStore('familiar', () => {
  const idFamiliar = ref()
  const idFamiliarSeleccionada = ref()
  const posicionFamiliarSeleccionada = ref()
  const idEmpleado = ref()
  const identificacion = ref()
  const parentezco = ref()
  const nombres = ref()
  const apellidos = ref()
  const accion = ref()
  const listar_familiares = ref(true)


  return {
    idFamiliar,
    idFamiliarSeleccionada,
    posicionFamiliarSeleccionada,
    idEmpleado,
    identificacion,
    parentezco,
    nombres,
    apellidos,
    accion,
    listar_familiares,
  }
})
