// Dependencias
import { configuracionColumnasProductosSeleccionadosSolicitudDescuento } from '../domain/configuracionColumnasProductosSeleccionadosSolicitudDescuento'
import { estadosInspecciones, estadosSolicitudDescuento, tabOptionsEstadosSolicitudDescuento } from 'pages/sso/config/utils'
import { configuracionColumnasSolicitudDescuento } from '../domain/configuracionColumnasSolicitudDescuento'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { acciones, accionesTabla, maskFecha } from 'config/utils'
import { useAuthenticationStore } from 'stores/authentication'
import { useNotificaciones } from 'shared/notificaciones'
import { computed, defineComponent, ref } from 'vue'
import { required } from 'shared/i18n-validators'
import useVuelidate from '@vuelidate/core'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'

// Componentes
import SeleccionProductosUsuario from 'components/inputs/seleccionProductosUsuario/view/SeleccionProductosUsuario.vue'
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import GestorArchivos from 'components/gestorArchivos/GestorArchivos.vue'
import Estado from 'components/tables/view/EstadosSubtareas.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { ProductoSeleccionadoSolicitudDescuento } from '../domain/ProductoSeleccionadoSolicitudDescuento'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { SolicitudDescuentoController } from '../infraestructure/SolicitudDescuentoController'
import { SolicitudDescuento } from '../domain/SolicitudDescuento'
import { ColumnConfig } from 'components/tables/domain/ColumnConfig'

