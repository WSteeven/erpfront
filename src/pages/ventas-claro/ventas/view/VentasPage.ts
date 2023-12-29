import { defineComponent, ref, watchEffect } from 'vue'
import { Ventas } from '../domain/Ventas'

import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'
import { useVuelidate } from '@vuelidate/core'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { VentasController } from '../infrestructure/VentasController'
import { configuracionColumnasVentas } from '../domain/configuracionColumnasVentas'
import { estados_activacion, formas_pago, maskFecha } from 'config/utils'
import { maxValue, minValue } from '@vuelidate/validators'
import { VendedoresController } from 'pages/ventas-claro/vendedores/infrestructure/VendedoresController'
import { ProductoVentasController } from 'pages/ventas-claro/productoVentas/infrestructure/ProductoVentasController'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { HttpResponseGet } from 'shared/http/domain/HttpResponse'
import axios from 'axios'
import { apiConfig, endpoints } from 'config/api'
import { useVentaStore } from 'stores/venta'
import { ClienteClaroController } from 'pages/ventas-claro/cliente/infrestucture/ClienteClaroController'

export default defineComponent({
  components: { TabLayout },
  setup() {
    /*********
     * Stores
     *********/
    useNotificacionStore().setQuasar(useQuasar())
    /***********
     * Mixin
     ************/
    const mixin = new ContenedorSimpleMixin(Ventas, new VentasController())
    const {
      entidad: ventas,
      disabled,
      accion,
      listadosAuxiliares,
    } = mixin.useReferencias()
    const {consultar, setValidador, obtenerListados, cargarVista } =
      mixin.useComportamiento()
const precio_producto= ref(0)
const comision_vendedor = ref(0)
    /*************
     * Validaciones
     **************/
    const reglas = {
      vendedor: {
        required: true,
      },
      orden_id: {
        required: true,
        //  maxValue: maxValue(13),
      },
      orden_interna: {
        required: true,
        //  maxValue: maxValue(6),
      },
      forma_pago: {
        required: true,
      },
      producto: {
        required: true,
      },
      cliente: {
        required: true,
      },
      estado_activacion: {
        required: true,
      },
    }
    const v$ = useVuelidate(reglas, ventas)
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
          controller: new VendedoresController(),
          params: {},
        },
        clientes: {
          controller: new ClienteClaroController(),
          params: {},
        }
      })
      productos.value = listadosAuxiliares.productos
      vendedores.value = listadosAuxiliares.vendedores
      clientes.value = listadosAuxiliares.clientes
    })

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
          (v) => v.bundle.toLowerCase().indexOf(needle) > -1 || v.plan_info.toLowerCase().indexOf(needle) > -1
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
          (v) => v.nombres.toLowerCase().indexOf(needle) > -1 || v.apellidos.toLowerCase().indexOf(needle) > -1 || v.identificacion.toLowerCase().indexOf(needle) > -1
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
        axiosHttpRepository.getEndpoint(endpoints.producto_ventas) +
        '/' +
        ventas.producto
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
        ventas.producto+'/'+ventas.forma_pago+'/'+ventas.vendedor
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
      if (ventas.producto != null && ventas.forma_pago != null) {
        obtenerProducto()
        obtenerComision()
      }
    })
    return {
      mixin,
      ventas,
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
      filtrarProductos,
      filtrarVendedores,
      filtrarClientes,
    }
  },
})
