import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useListadoMaterialesDevolucionStore = defineStore('listadoMaterialesDevolucion', () => {

  const listadoMateriales = ref([])
  const tareaId = ref()
  const cliente_id = ref()
  const devolverAlStock = ref(false)

  return {
    listadoMateriales,
    tareaId,
    cliente_id,
    devolverAlStock,
  }
})
