import { addDay, format, monthStart } from '@formkit/tempo';
import useVuelidate from '@vuelidate/core';
import { AxiosResponse } from 'axios';
import ErrorComponent from 'components/ErrorComponent.vue';
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading';
import NoOptionComponent from 'components/NoOptionComponent.vue';
import EssentialTable from 'components/tables/view/EssentialTable.vue';
import { apiConfig, endpoints } from 'config/api';
import { accionesTabla, maskFecha } from 'config/utils'
import { BitacoraVehicular } from 'pages/controlVehiculos/bitacoraVehicular/domain/BitacoraVehicular';
import { BitacoraVehicularController } from 'pages/controlVehiculos/bitacoraVehicular/infraestructure/BitacoraVehicularController';
import { VehiculoController } from 'pages/controlVehiculos/vehiculos/infraestructure/VehiculoController';
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin';
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales';
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository';
import { required, requiredIf } from 'shared/i18n-validators';
import { useNotificaciones } from 'shared/notificaciones';
import { imprimirArchivo } from 'shared/utils';
import { reactive, defineComponent, ref, onMounted } from 'vue';
import { configuracionColumnasReporteBitacoras } from '../domain/configuracionColumnasBitacoras';
import { LocalStorage, useQuasar } from 'quasar';
import { useNotificacionStore } from 'stores/notificacion';
import { useCargandoStore } from 'stores/cargando';
import { onUnmounted } from 'vue';
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useFunctionsBitacoraVehicular } from 'vehiculos/bitacoraVehicular/application/Functions'

export default defineComponent
  ({
    name:'ReporteBitacorasPage',
    components: { EssentialTable, ErrorComponent, NoOptionComponent },
    setup() {
      const mixin = new ContenedorSimpleMixin(BitacoraVehicular, new BitacoraVehicularController())
      const { listadosAuxiliares } = mixin.useReferencias()
      const { cargarVista, obtenerListados } = mixin.useComportamiento()
      const { notificarError, notificarAdvertencia } = useNotificaciones()
        /****************************************
         * Stores
         ****************************************/
      useNotificacionStore().setQuasar(useQuasar())
      useCargandoStore().setQuasar(useQuasar())
      const cargando = new StatusEssentialLoading()

      const reporte = reactive({
        tipo: null,
        fecha_inicio: '',
        fecha_fin: '',
        vehiculo: null,
        todos: false,
      })
      const TODOS = 'todos'
      const INDIVIDUAL = 'individual'
      const opciones = [TODOS, INDIVIDUAL]

      const umbral_km_consumidos= ref()

      const listado = ref([])
      const { vehiculos, filtrarVehiculos } = useFiltrosListadosSelects(listadosAuxiliares)
        const { imprimirPdf } = useFunctionsBitacoraVehicular()
      cargarVista(async () => {
        await obtenerListados({
          vehiculos: []
        })

        vehiculos.value = listadosAuxiliares.vehiculos

        const primerDiaMes = monthStart(new Date())
        const ultimoDiaMesAnterior = addDay(primerDiaMes, -1)
        const primerDiaMesAnterior = monthStart(ultimoDiaMesAnterior)

        reporte.fecha_inicio = format(primerDiaMesAnterior, maskFecha)
        reporte.fecha_fin = format(ultimoDiaMesAnterior, maskFecha)
      })

      /******************
       * VALIDACIONES
       ******************/
      const reglas = {
        tipo: { required },
        vehiculo: { required: requiredIf(() => reporte.tipo == INDIVIDUAL) },
        fecha_inicio: { required }
      }
      const v$ = useVuelidate(reglas, reporte)


      /******************
       * HOOKS
       ******************/
      onMounted(()=>{
        umbral_km_consumidos.value = LocalStorage.getItem('umbral_km_consumidos')?? 5200
      })
      onUnmounted(()=>{
        LocalStorage.set('umbral_km_consumidos', umbral_km_consumidos.value)
      })

      /******************
       * FUNCIONES
       ******************/
      async function consultarListado(tipo: string) {
        if (tipo == INDIVIDUAL) {
          await obtenerListados({ vehiculos: { controller: new VehiculoController(), params: { estado: 1 } } })
          vehiculos.value = listadosAuxiliares.vehiculos
        }
      }

      async function obtenerReporte(accion: string, data, listado) {
        if (await v$.value.$validate()) {
          try {
            cargando.activar()
            const axios = AxiosHttpRepository.getInstance()
            const url = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.reporte_bitacoras)
            const filename = 'reporte_bitacoras'
            switch (accion) {
              case 'excel':
                data.accion = 'excel'
                data.umbral= umbral_km_consumidos.value
                await imprimirArchivo(url, 'POST', 'blob', 'xlsx', filename, data)
                return listado
                case 'pdf':
                  data.accion = 'pdf'
                  data.umbral= umbral_km_consumidos.value
                await imprimirArchivo(url, 'POST', 'blob', 'pdf', filename, data)
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
        const results = ref([])
        results.value = await obtenerReporte(accion, reporte, listado.value)
        listado.value = results.value
        console.log(results.value)
        console.log(listado.value)
      }


        const btnImprimir: CustomActionTable = {
            titulo: 'Imprimir',
            icono: 'bi-printer',
            color: 'secondary',
            accion: async ({ entidad }) => {
                await imprimirPdf(entidad.id)
            }
        }

      return {
        v$,
        listado,
        listadosAuxiliares,
        mixin,
        reporte,
        maskFecha,
        INDIVIDUAL,
        configuracionColumnas: [...configuracionColumnasReporteBitacoras, accionesTabla],
        umbral_km_consumidos,

        //listados
        vehiculos, filtrarVehiculos,
        opciones,

        //botones de tabla
        btnImprimir,

        //funciones
        buscarReporte,
        consultarListado,
      }
    },

  })
