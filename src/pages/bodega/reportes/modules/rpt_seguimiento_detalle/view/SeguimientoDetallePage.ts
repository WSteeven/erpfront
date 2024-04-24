import { DetalleProducto } from './../../../../detalles_productos/domain/DetalleProducto';
import EssentialTable from 'components/tables/view/EssentialTable.vue';
import { DetalleProductoController } from "pages/bodega/detalles_productos/infraestructure/DetalleProductoController"
import { defineComponent, onMounted, reactive, ref } from "vue"
import { configuracionColumnasSeguimientoDetalle } from '../../rpt_inventario/domain/configuracionColumnasSeguimientoDetalle';
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading';
import { useNotificaciones } from 'shared/notificaciones';
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository';
import { apiConfig, endpoints } from 'config/api';
import { AxiosResponse } from 'axios';
import useVuelidate from '@vuelidate/core';
import { required } from 'shared/i18n-validators';
import { imprimirArchivo } from 'shared/utils';
import { useNotificacionStore } from 'stores/notificacion';
import { useCargandoStore } from 'stores/cargando';
import { useQuasar } from 'quasar';
import { SucursalesDetalleController } from './infraestructure/SucursalesDetalleController';
import { configuracionColumnasItemPreingreso } from 'pages/bodega/preingresoMateriales/domain/configuracionColumnasItemsPreingreso';
import { ColumnConfig } from 'components/tables/domain/ColumnConfig';
import { ItemPreingresoMaterial } from 'pages/bodega/preingresoMateriales/domain/ItemPreingresoMaterial';

export default defineComponent({
  components: { EssentialTable },
  setup() {

    //stores
    useNotificacionStore().setQuasar(useQuasar())
    useCargandoStore().setQuasar(useQuasar())
    const cargando = new StatusEssentialLoading()

    const kardex = reactive({
      detalle_id: '',
      fecha_inicio: '',
      fecha_fin: '',
      tipo_rpt: '',
      sucursal_id: '',
    })
    const sucursales = ref([])
    const detalles = ref([])
    const results = ref([])
    const listado = ref([])
    const listadoPreingreso = ref([])
    const { notificarError } = useNotificaciones()
    async function cargarDetalles() {
      cargando.activar()
      const { result } = await new DetalleProductoController().listar({ tipo_busqueda: 'only_inventario' })
      results.value = result
      detalles.value = result
      cargando.desactivar()
    }
    onMounted(async () => await cargarDetalles())

    const reglas = {
      fecha_inicio: { required },
      fecha_fin: { required },
    }
    const v$ = useVuelidate(reglas, kardex)
    // setValidador(v$.value)

    async function buscarKardex() {
      try {
        cargando.activar()
        const axios = AxiosHttpRepository.getInstance()
        const url = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.reporte_inventario) + '/kardex'
        const response: AxiosResponse = await axios.post(url, kardex)
        // console.log(response)
        if (response.data.results) {
          listado.value = response.data.results
          listadoPreingreso.value = response.data.results2
        }
        cargando.desactivar()
      }
      catch (e) {
        notificarError('Error al obtener los registros del item.')
      } finally {
        cargando.desactivar()
        kardex.tipo_rpt = ''
      }
    }
    async function imprimirReporte(tipo: string) {
      kardex.tipo_rpt = tipo

      const axios = AxiosHttpRepository.getInstance()
      const filename = 'reporte_kardex_' + Date.now()
      const url = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.reporte_inventario) + '/kardex'
      switch (tipo) {
        case 'excel':
          imprimirArchivo(url, 'POST', 'blob', 'xlsx', filename, kardex)
          break;
        case 'pdf':
          imprimirArchivo(url, 'POST', 'blob', 'pdf', filename, kardex)
          break;
        default:
          buscarKardex()
          break;
      }

    }
    async function obtenerSucursales() {
      kardex.sucursal_id = ''
      sucursales.value = []
      try {

        cargando.activar()
        const response = await new SucursalesDetalleController().listar({ detalle_id: kardex.detalle_id })
        sucursales.value = response.result
      } catch (error) {
        console.log(error)
      } finally {
        cargando.desactivar()
      }
    }

    configuracionColumnasItemPreingreso.splice(1, 0, {
      name: 'preingreso',
      field: 'preingreso',
      label: 'Preingreso',
      align: 'left',
      sortable: true,
    },
    {
      name: 'created_at',
      field: 'created_at',
      label: 'Fecha',
      align: 'left',
      sortable: true,
    },)

    return {
      kardex, v$,
      detalles,
      listado,
      listadoPreingreso,
      configuracionColumnasSeguimientoDetalle,
      columnasPreingresos: configuracionColumnasItemPreingreso,
      sucursales,
      imprimirReporte,
      obtenerSucursales,
      buscarKardex,
      filtrarDetalle(val, update) {
        if (val === '') {
          update(() => {
            detalles.value = results.value
          })
          return
        }
        update(() => {
          detalles.value = results.value.filter((v: DetalleProducto) => v.descripcion!.toLowerCase().indexOf(val.toLowerCase()) > -1 || (v.serial ?? '').toLowerCase().indexOf(val.toLowerCase()) > -1)
        })
      },
    }
  }
})
