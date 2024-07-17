//Dependencies
import { defineComponent, reactive, ref } from "vue"
import { required } from "shared/i18n-validators"
import { apiConfig, endpoints } from "config/api"
import useVuelidate from "@vuelidate/core"
import { AxiosResponse } from "axios"

//Components
import EssentialTable from "components/tables/view/EssentialTable.vue"
import GraficoGenerico from "components/chartJS/GraficoGenerico.vue"

//Logic and controllers
import { maskFecha, opcionesGrafico } from "config/utils"
import { imprimirArchivo, obtenerFechaActual } from "shared/utils"
import { StatusEssentialLoading } from "components/loading/application/StatusEssentialLoading"
import { CombustibleController } from "pages/controlVehiculos/combustible/infraestructure/CombustibleController"
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin"
import { Combustible } from "pages/controlVehiculos/combustible/domain/Combustible"
import { useNotificaciones } from "shared/notificaciones"
import { useFiltrosListadosSelects } from "shared/filtrosListadosGenerales"
import { VehiculoController } from "pages/controlVehiculos/vehiculos/infraestructure/VehiculoController"
import { AxiosHttpRepository } from "shared/http/infraestructure/AxiosHttpRepository"
import { optionsPie } from "config/graficoGenerico"
import { configuracionColumnasCombustibles } from '../../../../combustible/domain/configuracionColumnasCombustibles';

export default defineComponent({
  components: { EssentialTable, GraficoGenerico },
  setup() {
    const mixin = new ContenedorSimpleMixin(Combustible, new CombustibleController())
    const { listadosAuxiliares } = mixin.useReferencias()
    const { notificarError, notificarAdvertencia } = useNotificaciones()

    const cargando = new StatusEssentialLoading()
    const COMBUSTIBLE = 'COMBUSTIBLE'
    const VEHICULO = 'VEHICULO'
    const opciones = [COMBUSTIBLE, VEHICULO]
    const modoUnaColumna = ref(true)
    const tabs = ref(opcionesGrafico.grafico)
    const reporte = reactive({
      tipo: null,
      fecha_inicio: null,
      fecha_fin: '',
      vehiculo: null,
      todos: false,
    })
    const results = ref()
    const listado = ref([])
    const { combustibles, filtrarCombustibles,
      vehiculos, filtrarVehiculos } = useFiltrosListadosSelects(listadosAuxiliares)
    reporte.fecha_fin = obtenerFechaActual(maskFecha)
    const configuracionColumnasCombustibles = [
      {
        name: 'combustible',
        field: 'combustible',
        label: 'Combustible',
        align: 'left',
        sortable: true,
      },
      {
        name: 'monto',
        field: 'monto',
        label: 'Monto',
        align: 'center',
        sortable: true,
      },
      {
        name: 'recorrido',
        field: 'recorrido',
        label: 'Km Recorridos',
        align: 'left',
        sortable: true,
      },
    ]
    const configuracionColumnasVehiculos = [
      {
        name: 'vehiculo',
        field: 'vehiculo',
        label: 'Vehículo',
        align: 'left',
        sortable: true,
      },
      {
        name: 'combustible',
        field: 'combustible',
        label: 'Combustible',
        align: 'left',
        sortable: true,
      },
      {
        name: 'monto',
        field: 'monto',
        label: 'Monto',
        align: 'center',
        sortable: true,
      },
      {
        name: 'recorrido',
        field: 'recorrido',
        label: 'Km Recorridos',
        align: 'left',
        sortable: true,
      },
    ]

    /******************
     * VALIDACIONES
     ******************/
    const reglas = {
      tipo: { required },
      fecha_inicio: { required }
    }
    const v$ = useVuelidate(reglas, reporte)


    /******************
     * FUNCIONES
     ******************/
    async function obtenerCombustibles() {
      cargando.activar()
      const response = await new CombustibleController().listar()
      listadosAuxiliares.combustibles = response.result
      combustibles.value = response.result
      cargando.desactivar()
    }

    async function obtenerVehiculos() {
      cargando.activar()
      const response = await new VehiculoController().listar()
      listadosAuxiliares.vehiculos = response.result
      vehiculos.value = response.result
      cargando.desactivar()
    }
    async function consultarListado(tipo: string) {
      results.value = null
      switch (tipo) {
        case COMBUSTIBLE:
          await obtenerCombustibles()
          break
        case VEHICULO:
          await obtenerVehiculos()
          break
        default:
          console.log(tipo)
      }
    }

    async function obtenerReporte(accion: string, data, listado) {
      if (await v$.value.$validate()) {
        try {
          cargando.activar()
          const axios = AxiosHttpRepository.getInstance()
          const url = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.reporte_combustibles)
          const filename = 'reporte_conductores'
          switch (accion) {
            case 'excel':
              data.accion = 'excel'
              imprimirArchivo(url, 'POST', 'blob', 'xlsx', filename, data)
              return listado
            case 'pdf':
              data.accion = 'pdf'
              imprimirArchivo(url, 'POST', 'blob', 'pdf', filename, data)
              return listado
            default:
              data.accion = ''
              const response: AxiosResponse = await axios.post(url, data)
              // console.log(response)
              if (response.data.results) {
                if (response.data.results.length < 1) notificarAdvertencia('No se obtuvieron resultados')
                return response.data.results
              } else return listado
          }
        } catch (error) {
          console.log(error)
          notificarError('Error al obtener el reporte')
        } finally {
          cargando.desactivar()
        }
      }
    }
    async function buscarReporte(accion: string) {
      results.value = await obtenerReporte(accion, reporte, listado.value)
      listado.value = results.value.results
      // console.log(results.value)
    }

    return {
      reporte, v$,
      maskFecha,
      tabs, opcionesGrafico, optionsPie,
      results,
      configuracionColumnasVehiculos,
      configuracionColumnasCombustibles,
      modoUnaColumna,

      COMBUSTIBLE,
      VEHICULO,

      // listados
      listado,
      opciones,
      combustibles, filtrarCombustibles,
      vehiculos, filtrarVehiculos,

      //funciones
      consultarListado,
      buscarReporte,

    }
  }
})
