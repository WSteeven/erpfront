import { TipoTrabajo } from 'gestionTrabajos/tiposTareas/domain/TipoTrabajo'
import { Subtarea } from 'pages/gestionTrabajos/subtareas/domain/Subtarea'
import { computed, Ref, ref, UnwrapRef } from 'vue'
import { Tarea } from '../domain/Tarea'

export const useFiltrosListadosTarea = (listadosAuxiliares, entidad: UnwrapRef<Tarea | Subtarea>) => {
  // - Filtro clientes corporativos
  const clientes = ref()
  function filtrarClientes(val, update) {
    if (val === '') update(() => clientes.value = listadosAuxiliares.clientes)

    update(() => {
      const needle = val.toLowerCase()
      clientes.value = listadosAuxiliares.clientes.filter(
        (v) => v.razon_social.toLowerCase().indexOf(needle) > -1
      )
    })
  }

  // - Filtro tipos de clientes finales
  const clientesFinales = ref()
  function filtrarClientesFinales(val, update) {
    if (val === '') update(() => clientesFinales.value = listadosAuxiliares.clientesFinales)

    update(() => {
      const needle = val.toLowerCase()
      clientesFinales.value = listadosAuxiliares.clientesFinales.filter(
        (v) => v.nombres.toLowerCase().indexOf(needle) > -1
      )
    })
  }

  // - Filtro supervisores
  const fiscalizadores = ref()
  function filtrarFiscalizadores(val, update) {
    if (val === '') update(() => fiscalizadores.value = listadosAuxiliares.supervisores)

    update(() => {
      const needle = val.toLowerCase()
      fiscalizadores.value = listadosAuxiliares.fiscalizadores.filter(
        (v) => v.nombres.toLowerCase().indexOf(needle) > -1
      )
    })
  }

  // - Filtro coordinadores
  const coordinadores = ref()
  function filtrarCoordinadores(val, update) {
    if (val === '') update(() => coordinadores.value = listadosAuxiliares.coordinadores)

    update(() => {
      const needle = val.toLowerCase()
      coordinadores.value = listadosAuxiliares.coordinadores.filter(
        (v) => v.nombres.toLowerCase().indexOf(needle) > -1
      )
    })
  }

  // - Filtro provincias
  const provincias = ref()
  function filtrarProvincias(val, update) {
    if (val === '') update(() => provincias.value = listadosAuxiliares.provincias)

    update(() => {
      const needle = val.toLowerCase()
      provincias.value = listadosAuxiliares.provincias.filter(
        (v) => v.provincia.toLowerCase().indexOf(needle) > -1
      )
    })
  }

  // - Filtro cantones
  const cantones = ref([])
  function filtrarCantones(val, update) {
    if (val === '') update(() => cantones.value = listadosAuxiliares.cantones)

    update(() => {
      const needle = val.toLowerCase()
      cantones.value = listadosAuxiliares.cantones.filter(
        (v) => v.canton.toLowerCase().indexOf(needle) > -1
      )
    })
  }

  // - Filtro proyectos
  const proyectos = ref(listadosAuxiliares.proyectos)
  function filtrarProyectos(val, update) {
    if (val === '') update(() => proyectos.value = listadosAuxiliares.proyectos)

    update(() => {
      const needle = val.toLowerCase()
      proyectos.value = listadosAuxiliares.proyectos.filter(
        (v) => v.codigo_proyecto.toLowerCase().indexOf(needle) > -1
      )
    })
  }

  // - Filtro tipos de trabajos
  const tiposTrabajos: Ref<TipoTrabajo[]> = ref([])
  const tiposTrabajosSource = computed(() =>
    listadosAuxiliares.tiposTrabajos.filter((tipo: TipoTrabajo) => tipo.cliente_id === (entidad.cliente ? entidad.cliente : false))
  )

  function filtrarTiposTrabajos(val, update) {
    if (val === '') update(() => tiposTrabajos.value = []) //listadosAuxiliares.tiposTrabajos)
    // if (val === '') update(() => tiposTrabajos.value = listadosAuxiliares.tiposTrabajos)

    update(() => {
      const needle = val.toLowerCase()
      tiposTrabajos.value = tiposTrabajosSource.value.filter(
        (v) => v.descripcion.toLowerCase().indexOf(needle) > -1
      )
    })
  }

  // - Filtro grupos
  const grupos = ref([])
  function filtrarGrupos(val, update) {
    if (val === '') update(() => grupos.value = listadosAuxiliares.grupos)

    update(() => {
      const needle = val.toLowerCase()
      grupos.value = listadosAuxiliares.grupos.filter(
        (v) => v.nombre.toLowerCase().indexOf(needle) > -1
      )
    })
  }

  // - Filtro empleados
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
    clientes,
    filtrarClientes,
    clientesFinales,
    filtrarClientesFinales,
    fiscalizadores,
    filtrarFiscalizadores,
    coordinadores,
    filtrarCoordinadores,
    provincias,
    filtrarProvincias,
    cantones,
    filtrarCantones,
    proyectos,
    filtrarProyectos,
    tiposTrabajos,
    filtrarTiposTrabajos,
    grupos,
    filtrarGrupos,
    empleados,
    filtrarEmpleados,
  }
}
