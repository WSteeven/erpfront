import { DetalleProducto } from './../../../../detalles_productos/domain/DetalleProducto';
import EssentialTable from 'components/tables/view/EssentialTable.vue';
import { DetalleProductoController } from "pages/bodega/detalles_productos/infraestructure/DetalleProductoController"
import { defineComponent, ref } from "vue"
import { configuracionColumnasSeguimientoDetalle } from '../../rpt_inventario/domain/configuracionColumnasSeguimientoDetalle';
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading';
import { useNotificaciones } from 'shared/notificaciones';
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository';
import { apiConfig, endpoints } from 'config/api';
import { AxiosResponse } from 'axios';

export default defineComponent({
  components: {EssentialTable},
  setup() {
    let detalle = ref()
    const detalles = ref([])
    const results = ref([])
    const listado = ref([])
    const {notificarError} = useNotificaciones()
    async function cargarDetalles(){
      const {result} = await new DetalleProductoController().listar()
      results.value = result
      detalles.value = result
    }

    cargarDetalles()

    async function buscarKardex(){
      const cargando  = new StatusEssentialLoading()

      try{
        cargando.activar()
        const axios = AxiosHttpRepository.getInstance()
        const url = apiConfig.URL_BASE+'/'+axios.getEndpoint(endpoints.reporte_inventario)+'/kardex/'+detalle.value
        const response:AxiosResponse =await axios.get(url)
        console.log(response)
        listado.value = response.data.results
        cargando.desactivar()
      }
      catch(e){
        notificarError('Error al obtener los registros del item.')
      }finally{
        cargando.desactivar()
      }
    }

    return {
      detalle,
      detalles,
      listado,
      configuracionColumnasSeguimientoDetalle,
      buscarKardex,
      filtrarDetalle(val, update) {
        if (val === '') {
          update(() => {
            detalles.value= results.value
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
