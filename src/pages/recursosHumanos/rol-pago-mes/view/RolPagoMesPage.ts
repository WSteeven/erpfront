// Dependencias
import { configuracionColumnasRolPago } from '../../rol-pago/domain/configuracionColumnasRolPago'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, ref, computed, Ref, reactive } from 'vue'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import SelectorImagen from 'components/SelectorImagen.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { RolPagoController } from '../../rol-pago/infraestructure/RolPagoController'
import { RolPago } from '../../rol-pago/domain/RolPago'
import { imprimirArchivo, removeAccents } from 'shared/utils'
import { acciones, accionesTabla, estadosRolPago } from 'config/utils'
import { configuracionColumnasRolPagoTabla } from '../../rol-pago/domain/configuracionColumnasRolPagoTabla'
import { ConceptoIngreso } from 'pages/recursosHumanos/concepto_ingreso/domain/ConceptoIngreso'
import { useAuthenticationStore } from 'stores/authentication'
import { useCargandoStore } from 'stores/cargando'
import { useQuasar } from 'quasar'
import { RolPagoMes } from '../domain/RolPagoMes'
import axios from 'axios'
import { RolPagoMesController } from '../infrestucture/RolPagoMesController'
import { ComportamientoModalesRolPagoMes } from '../aplication/ComportamientoModalesRolPagoMes'
import { ComportamientoModalesRolPago } from 'pages/recursosHumanos/rol-pago/aplication/ComportamientoModalesRolPago'
import { RolPagoMesModales } from '../domain/RolPagoMesModales'
import {
  tabOptionsEstadosRolPago,
  tabOptionsEstadosRolPagoEmpleado,
} from 'config/recursosHumanos.utils'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useBotonesTablaRolPagoMes } from '../aplication/BotonesTablaRolPagoMes'
import { useRolPagoStore } from 'stores/rolPago'
import { useNotificaciones } from 'shared/notificaciones'
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import { configuracionColumnasRolPagoMes } from '../domain/configuracionColumnasRolPagoMes'
import EssentialTableTabs from 'components/tables/view/EssentialTableTabs.vue'
import { useBotonesTablaRolPago } from 'pages/recursosHumanos/rol-pago/aplication/BotonesTablaRolPago'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'
import { log } from 'console'
import { CambiarEstadoRolPago } from 'pages/recursosHumanos/rol-pago/aplication/CambiarEstadoRolPago'
import { useBotonesImpresionTablaRolPago } from 'pages/recursosHumanos/rol-pago/aplication/BotonesImpresionRolPago'
import { apiConfig, endpoints } from 'config/api'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { HttpResponseGet } from 'shared/http/domain/HttpResponse'
import { DescuentosGenralesController } from 'pages/recursosHumanos/descuentos_generales/infraestructure/DescuentosGenralesController'
import { DescuentosLeyController } from 'pages/recursosHumanos/descuentos_ley/infraestructure/DescuentosLeyController'
import { MultaController } from 'pages/recursosHumanos/multas/infraestructure/MultaController'
import { ConceptoIngresoController } from 'pages/recursosHumanos/concepto_ingreso/infraestructure/ConceptoIngresoController'

