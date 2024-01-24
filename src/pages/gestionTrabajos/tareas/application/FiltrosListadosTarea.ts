import { CausaIntervencion } from 'pages/gestionTrabajos/causasIntervenciones/domain/CausaIntervencion'
import { TipoTrabajo } from 'gestionTrabajos/tiposTareas/domain/TipoTrabajo'
import { computed, Ref, ref, UnwrapRef } from 'vue'
import { ordernarListaString } from 'shared/utils'

export const useFiltrosListadosTarea = (listadosAuxiliares, entidad?: UnwrapRef<any>) => {
  // Clientes corporativos
  const clientes = ref(listadosAuxiliares.clientes)
  function filtrarClientes(val, update) {
    return filtrarLista(val, update, clientes, 'razon_social', listadosAuxiliares.clientes)
  }

  // Clientes finales
  const clientesFinales = ref(listadosAuxiliares.clientes)
  function filtrarClientesFinales(val, update) {
    return filtrarLista(val, update, clientesFinales, 'nombres', listadosAuxiliares.clientesFinales)
  }

  // Fiscalizadores
  const fiscalizadores = ref(listadosAuxiliares.fiscalizadores)
  function filtrarFiscalizadores(val, update) {
    return filtrarLista(val, update, fiscalizadores, 'nombres', listadosAuxiliares.fiscalizadores)
  }

  // Coordinadores
  const coordinadores = ref(listadosAuxiliares.coordinadores)
  function filtrarCoordinadores(val, update) {
    return filtrarLista(val, update, coordinadores, 'nombres', listadosAuxiliares.coordinadores)
  }

  // Proyectos
  const proyectos = ref(listadosAuxiliares.proyectos)
  function filtrarProyectos(val, update) {
    return filtrarLista(val, update, proyectos, 'codigo_proyecto', listadosAuxiliares.proyectos)
  }

  // Etapas
  const etapas = ref(listadosAuxiliares.etapas ?? [])
  function filtrarEtapas(val, update) {
    return filtrarLista(val, update, etapas, 'nombre', listadosAuxiliares.etapas)
  }

  function filtrarLista(val, update, lista, propiedad, defaultValue = []) {
    if (val === '') {
      update(() => lista.value = defaultValue)
    } else {
      update(() => {
        const needle = val.toLowerCase()
        lista.value = defaultValue.filter(
          (v: any) => v[propiedad].toLowerCase().indexOf(needle) > -1
        )
      })
    }
  }

  // - Filtro tipos de trabajos
  const tiposTrabajos: Ref<TipoTrabajo[]> = ref([])
  const tiposTrabajosSource = computed(() =>
    listadosAuxiliares.tiposTrabajos.filter((tipo: TipoTrabajo) => tipo.cliente_id === (entidad ? (entidad.cliente ? entidad.cliente : false) : false))
  )

  function filtrarTiposTrabajos(val, update) {
    if (val === '') update(() => tiposTrabajos.value = [])

    update(() => {
      const needle = val.toLowerCase()
      tiposTrabajos.value = tiposTrabajosSource.value.filter(
        (v) => v.descripcion.toLowerCase().indexOf(needle) > -1
      )
    })
  }

  // - Filtro causas de intervenciones
  const causasIntervenciones: Ref<TipoTrabajo[]> = ref([])
  const causasIntervencionesSource = computed(() =>
    listadosAuxiliares.causasIntervenciones.filter((causa: CausaIntervencion) => causa.tipo_trabajo_id === (entidad ? (entidad.tipo_trabajo ? entidad.tipo_trabajo : false) : false))
  )

  function filtrarCausasIntervenciones(val, update) {
    if (val === '') update(() => causasIntervenciones.value = [])

    update(() => {
      const needle = val.toLowerCase()
      causasIntervenciones.value = causasIntervencionesSource.value.filter(
        (v) => v.nombre.toLowerCase().indexOf(needle) > -1
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
    if (val === '') update(() => empleados.value = listadosAuxiliares.empleados.sort((a, b) => ordernarListaString(a.nombres, b.nombres)))

    update(() => {
      const needle = val.toLowerCase()
      empleados.value = listadosAuxiliares.empleados.filter((v) => v.nombres.toLowerCase().indexOf(needle) > -1 || v.apellidos.toLowerCase().indexOf(needle) > -1)
    })
  }

  // - Filtro rutas tareas
  const rutas = ref([])
  function filtrarRutas(val, update) {
    if (val === '') update(() => rutas.value = listadosAuxiliares.rutas)

    update(() => {
      const needle = val.toLowerCase()
      rutas.value = listadosAuxiliares.rutas.filter(
        (v) => v.ruta.toLowerCase().indexOf(needle) > -1
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
    proyectos,
    filtrarProyectos,
    tiposTrabajos,
    filtrarTiposTrabajos,
    grupos,
    filtrarGrupos,
    empleados,
    filtrarEmpleados,
    rutas,
    filtrarRutas,
    causasIntervenciones,
    filtrarCausasIntervenciones,
    etapas,
    filtrarEtapas,
  }
}
