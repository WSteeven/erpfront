import { ref } from 'vue'

export const useFiltrosListadosTickets = (listadosAuxiliares) => {
  const categoriasTiposTickets = ref([])
  function filtrarCategoriasTiposTickets(val, update) {
    if (val === '') update(() => categoriasTiposTickets.value = listadosAuxiliares.categoriasTiposTickets)

    update(() => {
      const needle = val.toLowerCase()
      categoriasTiposTickets.value = listadosAuxiliares.categoriasTiposTickets.filter(
        (v) => v.nombre.toLowerCase().indexOf(needle) > -1
      )
    })
  }

  const tiposTickets = ref([])
  function filtrarTiposTickets(val, update) {
    if (val === '') update(() => tiposTickets.value = listadosAuxiliares.tiposTickets)

    update(() => {
      const needle = val.toLowerCase()
      tiposTickets.value = listadosAuxiliares.tiposTickets.filter(
        (v) => v.nombre.toLowerCase().indexOf(needle) > -1
      )
    })
  }

  const departamentos = ref([])
  function filtrarDepartamentos(val, update) {
    if (val === '') update(() => departamentos.value = listadosAuxiliares.departamentos)

    update(() => {
      const needle = val.toLowerCase()
      departamentos.value = listadosAuxiliares.departamentos.filter(
        (v) => v.nombre.toLowerCase().indexOf(needle) > -1
      )
    })
  }

  const empleados = ref([])
  function filtrarEmpleados(val, update) {
    if (val === '') update(() => empleados.value = listadosAuxiliares.empleados)

    update(() => {
      const needle = val.toLowerCase()
      empleados.value = listadosAuxiliares.empleados.filter(
        (v) => v.nombres.toLowerCase().indexOf(needle) > -1
      )
    })
  }

  return {
    filtrarDepartamentos,
    filtrarEmpleados,
    filtrarTiposTickets,
    filtrarCategoriasTiposTickets,
    categoriasTiposTickets,
    tiposTickets,
    departamentos,
    empleados,
  }
}
