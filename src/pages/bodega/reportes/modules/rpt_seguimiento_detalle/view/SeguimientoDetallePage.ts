import { DetalleProducto } from './../../../../detalles_productos/domain/DetalleProducto';
import EssentialTable from 'components/tables/view/EssentialTable.vue';
import { DetalleProductoController } from "pages/bodega/detalles_productos/infraestructure/DetalleProductoController"
import { defineComponent, reactive, ref } from "vue"
import { configuracionColumnasSeguimientoDetalle } from '../../rpt_inventario/domain/configuracionColumnasSeguimientoDetalle';
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading';
import { useNotificaciones } from 'shared/notificaciones';
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository';
import { apiConfig, endpoints } from 'config/api';
import { AxiosResponse } from 'axios';
import useVuelidate from '@vuelidate/core';
import { required } from 'shared/i18n-validators';
import { imprimirArchivo } from 'shared/utils';

export default defineComponent({
  components: { EssentialTable },
  setup() {

    const kardex = reactive({
      detalle: '',
      fecha_inicio: '',
      fecha_fin: '',
      tipo_rpt: '',
    })
    const detalles = ref([])
    const results = ref([])
    const listado = ref([])
    const { notificarError } = useNotificaciones()
    async function cargarDetalles() {
      const { result } = await new DetalleProductoController().listar()
      results.value = result
      detalles.value = result
    }

    cargarDetalles()

    const reglas = {
      fecha_inicio: { required },
      fecha_fin: { required },
    }
    const v$ = useVuelidate(reglas, kardex)
    // setValidador(v$.value)

    async function buscarKardex() {
      const cargando = new StatusEssentialLoading()
      try {
        cargando.activar()
        const axios = AxiosHttpRepository.getInstance()
        const url = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.reporte_inventario) + '/kardex'
        const response: AxiosResponse = await axios.post(url, kardex)
        console.log(response)
        if (response.data.results) listado.value = response.data.results
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
      const filename = 'reporte_kardex_'+Date.now()
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

    return {
      kardex, v$,
      detalles,
      listado,
      configuracionColumnasSeguimientoDetalle,
      imprimirReporte,
      buscarKardex,
      filtrarDetalle(val, update) {
        if (val === '') {
          update(() => {
            detalles.value = results.value
          })
          return
        }
        update(() => {
          detalles.value = results.value.filter((v: DetalleProducto) => v.descripcion!.toLowerCase().indexOf(val.toLowerCase()) > -1)
        })
      },
    }
  }
})
