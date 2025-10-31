import { computed, defineComponent, reactive, ref, watch } from 'vue'
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { Tarea } from 'pages/conecel/GestionTareas/tareas/domain/Tarea'
import { TareaController } from 'pages/conecel/GestionTareas/tareas/infraestructure/TareaController'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import useVuelidate from '@vuelidate/core'
import { configuracionColumnasTarea } from 'pages/conecel/GestionTareas/tareas/domain/configuracionColumnasTareas'
import { TipoActividadController } from 'pages/conecel/GestionTareas/tiposActividades/infraestructure/TipoActividadController'
import ErrorComponent from 'components/ErrorComponent.vue'
import NoOptionComponent from 'components/NoOptionComponent.vue'
import {
  estadosTareas,
  estadosTareasConecel,
  tabOptionsTareasConecel,
  tiposCarga
} from 'pages/conecel/conecel.utils'
import { required, requiredIf } from 'shared/i18n-validators'
import { GrupoController } from 'recursosHumanos/grupos/infraestructure/GrupoController'
import {
  btnEliminarDefault,
  encontrarUltimoIdListado,
  obtenerFechaActual,
  obtenerUbicacion,
  ordenarLista
} from 'shared/utils'
import MapaComponent from 'components/mapas/MapaComponent.vue'
import { acciones, accionesTabla, maskFecha } from 'config/utils'
import GestorArchivos from 'components/gestorArchivos/GestorArchivos.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import GestorDocumentos from 'components/documentos/view/GestorDocumentos.vue'
import CalloutComponent from 'components/CalloutComponent.vue'
import { endpoints } from 'config/api'
import { Endpoint } from 'shared/http/domain/Endpoint'
import { PuntoMapa } from 'components/mapas/PuntoMapa'

