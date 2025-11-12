import { computed, defineComponent, ref, watch } from 'vue'
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { Tarea } from 'pages/conecel/GestionTareas/tareas/domain/Tarea'
import { TareaController } from 'pages/conecel/GestionTareas/tareas/infraestructure/TareaController'
import useVuelidate from '@vuelidate/core'
import { configuracionColumnasTarea } from 'pages/conecel/GestionTareas/tareas/domain/configuracionColumnasTareas'
import ErrorComponent from 'components/ErrorComponent.vue'
import NoOptionComponent from 'components/NoOptionComponent.vue'
import {
  estadosTareas,
  estadosTareasConecel,
  tabOptionsTareasConecel
} from 'pages/conecel/conecel.utils'
import { required, requiredIf } from 'shared/i18n-validators'
import { GrupoController } from 'recursosHumanos/grupos/infraestructure/GrupoController'
import { obtenerFechaActual, obtenerUbicacion } from 'shared/utils'
import MapaComponent from 'components/mapas/MapaComponent.vue'
import { acciones, accionesTabla, maskFecha } from 'config/utils'
import GestorArchivos from 'components/gestorArchivos/GestorArchivos.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import GestorDocumentos from 'components/documentos/view/GestorDocumentos.vue'
import CalloutComponent from 'components/CalloutComponent.vue'
import { PuntoMapa } from 'components/mapas/types/mapa'

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
    const {
      entidad: tarea,
      accion,
      disabled,
      tabs,
      listado
    } = mixin.useReferencias()
    const { setValidador, obtenerListados, cargarVista, listar } =
      mixin.useComportamiento()
    const { onReestablecer, onConsultado } = mixin.useHooks()
    const refArchivo = ref()
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

    cargarVista(async () => {
      await obtenerListados({
        grupos: {
          controller: new GrupoController(),
          params: { 'nombre[like]': '%INST%', activo: 1 }
        }
      })


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
    return {
      mixin,
      tarea,
      v$,
      accion,
      disabled,
      refArchivo,
      currentTab,
      acciones,
      configuracionColumnas: configuracionColumnasTarea,
      estados_tareas: estadosTareasConecel,
      estadosTareasString: estadosTareas,

      accionesTabla,
      maskFecha,
      tabOptions: tabOptionsTareasConecel,
      idTarea,
      filtrarListadoTareas,
      mapaTabPanel,
      listado,
      puntosMapa,
      puntoSeleccionado,
      seleccionarTarea,
      refMapa,
      estadoColorMap,
      fechaSeleccionada,
      fechas,
      accepted: ref('1'),
      alturaMapa: '500px'
    }
  }
})
