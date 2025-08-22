import { acciones } from 'config/utils'
import { Gasto } from 'pages/fondosRotativos/gasto/domain/Gasto'
import { defineStore } from 'pinia'
import {  reactive, ref } from 'vue'

export const useFondoRotativoStore = defineStore('fondo_rotativo', () => {
  const accion_form = acciones.consultar
  const gasto: Gasto = reactive(new Gasto())
  const habilitar_observacion_autorizador = ref(false)
  const vehiculos = ref([])
  const empleados = ref([])
  const proyectos = ref([])
  const tareas = ref([])
  const clientes = ref([])

  return {
    gasto,
    vehiculos,
    proyectos,
    tareas,
    clientes,
    empleados,
    accion_form,
    habilitar_observacion_autorizador,
  }
})
