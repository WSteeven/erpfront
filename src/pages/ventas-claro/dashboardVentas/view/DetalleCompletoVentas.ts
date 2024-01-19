// Dependencias
import { defineComponent, ref, watchEffect } from 'vue'

// Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'
import ArchivoSeguimiento from 'subtareas/modules/gestorArchivosTrabajos/view/ArchivoSeguimiento.vue'
import EstadosSubtareas from 'components/tables/view/EstadosSubtareas.vue'

// Logica y controladores

import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { useVentaStore } from 'stores/venta'
import { Ventas } from 'pages/ventas-claro/ventas/domain/Venta'
import { VentasController } from 'pages/ventas-claro/ventas/infrestructure/VentaController'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { HttpResponseGet } from 'shared/http/domain/HttpResponse'
import axios from 'axios'
import { apiConfig, endpoints } from 'config/api'

export default defineComponent({
  components: {
    EssentialTable,
    ModalesEntidad,
    ArchivoSeguimiento,
    EstadosSubtareas,
  },
  setup() {
    /**********
     * Stores
     **********/
    const ventasStore = useVentaStore()

    /*******
     * Mixin
     *********/
    const mixin = new ContenedorSimpleMixin(Ventas, new VentasController())
    const { listadosAuxiliares, accion, disabled } = mixin.useReferencias()
    const {
      guardar,
      editar,
      eliminar,
      reestablecer,
      obtenerListados,
      cargarVista,
    } = mixin.useComportamiento()
    /************
     * Variables
     ************/
    const ventas = ventasStore.filaVenta
    const precio_producto = ref(0)
    const comision_vendedor = ref(0)
    /************
     * Funciones
     ************/
    function obtenerProducto() {
      const axiosHttpRepository = AxiosHttpRepository.getInstance()
      const url_producto =
        apiConfig.URL_BASE +
        '/' +
        axiosHttpRepository.getEndpoint(endpoints.producto_ventas) +
        '/' +
        ventas.producto
      axios({
        url: url_producto,
        method: 'GET',
        responseType: 'json',
        headers: {
          Authorization: axiosHttpRepository.getOptions().headers.Authorization,
        },
      }).then((response: HttpResponseGet) => {
        const { data } = response
        if (data) {
          precio_producto.value = data.modelo.precio
        }
      })
    }
    function obtenerComision() {
      const axiosHttpRepository = AxiosHttpRepository.getInstance()
      const url_comision =
        apiConfig.URL_BASE +
        '/' +
        axiosHttpRepository.getEndpoint(endpoints.obtener_comision) +
        '/' +
        ventas.producto +
        '/' +
        ventas.forma_pago
      axios({
        url: url_comision,
        method: 'GET',
        responseType: 'json',
        headers: {
          Authorization: axiosHttpRepository.getOptions().headers.Authorization,
        },
      }).then((response: HttpResponseGet) => {
        const { data } = response
        if (data) {
          comision_vendedor.value = data.comision_value
        }
      })
    }
    watchEffect(() => {
      if (ventas.producto != null && ventas.forma_pago != null) {
        obtenerProducto()
        obtenerComision()
      }
    })
    return {
      accion,
      disabled,
      ventas,
      precio_producto,
      comision_vendedor,
      guardar,
      editar,
      eliminar,
      reestablecer,
      listadosAuxiliares,
      mixin,
    }
  },
})
