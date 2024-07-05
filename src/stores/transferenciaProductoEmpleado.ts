import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTransferenciaProductoEmpleadoStore = defineStore('transferenciaProductoEmpleado', () => {

  const listadoMateriales = ref([])
  const tareaId = ref()
  const codigoTarea = ref()
  const cliente_id = ref()
  const idProyecto = ref()
  const idEtapa = ref()
  const origenProductos = ref() // cliente final, proyecto, personal
  const idEmpleado = ref()

  const filaAModificar= ref() //Representa la fila del materialEmpleado que se va a modificar


  return {
    listadoMateriales,
    tareaId,
    codigoTarea,
    cliente_id,
    origenProductos,
    idEtapa,
    idProyecto,
    idEmpleado,
    filaAModificar,
  }
})
