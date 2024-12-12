//Dependencias
import { configuracionColumnasTransferencias } from '../domain/configuracionColumnasTransferencias'
import { configuracionColumnasProductosSeleccionados } from 'pages/bodega/devoluciones/domain/configuracionColumnasProductosSeleccionados'
import { configuracionColumnasItemsSeleccionados } from '../domain/configuracionColumnasItemsSeleccionados'
import { required, requiredIf } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { computed, defineComponent, ref } from 'vue'
import {
  acciones,
  opcionesEstadosTransferenciasBodega,
  tabOptionsTransferencias
} from 'config/utils'

//Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { TransferenciaController } from '../infraestructure/TransferenciaController'
import { Transferencia } from '../domain/Transferencia'
import { useNotificaciones } from 'shared/notificaciones'
import { ComportamientoModalesTransferencia } from '../application/ComportamientoModalesTransferencia'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { ClienteController } from 'pages/sistema/clientes/infraestructure/ClienteController'
import { useAuthenticationStore } from 'stores/authentication'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { useOrquestadorSelectorItems } from '../application/OrquestadorSelectorItems'
import { configuracionColumnasInventarios } from 'pages/bodega/inventario/domain/configuracionColumnasInventarios'
import { LocalStorage } from 'quasar'
import { ValidarListadoProductos } from '../application/validaciones/ValidarListadoProductos'
import { ordenarLista } from 'shared/utils'
import { SucursalController } from 'pages/administracion/sucursales/infraestructure/SucursalController'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { endpoints } from 'config/api'
import { AxiosResponse } from 'axios'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'

