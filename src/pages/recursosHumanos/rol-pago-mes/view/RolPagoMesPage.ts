// Dependencias
import {AxiosError, AxiosResponse} from 'axios'
import { configuracionColumnasRolPago } from '../../rol-pago/domain/configuracionColumnasRolPago'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { computed, defineComponent, reactive, ref } from 'vue'

// Componentes
import SelectorImagen from 'components/SelectorImagen.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'
import EssentialTableTabs from 'components/tables/view/EssentialTableTabs.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { RolPagoController } from '../../rol-pago/infraestructure/RolPagoController'
import { RolPago } from '../../rol-pago/domain/RolPago'
import { imprimirArchivo } from 'shared/utils'
import { acciones, accionesTabla, estadosRolPago } from 'config/utils'
import { useAuthenticationStore } from 'stores/authentication'
import { useCargandoStore } from 'stores/cargando'
import { useQuasar } from 'quasar'
import { RolPagoMes } from '../domain/RolPagoMes'
import { RolPagoMesController } from '../infrestucture/RolPagoMesController'
import { ComportamientoModalesRolPagoMes } from '../aplication/ComportamientoModalesRolPagoMes'
import { ComportamientoModalesRolPago } from 'pages/recursosHumanos/rol-pago/aplication/ComportamientoModalesRolPago'
import {
  estadosRolPagoEmpleado,
  tabOptionsEstadosRolPago,
  tabOptionsEstadosRolPagoEmpleado
} from 'config/recursosHumanos.utils'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useBotonesTablaRolPagoMes } from '../aplication/BotonesTablaRolPagoMes'
import { useRolPagoStore } from 'stores/rolPago'
import { useNotificaciones } from 'shared/notificaciones'
import { configuracionColumnasRolPagoMes } from '../domain/configuracionColumnasRolPagoMes'
import { useBotonesTablaRolPago } from 'pages/recursosHumanos/rol-pago/aplication/BotonesTablaRolPago'
import { CambiarEstadoRolPago } from 'pages/recursosHumanos/rol-pago/aplication/CambiarEstadoRolPago'
import { useBotonesImpresionTablaRolPago } from 'pages/recursosHumanos/rol-pago/aplication/BotonesImpresionRolPago'
import { apiConfig, endpoints } from 'config/api'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import GestorDocumentos from 'components/documentos/view/GestorDocumentos.vue'
import { useNotificacionStore } from 'stores/notificacion'

