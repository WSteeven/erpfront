import { computed, defineComponent, ref, watchEffect } from 'vue'
import { Venta } from '../domain/Venta'

import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import LabelAbrirModal from 'components/modales/modules/LabelAbrirModal.vue';
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue';

import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'
import { useVuelidate } from '@vuelidate/core'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { VentaController } from '../infrestructure/VentaController'
import { configuracionColumnasVentas } from '../domain/configuracionColumnasVentas'
import { acciones, estados_activacion, formas_pago, maskFecha } from 'config/utils'
import { VendedorController } from 'pages/ventas-claro/vendedores/infrestructure/VendedorController'
import { ProductoVentasController } from 'pages/ventas-claro/productoVentas/infrestructure/ProductoVentasController'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { HttpResponseGet } from 'shared/http/domain/HttpResponse'
import axios from 'axios'
import { apiConfig, endpoints } from 'config/api'
import { ClienteClaroController } from 'pages/ventas-claro/cliente/infrestucture/ClienteClaroController'
import { maxLength, required } from 'shared/i18n-validators'
import { ComportamientoModalesVentasClaro } from '../application/ComportamientoModalesVentasClaro'

export default defineComponent({
  components: { TabLayout, ModalesEntidad, LabelAbrirModal },
  setup() {
    /*********
     * Stores
     *********/
    useNotificacionStore().setQuasar(useQuasar())
    /***********
     * Mixin
     ************/
    const mixin = new ContenedorSimpleMixin(Venta, new VentaController())
    const { entidad: venta, disabled, accion, listadosAuxiliares, } = mixin.useReferencias()
    const { setValidador, obtenerListados, cargarVista } = mixin.useComportamiento()

    const modales = new ComportamientoModalesVentasClaro()


    const precio_producto = ref(0)
    const comision_vendedor = ref(0)
    const mostrarLabelModal = computed(() => accion.value === acciones.nuevo || accion.value === acciones.editar)

    modales.abrirModalEntidad('ClientePage')

    /*************
     * Validaciones
     **************/
    const reglas = {
      vendedor: { required, },
      orden_id: { required, maxLength: maxLength(13), },
      orden_interna: { maxLength: maxLength(6), },
      forma_pago: { required, },
      producto: { required, },
      cliente: { required, },
      estado_activacion: { required, },
    }
    const v$ = useVuelidate(reglas, venta)
    setValidador(v$.value)
    const productos = ref([])
    const vendedores = ref([])
    const clientes = ref([])
    cargarVista(async () => {
      await obtenerListados({
        productos: {
          controller: new ProductoVentasController(),
          params: { campos: 'id,nombre' },
        },
        vendedores: {
          controller: new VendedorController(),
          params: { 
            // supervisor: false
           },
        },
        clientes: {
          controller: new ClienteClaroController(),
          params: {},
        },
      })
      productos.value = listadosAuxiliares.productos
      vendedores.value = listadosAuxiliares.vendedores
      clientes.value = listadosAuxiliares.clientes
    })

    /**************************************************************
     * Funciones
     **************************************************************/
    async function guardado(data) {
      console.log(data)
    }

    function filtrarProductos(val, update) {
      if (val === '') {
        update(() => {
          productos.value = listadosAuxiliares.productos
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        productos.value = listadosAuxiliares.productos.filter(
          (v) =>
            v.bundle.toLowerCase().indexOf(needle) > -1 ||
            v.plan_info.toLowerCase().indexOf(needle) > -1
        )
      })
    }
    function filtrarClientes(val, update) {
      if (val === '') {
        update(() => {
          clientes.value = listadosAuxiliares.clientes
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        clientes.value = listadosAuxiliares.clientes.filter(
          (v) =>
            v.nombres.toLowerCase().indexOf(needle) > -1 ||
            v.apellidos.toLowerCase().indexOf(needle) > -1 ||
            v.identificacion.toLowerCase().indexOf(needle) > -1
        )
      })
    }
    function filtrarVendedores(val, update) {
      if (val === '') {
        update(() => {
          vendedores.value = listadosAuxiliares.vendedores
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        vendedores.value = listadosAuxiliares.vendedores.filter(
          (v) =>
            v.codigo_vendedor.toLowerCase().indexOf(needle) > -1 ||
            v.empleado_info.toLowerCase().indexOf(needle) > -1
        )
      })
    }
    function obtenerProducto() {
      const axiosHttpRepository = AxiosHttpRepository.getInstance()
      const url_acreditacion =
        apiConfig.URL_BASE +
        '/' +
        axiosHttpRepository.getEndpoint(endpoints.productos_ventas) +
        '/' +
        venta.producto
      axios({
        url: url_acreditacion,
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
      const url_acreditacion =
        apiConfig.URL_BASE +
        '/' +
        axiosHttpRepository.getEndpoint(endpoints.obtener_comision) +
        '/' +
        venta.producto +
        '/' +
        venta.forma_pago +
        '/' +
        venta.vendedor
      axios({
        url: url_acreditacion,
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
      if (venta.producto != null && venta.forma_pago != null) {
        obtenerProducto()
        obtenerComision()
      }
    })
    return {
      mixin,
      venta,
      disabled,
      accion,
      v$,
      configuracionColumnas: configuracionColumnasVentas,
      estados_activacion,
      formas_pago,
      vendedores,
      clientes,
      productos,
      maskFecha,
      precio_producto,
      comision_vendedor,
      mostrarLabelModal,
      modales,


      filtrarProductos,
      filtrarVendedores,
      filtrarClientes,
      guardado,
    }
  },
})
