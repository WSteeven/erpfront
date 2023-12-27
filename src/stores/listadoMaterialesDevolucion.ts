import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useListadoMaterialesDevolucionStore = defineStore('listadoMaterialesDevolucion', () => {

  const listadoMateriales = ref([])
  const tareaId = ref()
  const cliente_id = ref()
  const devolverAlStock = ref(false)
  const origenProductos = ref() // cliente final, proyecto, personal

  return {
    listadoMateriales,
    tareaId,
    cliente_id,
    devolverAlStock,
    origenProductos,
  }
})