export default defineComponent({
  components: {
    CalloutComponent,
    GestorDocumentos,
    EssentialTable,
    GestorArchivos,
    MapaComponent,
    NoOptionComponent,
    ErrorComponent,
    TabLayoutFilterTabs2
  },
  setup() {
    const mixin = new ContenedorSimpleMixin(Tarea, new TareaController())
    const mixin2 = new ContenedorSimpleMixin(Tarea, new TareaController())
    const {
      entidad: tarea,
      listadosAuxiliares,
      accion,
      disabled,
      tabs,
      listado
    } = mixin.useReferencias()
    const { setValidador, obtenerListados, cargarVista, listar, editar } =
      mixin.useComportamiento()
    const { onReestablecer, onConsultado } = mixin.useHooks()
    const refArchivo = ref()
    const refArchivoLotes = ref()
    const refMapa = ref()
    const listadoOriginal = ref()
    const puntosMapa = ref<PuntoMapa[]>([])
    const puntoSeleccionado = ref<number | null>(null)
    const estadoColorMap: Record<string, string> = {
      PENDIENTE: 'orange',
      FINALIZADA: 'green',
      CANCELADA: 'red',
      'RIESGO DE PERDERSE': 'yellow'
      // agrega más según tu `estadosTareasConecel`
    }

    const idTarea = ref()
    const currentTab = ref('TODAS')
    const tipos_actividades = ref([])
    const INDIVIDUAL = 'INDIVIDUAL'
    const tipoCarga = ref(INDIVIDUAL)
    const grupo = ref(null)
    const { grupos, filtrarGrupos } =
      useFiltrosListadosSelects(listadosAuxiliares)

    cargarVista(async () => {
      await obtenerListados({
        tipos_actividades: {
          controller: new TipoActividadController(),
          params: { activo: 1 }
        },
        grupos: {
          controller: new GrupoController(),
          params: { 'nombre[like]': '%INST%', activo: 1 }
        }
      })

      tipos_actividades.value = listadosAuxiliares.tipos_actividades

      // Datos por defecto
      cargarDatosDefecto()
    })

    const reglas = {
      direccion: { required },
      estado_tarea: { required },
      grupo: { required: requiredIf(() => tarea.asignada) },
      nombre_cliente: { required },
      orden_trabajo: { required },
      tipo_actividad: { required }
    }
    const v$ = useVuelidate(reglas, tarea)
    setValidador(v$.value)

    /*********
     * HOOKS
     **********/
    onReestablecer(() => {
      cargarDatosDefecto()
      refArchivo.value?.limpiarListado()
    })
    onConsultado(() => {
      tabs.value = 'formulario'
    })

    // onBeforeMount(() => cargarDatosDefecto())

    /*********
     * Funciones
     **********/
    function cargarDatosDefecto() {
      if (tipos_actividades.value.length == 1) {
        tarea.tipo_actividad = tipos_actividades.value[0].id
        tarea.estado_tarea = estadosTareasConecel[0].value
      }
      tarea.fecha = obtenerFechaActual(maskFecha)
      obtenerCoordenadas()
    }

    function obtenerCoordenadas() {
      obtenerUbicacion(location => {
        tarea.latitud = location.coords.latitude
        tarea.longitud = location.coords.longitude

        // 🔁 Actualiza el array reactivo
        tarea.coordenadas.splice(0, tarea.coordenadas.length, {
          lat: tarea.latitud,
          lng: tarea.longitud,
          titulo: tarea.orden_trabajo ?? 'Mi Ubicación',
          descripcion:
            tarea.nombre_cliente ??
            `Precisión: ${Math.round(location.coords.accuracy)} m`
        })
      })
    }

    async function filtrarListadoTareas(tab: string) {
      currentTab.value = tab
      await listar({ astatus: tab })
      listadoOriginal.value = new Set(listado.value)
      fechaSeleccionada.value = null
    }

    async function subirArchivos() {
      try {
        await refArchivoLotes.value.subir()

        refArchivoLotes.value.quiero_subir_archivos = false

        // retrasar la ejecucion de esta funcion
        setTimeout(async () => {
          refArchivo.value?.limpiarListado()
          tabs.value = 'listado'
          await filtrarListadoTareas(currentTab.value)
        }, 1000)
      } catch (error) {
        console.error(`Error es: ${error}`)
      }
    }

    const todasFechas = computed(() => listado.value.map((t: Tarea) => t.fecha))
    const fechaSeleccionada = ref()
    const fechas = ref()
    const mapearFechas = () => {
      fechas.value = [...new Set(todasFechas.value)]
    }
    const mapearPuntosMapa = () => {
      puntosMapa.value = listado.value.map((tarea: Tarea) => ({
        lat: Number(tarea.latitud),
        lng: Number(tarea.longitud),
        titulo: Number(tarea.orden_trabajo),
        descripcion: `${tarea.tipo_actividad} - ${tarea.estado_tarea}\n${tarea.direccion}\n${tarea.nombre_cliente}`,
        color: estadoColorMap[tarea.estado_tarea] || 'blue',
        id: tarea.id // importante para resaltar
      }))
    }
    const seleccionarTarea = (tarea: Tarea) => {
      puntoSeleccionado.value = tarea.id
      // Centramos y destacamos en el mapa (si MapaComponent tiene esta función)
      const punto = puntosMapa.value.find((p: PuntoMapa) => p.id === tarea.id)
      if (punto && refMapa.value?.centrarPunto) {
        refMapa.value.centrarPunto(punto) //Llamada directa al mapa
      }
    }
    /********************************
     * CUSTOM TABS PANEL
     *******************************/
    const mapaTabPanel = {
      label: 'Mapa',
      accion: () => mapearPuntosMapa
    }

    /********************************
     * WATCHERS
     *******************************/
    watch(
      listado,
      () => {
        mapearPuntosMapa()
        mapearFechas()
      },
      { deep: true, immediate: true }
    )
    watch(
      () => fechaSeleccionada.value,
      () => {
        switch (fechaSeleccionada.value) {
          case undefined:
            listado.value = [...listadoOriginal.value]
            break
          case null:
            listado.value = [...listadoOriginal.value]
            break
          default:
            listado.value = listado.value.filter(
              (t: Tarea) => t.fecha === fechaSeleccionada.value
            )
        }
      }
    )

    /********************************
     * BOTONES DE TABLA
     *******************************/
    const btnAgregarFilaTelefono: CustomActionTable = {
      titulo: 'Agregar Teléfono',
      icono: 'bi-arrow-bar-down',
      color: 'positive',
      tooltip: 'Agregar teléfono',
      accion: () => {
        const telefono = reactive({
          id: '',
          telefono: ''
        })
        telefono.id = tarea.telefonos.length
          ? encontrarUltimoIdListado(tarea.telefonos) + 1
          : 1

        tarea.telefonos.push(telefono)
      },
      visible: () => [acciones.nuevo, acciones.editar].includes(accion.value)
    }
    const btnMarcarRiesgoPerderse: CustomActionTable<Tarea> = {
      titulo: 'Marcar como Riesgo de Perderse',
      icono: 'bi-exclamation-triangle-fill',
      color: 'warning',
      tooltip: 'Marcar esta tarea como Riesgo de Perderse',
      accion: async ({ entidad }) => {
        console.log('btnMarcarRiesgoPerderse', entidad)
        entidad.estado_tarea = estadosTareas.riesgo_perderse
        await editar(entidad)
      },
      visible: ({ entidad }) =>
        ![
          estadosTareas.riesgo_perderse,
          estadosTareas.cancelada,
          estadosTareas.finalizada
        ].includes(entidad.estado_tarea)
    }
    const btnCambiarCuadrilla: CustomActionTable<Tarea> = {
      titulo: 'Cambiar Cuadrilla',
      icono: 'bi-arrow-left-right',
      color: 'teal',
      tooltip: 'Cambiar o Asignar Cuadrilla',
      visible: ({ entidad }) =>
        entidad.estado_tarea === estadosTareas.pendiente,
      accion: ({ entidad }) => {
        console.log('Aqui escogemos a la nueva cuadrilla', entidad)
      }
    }

    return {
      mixin,
      mixin2,
      tarea,
      v$,
      accion,
      disabled,
      refArchivo,
      refArchivoLotes,
      currentTab,
      grupo,
      acciones,
      endpoint: computed(
        () =>
          new Endpoint(
            `${endpoints.tareas_conecel_lotes.accessor}/${grupo.value ?? '0'}`
          )
      ),
      configuracionColumnas: configuracionColumnasTarea,
      estados_tareas: estadosTareasConecel,
      estadosTareasString: estadosTareas,
      tipos_actividades,
      grupos,
      filtrarGrupos,
      ordenarLista,
      accionesTabla,
      maskFecha,
      tabOptions: tabOptionsTareasConecel,
      idTarea,
      tipoCarga,
      tiposCarga,
      INDIVIDUAL,
      btnAgregarFilaTelefono,
      btnMarcarRiesgoPerderse,
      btnCambiarCuadrilla,
      subirArchivos,
      btnEliminarDefault,
      filtrarListadoTareas,
      mapaTabPanel,
      listado,
      puntosMapa,
      puntoSeleccionado,
      seleccionarTarea,
      refMapa,
      estadoColorMap,
      todasFechas,
      fechaSeleccionada,
      fechas,
      accepted: ref('1'),
      alturaMapa:'500px'
    }
  }
})