export default defineComponent({
  components: { TabLayoutFilterTabs2, Estado, GestorArchivos, SeleccionProductosUsuario },
  emits: ['guardado'],
  setup(props, { emit }) {
    /*********
     * Stores
     *********/
    const authenticationStore = useAuthenticationStore()

    /********
     * Mixin
     ********/
    const mixin = new ContenedorSimpleMixin(SolicitudDescuento, new SolicitudDescuentoController())
    const { entidad: solicitud, disabled, listadosAuxiliares, accion, tabs } = mixin.useReferencias()
    const { setValidador, listar, cargarVista, obtenerListados, consultar, editarParcial, reestablecer } = mixin.useComportamiento()
    const { onConsultado, onGuardado, onModificado, onReestablecer } = mixin.useHooks()

    cargarVista(async () => {
      await obtenerListados({
        empleados: {
          controller: new EmpleadoController(),
          params: {
            campos: 'id,nombres,apellidos',
            estado: 1,
          }
        },
      })
    })

    /*************
     * Variables
     *************/
    const $q = useQuasar()
    const tabActual = ref()
    const idEntidad = ref()
    const refArchivo = ref()
    const deshabilitarAgregarProductos = ref(false)
    const route = useRoute()
    const enRutaInspeccionIncidente = computed(() => ['inspecciones', 'incidentes'].includes(route.name?.toString() ?? ''))
    const { prompt, confirmar } = useNotificaciones()
    const establecerPrecios = ref(false)

    /*************
     * Funciones
     *************/
    const { empleados, filtrarEmpleados } = useFiltrosListadosSelects(listadosAuxiliares)

    function filtrarSolicitudes(tab: string, params?: any) {
      const idIncidente = enRutaInspeccionIncidente.value ? solicitud.incidente : null
      listar({ estado: tab, incidente_id: idIncidente, ...params })
      tabActual.value = tab
    }

    const subirArchivos = async () => await refArchivo.value.subir()

    const confirmarPreciosEstablecidos = () => {
      confirmar('Asegúrese de que los precios sean correctos para registrarlos. ¿Continuar?', () => {
        if (solicitud.id) editarParcial(solicitud.id, { detalles_productos: solicitud.detalles_productos, estado: estadosSolicitudDescuento.PRECIOS_ESTABLECIDOS })
      })
    }

    const confirmarDescuentoRealizado = () => {
      confirmar('¿Está seguro de marcar la solicitud de descuento como realizada?', () => {
        if (solicitud.id) editarParcial(solicitud.id, { estado: estadosSolicitudDescuento.DESCONTADO })
      })
    }

    /*****************
     * Botones tabla
     *****************/
    const btnEditarPrecioUnitario: CustomActionTable<ProductoSeleccionadoSolicitudDescuento> = {
      titulo: 'Editar precio unitario',
      icono: 'bi-text-center',
      color: 'positive',
      visible: () => [estadosSolicitudDescuento.CREADO, estadosSolicitudDescuento.PRECIOS_ESTABLECIDOS].includes(solicitud.estado ?? '') && authenticationStore.can('puede.editar.precios_unitarios_solicitudes_descuentos'),
      forzarEditable: true,
      accion: async ({ entidad }) => {
        const config: CustomActionPrompt = {
          titulo: 'Motivo',
          mensaje: 'Ingrese el precio unitario de este item.',
          defecto: entidad.precio_unitario,
          accion: async (precioUnitario) => {
            entidad.precio_unitario = precioUnitario
          },
        }

        prompt(config)
      }
    }

    const btnEditarCantidad: CustomActionTable<ProductoSeleccionadoSolicitudDescuento> = {
      titulo: 'Editar cantidad',
      icono: 'bi-pencil-square',
      color: 'indigo',
      visible: () => ($q.screen.xs || $q.screen.sm) && accion.value === acciones.nuevo,
      accion: async ({ entidad }) => {
        const config: CustomActionPrompt = {
          titulo: 'Cantidad',
          mensaje: 'Ingrese la nueva cantidad.',
          tipo: 'number',
          defecto: entidad.cantidad,
          accion: async (cantidad) => {
            entidad.cantidad = cantidad
          },
        }

        prompt(config)
      }
    }

    const btnEliminar: CustomActionTable<ProductoSeleccionadoSolicitudDescuento> = {
      titulo: 'Eliminar',
      icono: 'bi-trash',
      color: 'negative',
      accion: async ({ posicion }) => confirmar('¿Está seguro de que desea eliminar la fila seleccionada?', () => solicitud.detalles_productos.splice(posicion, 1))
    }

    const btnEstablecerPrecios: CustomActionTable<SolicitudDescuento> = {
      titulo: ({ entidad }) => `${entidad.estado === estadosSolicitudDescuento.CREADO ? 'Establecer' : 'Editar'} precios`,
      icono: 'bi-cash-coin',
      color: 'positive',
      visible: ({ entidad }) => [estadosSolicitudDescuento.CREADO, estadosSolicitudDescuento.PRECIOS_ESTABLECIDOS].includes(entidad.estado) && authenticationStore.can('puede.editar.precios_unitarios_solicitudes_descuentos'),
      accion: async ({ entidad }) => {
        await consultar(entidad)
        accion.value = acciones.consultar
        tabs.value = 'formulario'
        // establecerPrecios.value = true
      }
    }

    const btnConfirmarDescuento: CustomActionTable<SolicitudDescuento> = {
      titulo: 'Confirmar descuento',
      icono: 'bi-check-circle',
      color: 'positive',
      visible: ({ entidad }) => entidad.estado === estadosSolicitudDescuento.PRECIOS_ESTABLECIDOS && authenticationStore.can('puede.confirmar.descuento_realizado_solicitudes_descuentos'),
      accion: async ({ entidad }) => {
        consultar(entidad)
        accion.value = acciones.consultar
        tabs.value = 'formulario'
      }
    }

    /*********
     * Reglas
     *********/
    const rules = {
      titulo: { required },
      descripcion: { required },
      empleado_involucrado: { required },
    }

    const v$ = useVuelidate(rules, solicitud)
    setValidador(v$.value)

    /********
     * Hooks
     ********/
    onConsultado(() => {
      // establecerPrecios.value = false
      setTimeout(() => refArchivo.value.listarArchivosAlmacenados(solicitud.id), 1)
      console.log(solicitud)
      // solicitud.finalizado = solicitud.estado === estadosSolicitudDescuento.DESCONTADO
    })

    onGuardado((id: number) => {
      idEntidad.value = id
      setTimeout(() => subirArchivos(), 1)
      emit('guardado', id)
    })

    onModificado((id: number) => {
      idEntidad.value = id
      setTimeout(() => subirArchivos(), 1)
    })

    onReestablecer(() => {
      refArchivo.value.limpiarListado()
      solicitud.empleado_solicitante = authenticationStore.user.apellidos + ' ' + authenticationStore.user.nombres
    })

    /********
     * Init
     ********/
    if (!enRutaInspeccionIncidente.value) filtrarSolicitudes(estadosInspecciones.CREADO)
    solicitud.empleado_solicitante = authenticationStore.user.apellidos + ' ' + authenticationStore.user.nombres

    const columnasProductosSeleccionadosSolicitudDescuento = configuracionColumnasProductosSeleccionadosSolicitudDescuento.map((c: ColumnConfig<ProductoSeleccionadoSolicitudDescuento>) => {
      if (c.field === 'precio_unitario') {
        c.editable = authenticationStore.esContabilidad
      }
      if (c.field === 'cantidad') {
        c.editable = authenticationStore.esSso
      }
      return c
    })

    return {
      v$,
      mixin,
      solicitud,
      accion,
      disabled,
      maskFecha,
      configuracionColumnasSolicitudDescuento,
      tabActual,
      filtrarSolicitudes,
      tabOptionsEstadosSolicitudDescuento,
      estadosSolicitudDescuento,
      acciones,
      empleados,
      filtrarEmpleados,
      idEntidad,
      refArchivo,
      columnas: [...columnasProductosSeleccionadosSolicitudDescuento, accionesTabla],
      btnEditarPrecioUnitario,
      btnEditarCantidad,
      btnEliminar,
      btnEstablecerPrecios,
      btnConfirmarDescuento,
      precioTotal: computed(() => solicitud.detalles_productos.reduce((acc, item: any) => acc = acc + (!isNaN(Number(item.precio_unitario)) ? Number(item.precio_unitario) * Number(item.cantidad) : 0), 0)),
      confirmarPreciosEstablecidos,
      confirmarDescuentoRealizado,
      deshabilitarAgregarProductos,
      enRutaInspeccionIncidente,
      consultar,
      authenticationStore,
      reestablecer,
      establecerPrecios,
    }
  }
})