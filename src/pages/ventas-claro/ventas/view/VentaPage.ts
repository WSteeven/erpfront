import { configuracionColumnasVentas } from '../domain/configuracionColumnasVentas'
import { computed, defineComponent, ref, watchEffect } from 'vue'
import { Venta } from '../domain/Venta'

import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue';
import LabelAbrirModal from 'components/modales/modules/LabelAbrirModal.vue';
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue';
import SolicitarFecha from 'shared/prompts/SolicitarFecha.vue'

import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'
import { useVuelidate } from '@vuelidate/core'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { VentaController } from '../infrestructure/VentaController'
import { acciones, estados, estados_activaciones, formas_pagos, maskFecha } from 'config/utils'
import { VendedorController } from 'pages/ventas-claro/vendedores/infrestructure/VendedorController'
import { ProductoVentasController } from 'pages/ventas-claro/productoVentas/infrestructure/ProductoVentasController'
import { ClienteClaroController } from 'pages/ventas-claro/cliente/infrestucture/ClienteClaroController'
import { maxLength, required, requiredIf } from 'shared/i18n-validators'
import { ComportamientoModalesVentasClaro } from '../application/ComportamientoModalesVentasClaro'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales';
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading';
import { useAuthenticationStore } from 'stores/authentication';
import { useVentaStore } from 'stores/ventasClaro/venta';
import { tabOptionsVentas, estadosActivacionesVentas } from 'config/ventas.utils';
import { CustomActionTable } from 'components/tables/domain/CustomActionTable';
import { useNotificaciones } from 'shared/notificaciones';
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt';