export default defineComponent({
  components: {
    TabLayoutFilterTabs2,
    EssentialTable,
    EssentialSelectableTable,
    ModalesEntidad
  },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      Transferencia,
      new TransferenciaController()
    )
    const {
      entidad: transferencia,
      disabled,
      accion,
      listadosAuxiliares
    } = mixin.useReferencias()
    const { setValidador, obtenerListados, cargarVista, listar } =
      mixin.useComportamiento()
    const { onReestablecer, onConsultado } = mixin.useHooks()
    const { confirmar, prompt, notificarCorrecto, notificarError } = useNotificaciones()
    //stores
    const store = useAuthenticationStore()

    //orquestador
    const {
      refListadoSeleccionable: refListado,
      criterioBusqueda: criterioBusquedaProducto,
      listado: listadoProductos,
      listar: listarProductos,
      limpiar: limpiarProducto,
      seleccionar: seleccionarProducto
    } = useOrquestadorSelectorItems(transferencia, 'inventarios')

    const modales = new ComportamientoModalesTransferencia()

    const usuarioLogueado = store.user
    const esBodeguero = store.esBodeguero
    const esCoordinador = store.esCoordinador
    const esActivos = store.esActivosFijos
    const cargando = new StatusEssentialLoading()

    //FLAGS
    const soloLectura = ref(false)
    const tabDefecto = ref('PENDIENTE')
    const autorizaciones = ref([])
    const { empleados, sucursales, filtrarSucursales } =
      useFiltrosListadosSelects(listadosAuxiliares)

    const { clientes, filtrarClientes } =
      useFiltrosListadosSelects(listadosAuxiliares)

    cargarVista(async () => {
      await obtenerListados({
        empleados: {
          controller: new EmpleadoController(),
          params: {
            campos: 'id,nombres,apellidos',
            estado: 1
          }
        },
        clientes: {
          controller: new ClienteController(),
          params: {
            campos: 'id,razon_social',
            requiere_bodega: 1,
            estado: 1
          }
        }
      })
    })

    //HOOKS
    onReestablecer(() => {
      soloLectura.value = false
    })
    onConsultado(() => {
      if (usuarioLogueado.id === transferencia.per_autoriza) {
        soloLectura.value = true
      }

      if (transferencia.solicitante) {
        const opcion_encontrada = listadosAuxiliares.empleados.filter(
          v => v.id === transferencia.solicitante
        )
        if (opcion_encontrada[0]['id'])
          transferencia.solicitante = opcion_encontrada[0]['id']
      }
    })

    //Reglas de validacion
    const reglas = {
      justificacion: { required },
      sucursal_salida: { required },
      sucursal_destino: { required },
      cliente: { requiredIfBodeguero: requiredIf(esBodeguero) },
      autorizacion: {
        requiredIfCoordinador: requiredIf(
          esCoordinador && !store.esBodegueroTelconet
        )
      },
      // estado: { requiredIfBodega: requiredIf(esBodeguero), },
      observacion_aut: {
        requiredIfObsAutorizacion: requiredIf(false)
        // requiredIfObsAutorizacion: requiredIf(function () { return transaccion.tiene_obs_autorizacion })
      },
      observacion_est: {
        requiredIfObsEstado: requiredIf(false)
        // requiredIfObsEstado: requiredIf(function () { return transaccion.tiene_obs_estado })
      },
      listadoProductos: { required } //validar que envien datos en el listado
    }
    const v$ = useVuelidate(reglas, transferencia)
    setValidador(v$.value)

    const validarListadoProductos = new ValidarListadoProductos(transferencia)
    mixin.agregarValidaciones(validarListadoProductos)

    async function filtrarTransferencias(tab: string) {
      tabDefecto.value = tab
      await listar({ estado: tab })
    }

    async function anularTransferencia(id: number) {
      const axios = AxiosHttpRepository.getInstance()
      const ruta = axios.getEndpoint(endpoints.transferencias) + '/anular/' + id
      const response: AxiosResponse = await axios.get(ruta)
      notificarCorrecto(response.data.mensaje)
    }

    function eliminar({ posicion }) {
      confirmar('¿Está seguro de continuar?', () =>
        transferencia.listadoProductos.splice(posicion, 1)
      )
    }

    const botonEliminar: CustomActionTable = {
      titulo: 'Quitar',
      color: 'negative',
      icono: 'bi-x',
      accion: ({ entidad, posicion }) => {
        eliminar({ entidad, posicion })
      },
      visible: () => {
        return (
          accion.value == acciones.nuevo ||
          (esActivos && accion.value == acciones.editar)
        )
      }
    }
    const botonEditarCantidad: CustomActionTable = {
      titulo: 'Cantidad',
      icono: 'bi-pencil',
      accion: ({ posicion }) => {
        const config: CustomActionPrompt = {
          titulo: 'Confirmación',
          mensaje: 'Ingresa la cantidad',
          defecto: transferencia.listadoProductos[posicion].cantidades,
          tipo: 'number',
          accion: data =>
            (transferencia.listadoProductos[posicion].cantidades = data)
        }
        prompt(config)
      },
      visible: () => {
        return (
          accion.value == acciones.nuevo ||
          (esActivos && accion.value == acciones.editar)
        )
      }
    }
    const botonAnular: CustomActionTable<Transferencia> = {
      titulo: 'Anular',
      color: 'red',
      icono: 'bi-x',
      accion: async ({ entidad }) => {
        confirmar(
          '¿Está seguro que desea anular la transferencia? Esta acción es irreversible',
          async () => {
            try {
              cargando.activar()
              await anularTransferencia(entidad.id)
              await filtrarTransferencias('ANULADO')
            } catch (err) {
              notificarError('' + err)
            } finally {
              cargando.desactivar()
            }
          }
        )
      },
      visible: ({ entidad }) => {
        return (
          ['PENDIENTE', 'TRANSITO'].includes(entidad.estado) &&
          (tabDefecto.value === 'PENDIENTE' || tabDefecto.value === 'TRANSITO')
        )
      }
    }

    const configuracionColumnasProductosSeleccionadosAccion = [
      ...configuracionColumnasProductosSeleccionados,
      {
        name: 'cantidad',
        field: 'cantidad',
        label: 'Cantidad',
        align: 'left',
        sortable: false
      },
      {
        name: 'acciones',
        field: 'acciones',
        label: 'Acciones',
        align: 'right',
        sortable: false
      }
    ]

    //configurar los listados
    empleados.value = listadosAuxiliares.empleados
    clientes.value = listadosAuxiliares.clientes
    listadosAuxiliares.sucursales = JSON.parse(
      LocalStorage.getItem('sucursales')!.toString()
    )
    sucursales.value = listadosAuxiliares.sucursales
    autorizaciones.value = JSON.parse(
      LocalStorage.getItem('autorizaciones')!.toString()
    )

    async function recargarSucursales() {
      const sucursales = (
        await new SucursalController().listar({ campos: 'id,lugar' })
      ).result
      LocalStorage.set('sucursales', JSON.stringify(sucursales))
    }

    return {
      mixin,
      transferencia,
      disabled,
      accion,
      v$,
      configuracionColumnas: configuracionColumnasTransferencias,
      acciones,

      //listados
      clientes,
      sucursales,
      empleados,
      autorizaciones,
      opcionesEstadosTransferenciasBodega,

      //variables auxiliares
      soloLectura,
      esBodeguero,
      esActivos,

      //modales
      modales,

      //tabla
      configuracionColumnasProductosSeleccionadosAccion,
      configuracionColumnasProductosSeleccionados,
      configuracionColumnasItemsSeleccionados,

      //botones
      botonEliminar,
      botonEditarCantidad,
      botonAnular,

      //selector
      refListado,
      criterioBusquedaProducto,
      listadoProductos,
      listarProductos,
      limpiarProducto,
      seleccionarProducto,
      configuracionColumnasItems: configuracionColumnasInventarios,

      //tabs y filtros
      tabDefecto,
      tabOptionsTransferencias,
      puedeEditar: computed(
        () => esActivos && tabDefecto.value === 'PENDIENTE'
      ),

      filtrarTransferencias,
      filtrarSucursales,
      recargarSucursales,
      filtrarClientes,
      ordenarLista
    }
  }
})