export default defineComponent({
  name: 'RolPagoMes',
  components: {
    TabLayoutFilterTabs2,
    ModalesEntidad,
    SelectorImagen,
    EssentialTable,
    EssentialTableTabs,
    GestorDocumentos
  },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      RolPagoMes,
      new RolPagoMesController()
    )
    const {
      entidad: rolpago,
      accion,
      disabled,
      listadosAuxiliares
    } = mixin.useReferencias()
    const { setValidador, listar } = mixin.useComportamiento()
    const mixinRolEmpleado = new ContenedorSimpleMixin(
      RolPago,
      new RolPagoController()
    )

    const { listado: roles_empleados } = mixinRolEmpleado.useReferencias()
    const { listar: listarRolEmpleado, eliminar } =
      mixinRolEmpleado.useComportamiento()
    const authenticationStore = useAuthenticationStore()

    const cargando = new StatusEssentialLoading()
    const refArchivoRolPago = ref()

    /**********
     * Modales
     **********/
    const modalesRolPagoMes = new ComportamientoModalesRolPagoMes()
    const modalesRolPago = new ComportamientoModalesRolPago()

    const { onConsultado } = mixin.useHooks()
    useCargandoStore().setQuasar(useQuasar())
    useNotificacionStore().setQuasar(useQuasar())
    const { notificarAdvertencia, notificarCorrecto, notificarError, confirmar, promptItems } =
      useNotificaciones()

    const { btnFinalizarRolPago, btnActivarRolPago } =
      useBotonesTablaRolPagoMes(mixin)
    const { btnIniciar, btnFinalizar } = useBotonesTablaRolPago(
      roles_empleados,
      modalesRolPago,
      listadosAuxiliares
    )
    const { btnImprimir, btnGenerarReporte } =
      useBotonesImpresionTablaRolPago(rolpago)
    const rolPagoStore = useRolPagoStore()
    const tabActual = ref()
    const lista_tipo_reporte = [
      { id: 'pdf', name: 'PDF' },
      { id: 'xlsx', name: 'EXCEL' }
    ]
    const btnActualizarEmpleadosRol: CustomActionTable = {
      titulo: 'Agregar empleados',
      icono: 'bi-arrow-clockwise',
      color: 'primary',
      tooltip: 'Agrega los empleados recientemente registrados en el sistema',
      accion: () => {
        agregarNuevosEmpleadosRol(rolpago.id!)
      },
      visible: () => authenticationStore.can('puede.ver.btn.agregar_empleados')
    }
    const btnAgregarRolPagoEmpleado: CustomActionTable = {
      titulo: 'Agregar empleado al rol',
      icono: 'bi-plus',
      color: 'positive',
      accion: () => {
        if (!rolpago.id)
          return notificarAdvertencia('Primero debe seleccionar una tarea.')
        if (rolpago.finalizado)
          return notificarAdvertencia(
            'No puede agregar más subtareas porque la tarea ha finalizado.'
          )
        rolPagoStore.idRolPagoMes = rolpago.id
        rolPagoStore.mes = rolpago.mes
        rolPagoStore.es_quincena = rolpago.es_quincena
        rolPagoStore.accion = acciones.nuevo
        rolPagoStore.idRolPagoSeleccionada = null
        modalesRolPago.abrirModalEntidad('RolPagoPage')
      },
      visible: () =>
        authenticationStore.can('puede.ver.btn.agregar_empleado_rol')
    }
    const btnEjecutarMasivo: CustomActionTable = {
      titulo: 'Ejecutar Rol de Pago',
      icono: 'bi-play-fill',
      color: 'positive',
      accion: () => {
        if (!rolpago.id)
          return notificarAdvertencia('Primero debe seleccionar una rol.')
        confirmar('¿Está seguro de iniciar cambios rol de pago?', async () => {
          const data = {
            rol_pago_id: rolpago.id
          }
          await new CambiarEstadoRolPago().ejecutarMasivo(data)
          notificarCorrecto('Rol de Pagos se esta Verificando!')
          await filtrarRolPagoEmpleado(estadosRolPagoEmpleado.ejecutando)
        })
      },
      visible: () => authenticationStore.can('puede.ver.btn.ejecutar_rol_pago')
    }
    const btnFinalizarMasivo: CustomActionTable = {
      titulo: 'Finalizar Rol de Pago',
      icono: 'bi-check',
      color: 'positive',
      visible: () =>
        !rolpago.finalizado &&
        authenticationStore.can('puede.ver.btn.finalizar_rol_pago'),
      accion: () => {
        if (!rolpago.id)
          return notificarAdvertencia('Primero debe seleccionar una rol.')
        confirmar('¿Está seguro de finalizar rol de pago?', async () => {
          const data = {
            rol_pago_id: rolpago.id
          }
          await new CambiarEstadoRolPago().finalizarMasivo(data)
          notificarCorrecto('Rol de Pagos Finalizado!')
          await filtrarRolPagoEmpleado(estadosRolPagoEmpleado.finalizado)
        })
      }
    }

    const btnConsultarRolPagoEmpleado: CustomActionTable = {
      titulo: 'Consultar',
      icono: 'bi-eye',
      accion: ({ entidad }) => {
        rolPagoStore.idRolPagoSeleccionada = entidad.id
        rolPagoStore.accion = acciones.consultar
        modalesRolPago.abrirModalEntidad('RolPagoPage')
      }
    }

    const btnEditarRolPagoEmpleado: CustomActionTable = {
      titulo: 'Editar',
      icono: 'bi-pencil',
      color: 'warning',
      visible: ({ entidad }) => {
        return (
          entidad.estado === estadosRolPago.EJECUTANDO &&
          authenticationStore.can('puede.editar.rol_pago')
        )
      },
      accion: ({ entidad }) => {
        console.log(entidad)
        rolPagoStore.idEmpleado = entidad.empleado
        rolPagoStore.idRolPagoSeleccionada = entidad.id
        rolPagoStore.idRolPagoMes = entidad.id
        rolPagoStore.accion = acciones.editar
        // rolPagoStore.recalcularSueldo = entidad.salario * .4 == entidad.sueldo
        modalesRolPago.abrirModalEntidad('RolPagoPage')
      }
    }

    function obtenerNombreMes() {
      const meses = [
        'Enero',
        'Febrero',
        'Marzo',
        'Abril',
        'Mayo',
        'Junio',
        'Julio',
        'Agosto',
        'Septiembre',
        'Octubre',
        'Noviembre',
        'Diciembre'
      ]
      const [mes, anio] = rolpago.mes!.split('-')
      rolpago.nombre = `Rol de Pagos de${
        rolpago.es_quincena ? ' QUINCENA DEL MES DE ' : ''
      }  ${meses[parseInt(mes, 10) - 1]} de ${anio}`
    }

    let tabActualRolPago = '0'

    function filtrarRolPagoMes(tabSeleccionado: string) {
      listar({ finalizado: tabSeleccionado }, false)
      tabActualRolPago = tabSeleccionado
    }

    async function filtrarRolPagoEmpleado(estado, mensaje = null) {
      await listarRolEmpleado({ rol_pago_id: rolpago.id, estado: estado }).then(
        () => {
          if (mensaje != null) {
            notificarCorrecto(mensaje)
          }
        }
      )
      tabActual.value = estado
    }

    const is_month = ref(false)
    const tab = ref('rol_pago')

    onConsultado(() => filtrarRolPagoEmpleado(''))
    const reglas = {
      mes: { required },
      nombre: { required }
    }
    const v$ = useVuelidate(reglas, rolpago)
    setValidador(v$.value)

    async function guardado(data) {
      console.log(data)
      await filtrarRolPagoEmpleado(estadosRolPagoEmpleado.ejecutando)
    }

    /**Verifica si es un mes */
    function checkValue(val, reason, details) {
      console.log(val, reason, details)
      is_month.value = reason !== 'month'
      obtenerNombreMes()
    }

    // const editarRolPago: CustomActionTable = {
    //   titulo: 'Editar',
    //   icono: 'bi-pencil-square',
    //   color: 'secondary',
    //   visible: ({ entidad }) =>
    //     authenticationStore.can('puede.editar.rol_pago') && !entidad.finalizado,
    //   accion: ({ entidad }) => {
    //     accion.value = 'EDITAR'
    //     consultar(entidad)
    //   },
    // }
    const btnEnviarRolPagoEmpleado: CustomActionTable = {
      titulo: 'Enviar Rol de Pago Individual',
      icono: 'bi-envelope-fill',
      color: 'secondary',
      accion: async ({ entidad }) => {
        await enviar_rol_pago_empleado(entidad)
      },
      visible: ({ entidad }) =>
        authenticationStore.can('puede.ver.campo.enviar_rol_pago') &&
        !entidad.es_quincena
    }
    const btnEliminarRolPago: CustomActionTable = {
      titulo: 'Eliminar',
      icono: 'bi-trash',
      color: 'secondary',
      visible: ({ entidad }) =>
        authenticationStore.can('puede.eliminar.rol_pago') &&
        !entidad.finalizado,
      accion: ({ entidad }) => {
        accion.value = 'ELIMINAR'
        eliminar(entidad)
      }
    }
    const btnImprimirRolPago: CustomActionTable = {
      titulo: 'Reporte General',
      icono: 'bi-printer',
      color: 'primary',
      visible: ({ entidad }) =>
        authenticationStore.can('puede.ver.rol_pago') && !entidad.es_quincena,
      accion: ({ entidad }) => {
        // generar_reporte_general_mes(entidad.id,'pdf')

        const config: CustomActionPrompt = reactive({
          mensaje: 'Confirme el tipo de reporte',
          accion: tipo => {
            generar_reporte_general_mes(entidad.id, tipo)
          },
          requerido: false,
          defecto: 'EXCEL',
          tipo: 'radio',
          items: lista_tipo_reporte.map(tipo => {
            return {
              label: tipo.name,
              value: tipo.id
            }
          })
        })
        promptItems(config)
      }
    }

    const btnEnviarRolPago: CustomActionTable = {
      titulo: 'Enviar Rol de Pagos',
      icono: 'bi-envelope-fill',
      color: 'primary',
      visible: ({ entidad }) =>
        authenticationStore.can('puede.ver.campo.enviar_rol_pago') &&
        !entidad.es_quincena,
      accion: async ({ entidad }) => {
        await enviar_rol_pago(entidad)
      }
    }
    const btnCashRolPago: CustomActionTable = {
      titulo: 'Cash Rol de Pagos',
      icono: 'bi-cash-stack',
      color: 'primary',
      visible: () => authenticationStore.can('puede.ver.campo.cash'),
      accion: ({ entidad }) => {
        cash_rol_pago(entidad)
      }
    }

    /**
     * Enviar rol de pago individual a un empleado
     * @param entidad
     */
    async function enviar_rol_pago_empleado(entidad): Promise<void> {
      try {
        cargando.activar()
        const axios = AxiosHttpRepository.getInstance()
        const url_pdf =
          apiConfig.URL_BASE +
          '/' +
          axios.getEndpoint(endpoints.enviar_rol_pago_empleado) +
          entidad.id
        const response: AxiosResponse = await axios.get(url_pdf)
        console.log(response)
        if (response.status === 200) notificarCorrecto(response.data.mensaje)
        else notificarAdvertencia(response.data.mensaje)
      } catch (e: any) {
        notificarError(e.response.data.message||'Ha ocurrido un error al enviar el mail')
      } finally {
        cargando.desactivar()
      }
    }

    /**
     * Enviar correos con roles de pagos masivos, a todos los empleados del rol actual
     * @param entidad
     */
    async function enviar_rol_pago(entidad): Promise<void> {
      try {
        cargando.activar()
        const axios = AxiosHttpRepository.getInstance()
        const url_pdf =
          apiConfig.URL_BASE +
          '/' +
          axios.getEndpoint(endpoints.enviar_rol_pago) +
          entidad.id
        const response: AxiosResponse = await axios.get(url_pdf)
        if (response.status === 200) {
          // notificarCorrecto('Roles de Pagos enviado correctamente!')
          notificarCorrecto(response.data.mensaje)
          notificarAdvertencia(response.data.correos)
          // console.log(response.data)
        } else notificarAdvertencia(response.data.mensaje)
      } catch (e) {
        console.error(e)
      } finally {
        cargando.desactivar()
      }
    }

    async function cash_rol_pago(entidad): Promise<void> {
      const filename = 'cash_rol_pago'
      const axios_repository = AxiosHttpRepository.getInstance()
      const url_pdf =
        apiConfig.URL_BASE +
        '/' +
        axios_repository.getEndpoint(endpoints.crear_cash_roles_pago) +
        entidad.id
      await imprimirArchivo(url_pdf, 'GET', 'blob', 'xlsx', filename, null)
    }

    async function generar_reporte_general_mes(
      id: number,
      tipo: string
    ): Promise<void> {
      const axios = AxiosHttpRepository.getInstance()
      const filename = 'rol_pago'
      const url_pdf =
        apiConfig.URL_BASE +
        '/' +
        axios.getEndpoint(endpoints.imprimir_reporte_general) +
        id +
        '?tipo=' +
        tipo

      await imprimirArchivo(url_pdf, 'GET', 'blob', tipo, filename, null)
    }

    const btnRefrescar: CustomActionTable = {
      titulo: 'Actualizar Rol de Pago',
      icono: 'bi-arrow-clockwise',
      color: 'warning',
      accion: async () => {
        const id = rolpago.id != null ? rolpago.id : 0
        await actualizarRolPago(id)
      },
      visible: () =>
        authenticationStore.can('puede.ver.btn.actualizar_rol_pago')
    }

    async function actualizarRolPago(idRolPago: number) {
      try {
        cargando.activar()
        const axios = AxiosHttpRepository.getInstance()
        const ruta =
          axios.getEndpoint(endpoints.actualizar_rol_pago) + idRolPago
        const response: AxiosResponse = await axios.get(ruta)
        await filtrarRolPagoEmpleado('', response.data.mensaje)
      } catch (error) {
        notificarAdvertencia(error + '')
      } finally {
        cargando.desactivar()
      }
    }

    async function agregarNuevosEmpleadosRol(idRolPago: number) {
      try {
        cargando.activar()
        const axios = AxiosHttpRepository.getInstance()
        const ruta =
          axios.getEndpoint(endpoints.agregar_nuevos_empleados) + idRolPago
        const response: AxiosResponse = await axios.get(ruta)
        await filtrarRolPagoEmpleado(
          estadosRolPagoEmpleado.ejecutando,
          response.data.mensaje
        )
      } catch (error) {
        notificarAdvertencia(error + '')
      } finally {
        cargando.desactivar()
      }
    }

    const enviar_masivo = computed(
      () => refArchivoRolPago.value?.quiero_subir_archivos
    )

    return {
      mixin,
      rolpago,
      accion,
      acciones,
      is_month,
      tab,
      btnIniciar,
      btnImprimir,
      btnConsultarRolPagoEmpleado,
      btnAgregarRolPagoEmpleado,
      btnGenerarReporte,
      btnEjecutarMasivo,
      roles_empleados,
      checkValue,
      modalesRolPagoMes,
      modalesRolPago,
      guardado,
      v$,
      filtrarRolPagoMes,
      filtrarRolPagoEmpleado,
      obtenerNombreMes,
      disabled,
      btnEnviarRolPago,
      // configuracionColumnasRolPago,
      columnasRolPagoEmpleados: [
        ...configuracionColumnasRolPago,
        accionesTabla
      ],
      indicatorColor: computed(() =>
        rolpago.tiene_empleados ? 'primary' : 'white'
      ),
      tabOptionsEstadosRolPagoEmpleado,
      tabOptionsEstadosRolPago,
      tabActual,
      btnFinalizarRolPago,
      btnActivarRolPago,
      btnFinalizarMasivo,
      btnFinalizar,
      btnEliminarRolPago,
      btnEditarRolPagoEmpleado,
      btnImprimirRolPago,
      btnEnviarRolPagoEmpleado,
      btnCashRolPago,
      btnRefrescar,
      btnActualizarEmpleadosRol,
      enviar_masivo,
      configuracionColumnas: configuracionColumnasRolPagoMes,
      tabActualRolPago
    }
  }
})
