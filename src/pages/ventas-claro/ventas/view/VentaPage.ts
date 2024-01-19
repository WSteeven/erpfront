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
import { acciones, estados_activacion, formas_pagos, maskFecha } from 'config/utils'
import { VendedorController } from 'pages/ventas-claro/vendedores/infrestructure/VendedorController'
import { ProductoVentasController } from 'pages/ventas-claro/productoVentas/infrestructure/ProductoVentasController'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { HttpResponseGet } from 'shared/http/domain/HttpResponse'
import axios from 'axios'
import { apiConfig, endpoints } from 'config/api'
import { ClienteClaroController } from 'pages/ventas-claro/cliente/infrestucture/ClienteClaroController'
import { maxLength, required } from 'shared/i18n-validators'
import { ComportamientoModalesVentasClaro } from '../application/ComportamientoModalesVentasClaro'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales';
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading';
import { useAuthenticationStore } from 'stores/authentication';

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

    const cargando = new StatusEssentialLoading()

    const modales = new ComportamientoModalesVentasClaro()
    const store = useAuthenticationStore()


    const precio_producto = ref(0)
    const comision_vendedor = ref(0)
    const mostrarLabelModal = computed(() => accion.value === acciones.nuevo || accion.value === acciones.editar)



    /*************
     * Validaciones
     **************/
    const reglas = {
      vendedor: { required, },
      orden_id: { required, maxLength: maxLength(15), },
      orden_interna: { maxLength: maxLength(6), },
      forma_pago: { required, },
      producto: { required, },
      cliente: { required, },
      estado_activacion: { required, },
    }
    const v$ = useVuelidate(reglas, venta)
    setValidador(v$.value)

    const { productos_claro: productos, filtrarProductosClaro: filtrarProductos,
      vendedores_claro: vendedores, filtrarVendedoresClaro: filtrarVendedores,
      clientes_claro: clientes, filtrarClientesClaro: filtrarClientes,
    } = useFiltrosListadosSelects(listadosAuxiliares)

    cargarVista(async () => {
      await obtenerListados({
        productos: {
          controller: new ProductoVentasController(),
          params: { campos: 'id,nombre' },
        },
        vendedores: {
          controller: new VendedorController(),
          params: {
            'tipo_vendedor[]': 'JEFE_VENTAS',
            '&tipo_vendedor[]': 'VENDEDOR',
            activo: 1
          },
        },
        clientes: {
          controller: new ClienteClaroController(),
          params: { activo: 1 },
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
      if (data.formulario === 'ClienteClaroPage') clientes.value.push(data.modelo)
      if (data.formulario === 'VendedorPage') vendedores.value.push(data.modelo)
    }

    async function recargarVendedores() {
      cargando.activar()
      listadosAuxiliares.vendedores = (await new VendedorController().listar({ 'tipo_vendedor[]': 'JEFE_VENTAS', '&tipo_vendedor[]': 'VENDEDOR', activo: 1 })).result
      vendedores.value = listadosAuxiliares.vendedores
      cargando.desactivar()
    }
    async function recargarClientes() {
      cargando.activar()
      listadosAuxiliares.clientes = (await new ClienteClaroController().listar({ activo: 1 })).result
      clientes.value = listadosAuxiliares.clientes
      cargando.desactivar()
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
      mixin, venta, disabled, accion, v$,
      configuracionColumnas: configuracionColumnasVentas,
      estados_activacion,
      formas_pagos,
      maskFecha,
      precio_producto,
      comision_vendedor,
      mostrarLabelModal,
      modales,
      store,

      productos, filtrarProductos, recargarClientes,
      vendedores, filtrarVendedores, recargarVendedores,
      clientes, filtrarClientes,
      guardado,
    }
  },
})
