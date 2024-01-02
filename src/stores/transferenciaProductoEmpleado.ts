import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTransferenciaProductoEmpleadoStore = defineStore('transferenciaProductoEmpleado', () => {

  const listadoMateriales = ref([])
  const tareaId = ref()
  const cliente_id = ref()
  const idProyecto = ref()
  const idEtapa = ref()
  const origenProductos = ref() // cliente final, proyecto, personal

  return {
    listadoMateriales,
    tareaId,
    cliente_id,
    origenProductos,
    idEtapa,
    idProyecto,
  }
})