export default defineComponent({
  components: { TabLayoutFilterTabs2, ModalesEntidad, LabelAbrirModal, SolicitarFecha },
  setup() {
    /*********
     * Stores
     *********/
    useNotificacionStore().setQuasar(useQuasar())
    /***********
     * Mixin
     ************/
    const mixin = new ContenedorSimpleMixin(Venta, new VentaController())
    const { entidad: venta, disabled, accion, listadosAuxiliares, listado } = mixin.useReferencias()
    const { setValidador, obtenerListados, cargarVista, listar } = mixin.useComportamiento()
    const { onGuardado, onModificado, onReestablecer } = mixin.useHooks()
    const { confirmar, notificarCorrecto, prompt, notificarError } = useNotificaciones()

    const cargando = new StatusEssentialLoading()
    const ventaStore = useVentaStore()

    const modales = new ComportamientoModalesVentasClaro()
    const store = useAuthenticationStore()


    const tabDefecto = ref('1')
    const precio_producto = ref(0)
    const comision_vendedor = ref(0)
    const mostrarLabelModal = computed(() => accion.value === acciones.nuevo || accion.value === acciones.editar)
    const mostrarSolicitarFecha = ref(false)



    /*************
     * HOOKS
     **************/
    onGuardado((id, response) => {
      // if (response.modelo.estado_activacion == estadosActivacionesVentas.aprobado) filtrarVentas(estadosActivacionesVentas.aprobado)
      // if (response.modelo.estado_activacion == estadosActivacionesVentas.activado) filtrarVentas('1')
      // if (!response.modelo.activo) filtrarVentas('0')
    })
    onModificado((id, response) => {
      // if (response.modelo.estado_activacion == estadosActivacionesVentas.aprobado) filtrarVentas(estadosActivacionesVentas.aprobado)
      // if (response.modelo.estado_activacion == estadosActivacionesVentas.activado) filtrarVentas('1')
      // if (!response.modelo.activo) filtrarVentas('0')
    })
    onReestablecer(() => {
      precio_producto.value = 0
      comision_vendedor.value = 0
    })

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
      fecha_activacion: { requiredIf: requiredIf(() => venta.estado_activacion === 'ACTIVADO') }
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
    function filtrarVentas(tab: string) {
      tabDefecto.value = tab
      switch (tab) {
        case estadosActivacionesVentas.aprobado:
          listar({ activo: 1, estado_activacion: estadosActivacionesVentas.aprobado })
          break
        case '1':
          listar({ activo: 1, estado_activacion: estadosActivacionesVentas.activado })
          break
        case '0':
          listar({ activo: 0 })
          break;
        default: listar()
      }
    }
    async function guardado(data) {
      if (data.formulario === 'ClienteClaroPage') {
        listadosAuxiliares.clientes.push(data.modelo)
        clientes.value.push(data.modelo)
      }
      if (data.formulario === 'VendedorPage') {
        listadosAuxiliares.vendedores.push(data.modelo)
        vendedores.value.push(data.modelo)
      }
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

    async function obtenerPrecioProductoSeleccionado() {
      const productoSeleccionado = productos.value.filter((v) => v.id == venta.producto)[0]
      precio_producto.value = productoSeleccionado.precio
      await obtenerComisionVenta()
    }
    async function obtenerComisionVenta() {
      if (venta.producto && venta.vendedor) {
        comision_vendedor.value = await ventaStore.obtenerComision(venta.producto!, venta.forma_pago!, venta.vendedor!)
      }
    }

    async function fechaSubida(fecha?) {
      ventaStore.fechaActualizacion = fecha
      await ventaStore.actualizarCalculoComisiones()
    }

    /***********************
    * Botones de tabla
    ***********************/
    const btnDesactivar: CustomActionTable = {
      titulo: 'Suspender',
      icono: 'bi-toggle2-off',
      color: 'negative',
      tooltip: 'Marcar venta como suspendida',
      accion: ({ entidad, posicion }) => {
        confirmar('¿Está seguro de marcar esta venta como suspendida?', async () => {
          try {
            cargando.activar()
            ventaStore.idVenta = entidad.id
            await ventaStore.suspenderVenta()
            listado.value.splice(posicion, 1)
            notificarCorrecto('Suspendida correctamente')
          } catch (error: any) {
            notificarError('No se pudo marcar como suspendida la venta!')
          } finally {
            cargando.desactivar()
          }
        })
      }, visible: ({ entidad }) => entidad.activo && store.can('puede.desactivar.ventas_claro')
    }
    const btnActivar: CustomActionTable = {
      titulo: 'Activar',
      icono: 'bi-toggle2-on',
      color: 'positive',
      tooltip: 'Marcar venta como activada',
      accion: ({ entidad, posicion }) => {
        confirmar('¿Está seguro de activar el cliente?', async () => {
          const data: CustomActionPrompt = {
            titulo: 'Observación',
            mensaje: 'Ingresa una observación',
            accion: async (data) => {
              try {
                cargando.activar()
                ventaStore.idVenta = entidad.id
                await ventaStore.suspenderVenta({ observacion: data })
                listado.value.splice(posicion, 1)
                notificarCorrecto('Activado correctamente')
              } catch (error: any) {
                notificarError('No se pudo activar la venta!')
              } finally {
                cargando.desactivar()
              }
            }
          }
          prompt(data)
        })
      }, visible: ({ entidad }) => !entidad.activo && store.can('puede.activar.clientes_claro')
    }
    const btnPrimerMesPagado: CustomActionTable = {
      titulo: 'Primer pago',
      icono: 'fas fa-dollar-sign',
      color: 'primary',
      tooltip: 'Marcar primer mes como pagado',
      accion: ({ entidad, posicion }) => {
        confirmar('¿Estás seguro de marcar como pagado el primer mes?', async () => {
          ventaStore.idVenta = entidad.id
          const response = await ventaStore.marcarPrimerMesPagado()
          console.log(response)
          listado.value.splice(posicion, 1, response?.result)
        })
        console.log(entidad, posicion)
      }, visible: ({ entidad }) => entidad.activo && entidad.estado_activacion == estadosActivacionesVentas.activado && !entidad.primer_mes
    }
    const btnRegistrarNovedades: CustomActionTable = {
      titulo: 'Novedades',
      color: 'warning',
      icono: 'bi-wrench',
      accion: async ({ entidad, posicion }) => {
        ventaStore.idVenta = entidad.id
        confirmar('¿Está seguro de abrir el formulario de registro de novedades de la venta?', () => {
          ventaStore.permitirSubir = true
          modales.abrirModalEntidad('SeguimientoVentaPage')
        })
      },
      visible: ({ entidad }) => {
        return true
      }
    }
    const btnActualizarCalculoComisiones: CustomActionTable = {
      titulo: 'Actualizar Comisiones',
      color: 'warning',
      icono: 'bi-arrow-clockwise',
      accion: ({ entidad, posicion }) => {
        confirmar('Esto revisará las ventas registradas y actualizará el calculo de comisiones según el orden de la fecha de activación de las ventas. ¿Está seguro de continuar?', () => {
          mostrarSolicitarFecha.value = true
        })
      },
      visible: ({ entidad }) => store.can('puede.actualizar.comisiones_ventas')

    }


    return {
      mixin, venta, disabled, accion, v$, acciones,
      configuracionColumnas: configuracionColumnasVentas,
      estados_activaciones,
      formas_pagos,
      maskFecha,
      precio_producto,
      comision_vendedor,
      mostrarLabelModal,
      modales,
      store,
      tabDefecto,
      tabOptionsVentas,
      mostrarSolicitarFecha,

      productos, filtrarProductos, recargarClientes,
      vendedores, filtrarVendedores, recargarVendedores,
      clientes, filtrarClientes,
      guardado,
      obtenerPrecioProductoSeleccionado,
      obtenerComisionVenta,
      filtrarVentas,
      fechaSubida,

      //botones de tabla
      btnActivar,
      btnDesactivar,
      btnPrimerMesPagado,
      btnRegistrarNovedades,
      btnActualizarCalculoComisiones,
    }
  },
})
