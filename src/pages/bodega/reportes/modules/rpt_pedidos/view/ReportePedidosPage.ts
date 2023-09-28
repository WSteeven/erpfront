//Dependencias
import { configuracionColumnasPedidos } from "pages/bodega/pedidos/domain/configuracionColumnasPedidos";
import { defineComponent, reactive, ref } from "vue";
import { required } from "shared/i18n-validators";
import { LocalStorage, useQuasar, } from "quasar";
import useVuelidate from "@vuelidate/core";

//Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import ModalEntidad from "components/modales/view/ModalEntidad.vue";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'vue-chartjs'


//Logica y controladores
import { StatusEssentialLoading } from "components/loading/application/StatusEssentialLoading";
import { AxiosHttpRepository } from "shared/http/infraestructure/AxiosHttpRepository";
import { AxiosResponse } from "axios"
import { endpoints } from "config/api";
import { useNotificaciones } from "shared/notificaciones";
import { useNotificacionStore } from "stores/notificacion";
import { useCargandoStore } from "stores/cargando";
import { accionesTabla } from "config/utils";
import { CustomActionTable } from "components/tables/domain/CustomActionTable";
import { usePedidoStore } from "stores/pedido";
import { ComportamientoModalesPedido } from "pages/bodega/pedidos/application/ComportamientoModalesPedido";
import { report } from "process";

ChartJS.register(ArcElement, Tooltip, Legend)

export default defineComponent({
  components: { EssentialTable, Doughnut, ModalEntidad },
  setup() {
    const reporte = reactive({
      fecha_inicio: '',
      fecha_fin: '',
      autorizacion: '',
      estado: '',
    })
    useNotificacionStore().setQuasar(useQuasar())
    useCargandoStore().setQuasar(useQuasar())
    const pedidoStore = usePedidoStore()
    const cargando = new StatusEssentialLoading()

    const modales = new ComportamientoModalesPedido()
    const listado = ref([])
    const datos = ref([])
    let datosConfigurados = ref()
    const { notificarError } = useNotificaciones()
    const reglas = {
      fecha_inicio: { required },
      fecha_fin: { required },
    }
    const v$ = useVuelidate(reglas, reporte)


    /**
     * Funciones
     */
    async function buscarReporte(accion: string) {
      try {
        cargando.activar()
        listado.value = await pedidoStore.buscarReporte(accion, reporte, listado.value)
        cargando.desactivar()
      } catch (e) {
        console.log(e)
        notificarError('Error al obtener reporte')
      } finally {
        cargando.desactivar()
      }
    }
    function llenarDiccionario(datos) {
      datosConfigurados.value = {
        labels: Object.keys(datos.value),
        datasets: [
          {
            backgroundColor: ['#7CFADC', '#FFA13B', '#FAE13C', '#ffebee', '#FA67CE', '#9253FA', 'gray', 'indigo', 'teal'],
            data: Object.values(datos.value)
          }
        ]
      }
    }

    /**
     * Botones de tabla
     */
    const btnVerPedido: CustomActionTable = {
      titulo: '', icono: 'bi-eye', color: 'primary',
      accion: async ({ entidad }) => {
        pedidoStore.idPedido = entidad.id
        await pedidoStore.showPreview()
        modales.abrirModalEntidad('VisualizarPedidoPage')
      }
    }
    const btnImprimir: CustomActionTable = {
      titulo: 'Imprimir',
      color: 'secondary',
      icono: 'bi-printer',
      accion: async ({ entidad }) => {
        pedidoStore.idPedido = entidad.id
        await pedidoStore.imprimirPdf()
      },
      visible: ({ entidad }) => {
        return entidad.estado == 'COMPLETA' ? true : false
      }
    }

    //listados
    const estados = JSON.parse(LocalStorage.getItem('estados_transacciones')!.toString())
    const autorizaciones = JSON.parse(LocalStorage.getItem('autorizaciones')!.toString())

    //agregar otra opcion
    estados.unshift({ id: 0, nombre: 'TODOS LOS ESTADOS', })
    autorizaciones.unshift({ id: 0, nombre: 'TODAS LAS AUTORIZACIONES', })


    //datos para el grafico
    const data = {
      labels: ['VueJs', 'EmberJs', 'ReactJs', 'AngularJs'],
      datasets: [
        {
          backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
          data: [40, 20, 80, 10]
        }
      ]
    }

    const options = {
      responsive: true,
      maintainAspectRatio: false
    }

    const configuracionColumnas = [...configuracionColumnasPedidos, accionesTabla]

    return {
      configuracionColumnas,
      reporte, v$,
      autorizaciones,
      estados,
      listado,
      modales,
      //funciones
      buscarReporte,
      //grafico
      data, options,
      datos,
      datosConfigurados,

      //botones de tabla
      btnVerPedido,
      btnImprimir,


    }
  }
})