export default defineComponent({
  components: {
    TabLayoutFilterTabs2,
    ModalesEntidad,
    SelectorImagen,
    EssentialTable,
    EssentialTableTabs,
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
      listadosAuxiliares,
    } = mixin.useReferencias()
    const { consultar, setValidador, listar,obtenerListados,cargarVista } = mixin.useComportamiento()
    const mixinRolEmpleado = new ContenedorSimpleMixin(
      RolPago,
      new RolPagoController()
    )
    const { listado: roles_empleados } = mixinRolEmpleado.useReferencias()
    const { listar: listarRolEmpleado,eliminar } = mixinRolEmpleado.useComportamiento()
    const authenticationStore = useAuthenticationStore()

    /**********
     * Modales
     **********/
    const modalesRolPagoMes = new ComportamientoModalesRolPagoMes()
    const modalesRolPago = new ComportamientoModalesRolPago()

    const { onConsultado } = mixin.useHooks()
    useCargandoStore().setQuasar(useQuasar())
    const { notificarAdvertencia, notificarCorrecto, confirmar, promptItems } =
      useNotificaciones()

    const { btnFinalizarRolPago } = useBotonesTablaRolPagoMes(mixin)
    const { btnIniciar, btnFirmar, btnRealizado, btnFinalizar } =
      useBotonesTablaRolPago(
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
      { id: 'xlsx', name: 'EXCEL' },
    ]
    const btnAgregarRolPagoEmpleado: CustomActionTable = {
      titulo: 'Agregar rol pago empleado',
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
        rolPagoStore.accion = acciones.nuevo
        rolPagoStore.idRolPagoSeleccionada = null
        modalesRolPago.abrirModalEntidad('RolPagoPage')
      },
    }
    const btnEjecutarMasivo: CustomActionTable = {
      titulo: 'Ejecutar Rol de Pago',
      icono: 'bi-play-fill',
      color: 'positive',
      accion: () => {
        console.log(rolpago)

        if (!rolpago.id)
          return notificarAdvertencia('Primero debe seleccionar una rol.')
        confirmar('¿Está seguro de iniciar cambios rol de pago?', async () => {
          const data = {
            rol_pago_id: rolpago.id,
          }
          await new CambiarEstadoRolPago().ejecutarMasivo(data)
          notificarCorrecto('Rol de Pagos se esta Verificando!')
          filtrarRolPagoEmpleado('EJECUTANDO')
        })
      },
    }
    const btnFinalizarMasivo: CustomActionTable = {
      titulo: 'Finalizar Rol de Pago',
      icono: 'bi-check',
      color: 'positive',
      visible: () => rolpago.es_quincena == true,
      accion: () => {
        if (!rolpago.id)
          return notificarAdvertencia('Primero debe seleccionar una rol.')
        confirmar('¿Está seguro de finalizar rol de pago?', async () => {
          const data = {
            rol_pago_id: rolpago.id,
          }
          await new CambiarEstadoRolPago().finalizarMasivo(data)
          notificarCorrecto('Rol de Pagos Finalizado!')
          filtrarRolPagoEmpleado('FINALIZADO')
        })
      },
    }

    const btnConsultarRolPagoEmpleado: CustomActionTable = {
      titulo: 'Consultar',
      icono: 'bi-eye',
      accion: ({ entidad }) => {
        rolPagoStore.idRolPagoSeleccionada = entidad.id
        rolPagoStore.accion = acciones.consultar
        modalesRolPago.abrirModalEntidad('RolPagoPage')
      },
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
        rolPagoStore.idRolPagoSeleccionada = entidad.id
        rolPagoStore.idRolPagoMes = entidad.id
        rolPagoStore.accion = acciones.editar
        modalesRolPago.abrirModalEntidad('RolPagoPage')
      },
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
        'Diciembre',
      ]
      const [mes, anio] = rolpago.mes!.split('-')
      rolpago.nombre = `Rol de Pagos de ${
        rolpago.es_quincena ? 'QUINCENA DEL MES DE ' : ''
      }  ${meses[parseInt(mes, 10) - 1]} de ${anio}`
    }
    let tabActualRolPago = '0'
    function filtrarRolPagoMes(tabSeleccionado: string) {
      listar({ finalizado: tabSeleccionado }, false)
      tabActualRolPago = tabSeleccionado
    }
    function filtrarRolPagoEmpleado(estado) {
      listarRolEmpleado({ rol_pago_id: rolpago.id, estado: estado })
      tabActual.value = estado
    }

    const concepto_ingresos: Ref<ConceptoIngreso[]> = ref([])
    const es_consultado = ref(false)
    const tipo = ref(1)
    const es_calculable = ref(true)
    const campo = ref()
    const is_month = ref(false)
    const tab = ref('rol_pago')

    onConsultado(() => filtrarRolPagoEmpleado(''))

    //Reglas de validacion
    const reglas = {
      mes: { required },
      nombre: { required },
    }
    const v$ = useVuelidate(reglas, rolpago)
    setValidador(v$.value)
    async function guardado(paginaModal: keyof RolPagoMesModales) {
      switch (paginaModal) {
        case 'RolPagoMesPage':
          const { result } = await new RolPagoMesController().listar()
          listadosAuxiliares.rolpago = result
          roles_empleados.value = result
          break
        case 'RolPagoPage':
          break
      }
      modalesRolPagoMes.cerrarModalEntidad()
    }

    /**Verifica si es un mes */
    function checkValue(reason) {
      is_month.value = reason === 'month' ? false : true
      obtenerNombreMes()
    }

    const editarRolPago: CustomActionTable = {
      titulo: 'Editar',
      icono: 'bi-pencil-square',
      color: 'secondary',
      visible: ({ entidad }) =>
        authenticationStore.can('puede.editar.rol_pago') && !entidad.finalizado,
      accion: ({ entidad }) => {
        accion.value = 'EDITAR'
        consultar(entidad)
      },
    }
    const btnEnviarRolPagoEmpleado: CustomActionTable = {
      titulo: 'Enviar Rol Pago',
      icono: 'bi-envelope-fill',
      color: 'secondary',
      visible: ({ entidad }) =>
      authenticationStore.can('puede.ver.campo.enviar_rol_pago') && !entidad.es_quincena,
      accion: ({ entidad }) => {
        enviar_rol_pago_empleado(entidad)
      },
    }
    const btnEliminarRolPago: CustomActionTable = {
      titulo: 'Eliminar',
      icono: 'bi-trash',
      color: 'secondary',
      visible: ({ entidad }) =>
        authenticationStore.can('puede.eliminar.rol_pago') && !entidad.finalizado,
      accion: ({ entidad }) => {
        accion.value = 'ELIMINAR'
        eliminar(entidad)
      },
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
          accion: (tipo) => {
            generar_reporte_general_mes(entidad.id, tipo)
          },
          requerido: false,
          defecto: 'EXCEL',
          tipo: 'radio',
          items: lista_tipo_reporte.map((tipo) => {
            return {
              label: tipo.name,
              value: tipo.id,
            }
          }),
        })
        promptItems(config)
      },
    }

    const btnEnviarRolPago: CustomActionTable = {
      titulo: 'Enviar Rol de Pagos',
      icono: 'bi-envelope-fill',
      color: 'primary',
      visible: ({ entidad }) =>
      authenticationStore.can('puede.ver.campo.enviar_rol_pago') && !entidad.es_quincena,
      accion: ({ entidad }) => {
        enviar_rol_pago(entidad)
      },
    }
    const btnCashRolPago: CustomActionTable = {
      titulo: 'Cash Rol de Pagos',
      icono: 'bi-cash-stack',
      color: 'primary',
      visible: () =>
        authenticationStore.can('puede.ver.campo.cash') ,
      accion: ({ entidad }) => {
        cash_rol_pago(entidad)
      },
    }
    async function enviar_rol_pago_empleado(entidad): Promise<void> {
      const axios_repository = AxiosHttpRepository.getInstance()
      const url_pdf =
        apiConfig.URL_BASE +
        '/' +
        axios_repository.getEndpoint(endpoints.enviar_rol_pago_empleado)+entidad.id
      axios({
        url: url_pdf,
        method: 'GET',
        responseType: 'json',
        headers: {
          Authorization: axios_repository.getOptions().headers.Authorization,
        },
      }).then((response: HttpResponseGet) => {
        const { data } = response
        if (data) {
          notificarCorrecto('Rol de Pagos enviado correctamente!')
          console.log(data)
        }
      })
    }
    async function enviar_rol_pago(entidad): Promise<void> {
      const axios_repository = AxiosHttpRepository.getInstance()
      const url_pdf =
        apiConfig.URL_BASE +
        '/' +
        axios_repository.getEndpoint(endpoints.enviar_rol_pago)+entidad.id
      axios({
        url: url_pdf,
        method: 'GET',
        responseType: 'json',
        headers: {
          Authorization: axios_repository.getOptions().headers.Authorization,
        },
      }).then((response: HttpResponseGet) => {
        const { data } = response
        if (data) {
          notificarCorrecto('Roles de Pagos enviado correctamente!')
          console.log(data)
        }
      })
    }
    async function cash_rol_pago(entidad): Promise<void> {
      const filename = 'cash_rol_pago'
      const axios_repository = AxiosHttpRepository.getInstance()
      const url_pdf =
        apiConfig.URL_BASE +
        '/' +
        axios_repository.getEndpoint(endpoints.crear_cash_roles_pago)+entidad.id
        imprimirArchivo(url_pdf, 'GET', 'blob', 'xlsx', filename, null)
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

      imprimirArchivo(url_pdf, 'GET', 'blob', tipo, filename, null)
    }
    return {
      removeAccents,
      mixin,
      rolpago,
      accion,
      concepto_ingresos,
      campo,
      is_month,
      tipo,
      tab,
      es_consultado,
      btnIniciar,
      btnFirmar,
      btnImprimir,
      btnRealizado,
      btnConsultarRolPagoEmpleado,
      btnAgregarRolPagoEmpleado,
      btnGenerarReporte,
      btnEjecutarMasivo,
      roles_empleados,
      checkValue,
      modalesRolPagoMes,
      modalesRolPago,
      guardado,
      editarRolPago,
      es_calculable,
      v$,
      filtrarRolPagoMes,
      filtrarRolPagoEmpleado,
      obtenerNombreMes,
      disabled,
      btnEnviarRolPago,
      configuracionColumnasRolPago,
      columnasRolPagoEmpleados: [
        ...configuracionColumnasRolPago,
        accionesTabla,
      ],
      indicatorColor: computed(() =>
        rolpago.tiene_empleados ? 'primary' : 'white'
      ),
      tabOptionsEstadosRolPagoEmpleado,
      tabOptionsEstadosRolPago,
      tabActual,
      btnFinalizarRolPago,
      btnFinalizarMasivo,
      btnFinalizar,
      btnEliminarRolPago,
      btnEditarRolPagoEmpleado,
      btnImprimirRolPago,
      btnEnviarRolPagoEmpleado,
      btnCashRolPago,
      configuracionColumnas: configuracionColumnasRolPagoMes,
      accionesTabla,
    }
  },
})
