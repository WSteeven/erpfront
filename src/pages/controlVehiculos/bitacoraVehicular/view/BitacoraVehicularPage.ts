//Dependencias
import { configuracionColumnasBitacoraVehicular } from '../domain/configuracionColumnasBitacoraVehicular'
import { configuracionColumnasActividadesRealizadas } from '../domain/configuracionColumnasActividadesRealizadas'
import { minValue, required, requiredIf } from 'shared/i18n-validators'
import { computed, defineComponent, ref } from 'vue'
import { useVuelidate } from '@vuelidate/core'

// componentes
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import SelectorImagen from 'components/SelectorImagen.vue'
import EssentialPopupEditableTable from 'components/tables/view/EssentialPopupEditableTable.vue'
import TanqueoPage from 'vehiculos/tanqueoCombustible/view/TanqueoPage.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { BitacoraVehicular } from '../domain/BitacoraVehicular'
import { BitacoraVehicularController } from '../infraestructure/BitacoraVehicularController'
import {
  acciones,
  accionesTabla,
  convertir_fecha,
  maskFecha
} from 'config/utils'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { useAuthenticationStore } from 'stores/authentication'
import { AsignacionVehiculoController } from 'pages/controlVehiculos/asignarVehiculos/infraestructure/AsignacionVehiculoController'
import {
  encontrarUltimoIdListado,
  imprimirArchivo,
  notificarErrores,
  obtenerFechaActual
} from 'shared/utils'
import { useNotificaciones } from 'shared/notificaciones'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { TareaController } from 'pages/gestionTrabajos/tareas/infraestructure/TareaController'
import { TicketController } from 'pages/gestionTickets/tickets/infraestructure/TicketController'
import { format } from '@formkit/tempo'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import {
  optionsDefault,
  optionsEstados,
  optionsEstadosCualitativos,
  optionsEstadosExtintor,
  tabOptionsBitacoras
} from 'config/vehiculos.utils'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { apiConfig, endpoints } from 'config/api'
import { AxiosResponse } from 'axios'
import { useQuasar } from 'quasar'
import { useCargandoStore } from 'stores/cargando'
import { useNotificacionStore } from 'stores/notificacion'
import { UltimaBitacoraController } from '../infraestructure/UltimaBitacoraController'
import { TransferenciaVehiculoController } from 'pages/controlVehiculos/transferenciaVehiculos/infraestructure/TransferenciaVehiculoController'
import { ChecklistAccesoriosVehiculo } from '../modules/checklistAccesoriosVehiculo/domain/ChecklistAccesoriosVehiculo'
import { ChecklistImagenVehiculo } from '../modules/checklistImagenVehiculo/domain/ChecklistImagenVehiculo'
import { ChecklistVehiculo } from '../modules/checklistVehiculo/domain/ChecklistVehiculo'
import { VehiculoController } from 'pages/controlVehiculos/vehiculos/infraestructure/VehiculoController'
import { Vehiculo } from 'pages/controlVehiculos/vehiculos/domain/Vehiculo'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import { configuracionColumnasTanqueos } from 'vehiculos/bitacoraVehicular/domain/configuracionColumnasTanqueos'
import { ComportamientoModalesBitacoraVehicular } from 'vehiculos/bitacoraVehicular/application/ComportamientoModalesBitacoraVehicular'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'
import ErrorComponent from 'components/ErrorComponent.vue'
import NoOptionComponent from 'components/NoOptionComponent.vue'
import { TanqueoController } from 'vehiculos/tanqueoCombustible/infraestructure/TanqueoController'

export default defineComponent({
  // name:'ControlDiarioVehiculo',
  components: {
    NoOptionComponent,
    ErrorComponent,
    EssentialTable,
    TabLayoutFilterTabs2,
    SelectorImagen,
    EssentialPopupEditableTable,
    TanqueoPage,
    ModalesEntidad
  },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      BitacoraVehicular,
      new BitacoraVehicularController()
    )
    const {
      entidad: bitacora,
      disabled,
      listadosAuxiliares,
      accion
    } = mixin.useReferencias()
    const { setValidador, cargarVista, obtenerListados, reestablecer, listar } =
      mixin.useComportamiento()
    const { onReestablecer, onConsultado, onBeforeModificar, onModificado } =
      mixin.useHooks()
    const { confirmar, notificarCorrecto, notificarAdvertencia } =
      useNotificaciones()
    const modales = new ComportamientoModalesBitacoraVehicular()
    /****************************************
     * Stores
     ****************************************/
    useNotificacionStore().setQuasar(useQuasar())
    useCargandoStore().setQuasar(useQuasar())
    const store = useAuthenticationStore()
    const cargando = new StatusEssentialLoading()

    const {
      vehiculos,
      filtrarVehiculos,
      empleados: choferes,
      filtrarEmpleados: filtrarChoferes,
      tareas,
      filtrarTareas,
      tickets,
      filtrarTickets
    } = useFiltrosListadosSelects(listadosAuxiliares)
    const usuarioDefault = ref()
    const bitacoraDefault = ref()
    const puedeEditar = ref(false)
    const bloquear_km_tanque = ref(false)
    const tabDefecto = ref('0')
    const axios = AxiosHttpRepository.getInstance()

    cargarVista(async () => {
      usuarioDefault.value = await obtenerVehiculoAsignado()
      cargarDatosDefecto()
      //cargar datos por defecto
      bitacoraDefault.value = await obtenerUltimaBitacora()
      cargarDatosBitacoraDefecto()
      await obtenerListados({
        vehiculos: new VehiculoController()
      })
      vehiculos.value = listadosAuxiliares.vehiculos
    })

    /****************************************
     * HOOKS
     ****************************************/
    //Estos metodos funcionan si no se usa el keep alive
    onReestablecer(async () => {
      cargarDatosDefecto()
      bitacoraDefault.value = await obtenerUltimaBitacora()
      cargarDatosBitacoraDefecto()
    })
    onConsultado(async () => {
      if (accion.value == acciones.editar) {
        if (bitacora.checklistAccesoriosVehiculo == null)
          bitacora.checklistAccesoriosVehiculo =
            new ChecklistAccesoriosVehiculo()
        if (bitacora.checklistImagenVehiculo == null)
          bitacora.checklistImagenVehiculo = new ChecklistImagenVehiculo()
        if (bitacora.checklistVehiculo == null)
          bitacora.checklistVehiculo = new ChecklistVehiculo()

        await obtenerListados({
          tareas: {
            controller: new TareaController(),
            params: {
              formulario: true,
              empleado_id: store.user.id,
              campos: 'id,codigo_tarea,titulo'
            }
          },
          tickets: {
            controller: new TicketController(),
            params: {
              responsable_id: bitacora.chofer_id,
              campos: 'id,codigo,asunto'
            }
          }
        })

        tareas.value = listadosAuxiliares.tareas
        tickets.value = listadosAuxiliares.tickets
      }

      await obtenerTanqueosBitacora()
    })
    onBeforeModificar(() => {
      bitacora.checklistAccesoriosVehiculo.bitacora_id = bitacora.id
      bitacora.checklistImagenVehiculo.bitacora_id = bitacora.id
      bitacora.checklistVehiculo.bitacora_id = bitacora.id
    })
    onModificado(() => {
      listar({ firmada: tabDefecto.value, chofer_id: store.user.id })
    })

    //Reglas de validacion
    const reglas = {
      fecha: { required },
      hora_salida: { required },
      hora_llegada: {
        requiredIf: requiredIf(
          () => accion.value == acciones.editar && bitacora.firmada
        )
      },
      km_inicial: { required },
      imagen_inicial: { required },
      km_final: {
        requiredIf: requiredIf(
          () => accion.value == acciones.editar && bitacora.firmada
        )
      },
      tanque_inicio: { required },
      tanque_final: {
        requiredIf: requiredIf(
          () => accion.value == acciones.editar && bitacora.firmada
        ),
        minValue: minValue(25)
      },
      vehiculo: { required },
      checklistImagenVehiculo: {
        imagen_frontal: { requiredIf: requiredIf(() => bitacora.firmada) },
        imagen_trasera: { requiredIf: requiredIf(() => bitacora.firmada) },
        imagen_lateral_derecha: {
          requiredIf: requiredIf(() => bitacora.firmada)
        },
        imagen_lateral_izquierda: {
          requiredIf: requiredIf(() => bitacora.firmada)
        },
        imagen_tablero_km: { requiredIf: requiredIf(() => bitacora.firmada) },
        imagen_tablero_radio: {
          requiredIf: requiredIf(() => bitacora.firmada)
        },
        imagen_asientos: { requiredIf: requiredIf(() => bitacora.firmada) },
        imagen_accesorios: { requiredIf: requiredIf(() => bitacora.firmada) }
      }
    }
    const v$ = useVuelidate(reglas, bitacora)
    setValidador(v$.value)

    /****************************************
     * Funciones
     ****************************************/
    function filtrarBitacoras(tab: string) {
      tabDefecto.value = tab
      listar({ firmada: tab, chofer_id: store.user.id })

      puedeEditar.value =
        tabDefecto.value !== '1' || store.esAdministradorVehiculos
    }

    /**
     * La función obtiene el vehículo asignado para el usuario actual con un estado específico.
     * @returns está devolviendo el primer elemento del array
     * `resultado` de la respuesta del método `listar` en la clase `AsignacionVehiculoController`.
     */
    async function obtenerVehiculoAsignado() {
      try {
        cargando.activar()
        const response = await new AsignacionVehiculoController().listar({
          filtro: 1,
          responsable_id: store.user.id,
          estado: 'ACEPTADO',
          transferido: 0
        })
        // console.log(response)
        if (response.result.length == 0) {
          const response = await new TransferenciaVehiculoController().listar({
            filtro: 1,
            responsable_id: store.user.id,
            estado: 'ACEPTADO'
          })
          // console.log(response)
          return response.result[0]
        } else {
          return response.result[0]
        }
      } catch (error: any) {
        notificarAdvertencia(error)
      } finally {
        cargando.desactivar()
      }
    }

    async function vehiculoSeleccionado() {
      const vehiculo = vehiculos.value.filter(
        (v: Vehiculo) => v.id === bitacora.vehiculo
      )[0]
      bitacora.vehiculo_id = vehiculo.id
      bitacora.chofer =
        vehiculo.custodio.length < 2
          ? 'NO TIENE CUSTODIO ASIGNADO'
          : vehiculo.custodio
      bitacora.chofer_id = vehiculo.custodio_id

      bitacoraDefault.value = await obtenerUltimaBitacora()
      cargarDatosBitacoraDefecto()
    }

    async function obtenerUltimaBitacora() {
      try {
        cargando.activar()
        const response = await new UltimaBitacoraController().listar({
          vehiculo_id: bitacora.vehiculo_id,
          firmada: 1,
          filtrar: 1
        })
        console.log(response.response.data.modelo)
        return response.response.data.modelo
      } catch (e) {
        console.log('Error en obtenerUltimaBitacora', e)
      } finally {
        cargando.desactivar()
      }
    }

    /**
     * La función 'cargarDatosDefecto' carga datos por defecto en el objeto 'bitacora' basándose en
     * los valores de 'usuarioDefault'.
     */
    function cargarDatosDefecto() {
      console.log(usuarioDefault.value)
      if (usuarioDefault.value) {
        bitacora.vehiculo = usuarioDefault.value.vehiculo
        bitacora.vehiculo_id = usuarioDefault.value.vehiculo_id
        bitacora.chofer_id = usuarioDefault.value.responsable_id
        bitacora.chofer = usuarioDefault.value.responsable
        bitacora.fecha = obtenerFechaActual(maskFecha)
      }
    }

    function cargarDatosBitacoraDefecto() {
      // console.log(bitacoraDefault.value.id)
      if (bitacoraDefault.value.id) {
        // bitacora.km_inicial = bitacoraDefault.value.km_final
        // bitacora.tanque_inicio = bitacoraDefault.value.tanque_final
        // bitacora.tanque_final = bitacoraDefault.value.tanque_final
        bitacora.checklistAccesoriosVehiculo = new ChecklistAccesoriosVehiculo() // bitacoraDefault.value.checklistAccesoriosVehiculo
        bitacora.checklistVehiculo = new ChecklistVehiculo() // bitacoraDefault.value.checklistVehiculo
        bitacora.checklistImagenVehiculo.observacion = ' '

        bloquear_km_tanque.value = false
      } else {
        bloquear_km_tanque.value = false
      }
    }

    /**
     * La función `optionsFecha` comprueba si una fecha determinada se encuentra dentro del rango
     * de ayer y hoy.
     * @param date - El parámetro `date` es un objeto de fecha que se compara con la fecha de ayer
     * y la fecha de hoy.
     * @returns devuelve un valor booleano si la `fecha` se encuentra dentro del rango de ayer y hoy.
     */
    function optionsFecha(date) {
      const today = new Date()
      const yesterday = new Date(today.setDate(today.getDate() - 1))
      return (
        date >= convertir_fecha(yesterday) &&
        date <= convertir_fecha(new Date())
      )
    }

    function eliminar({ posicion }) {
      confirmar('¿Está seguro de continuar?', () =>
        bitacora.actividadesRealizadas.splice(posicion, 1)
      )
    }

    async function checkFinalizada(val) {
      const formularioValidado = await v$.value.$validate()
      if (val) {
        confirmar(
          '¿Está seguro de marcar como finalizada esta bitácora? Después de esto no podrás modificarla!',
          () =>
            confirmar(
              'Al dar click en OK se finalizará y se firmará automaticamente este registro!. ¿Desea continuar? ',
              async () => {
                if (formularioValidado) {
                  await firmarBitacora(bitacora.id!)
                  await reestablecer()
                }
                if (!formularioValidado)
                  notificarAdvertencia('Verifique el formulario')
              },
              () => (bitacora.firmada = false)
            ),
          () => (bitacora.firmada = false)
        )
      }
    }

    async function firmarBitacora(id: number) {
      try {
        cargando.activar()
        const url =
          apiConfig.URL_BASE +
          '/' +
          axios.getEndpoint(endpoints.bitacoras_vehiculos) +
          '/firmar-bitacora/' +
          id
        const response: AxiosResponse = await axios.post(url)
        // console.log(response)
        if (response.status == 200) notificarCorrecto(response.data.mensaje)
        //se filtra los registros para mostrar en el lado correcto la bitacora actualizada
        await filtrarBitacoras('1')
        //se manda a consultar la ultima bitacora, la que se actualizó recientemente
        bitacoraDefault.value = await obtenerUltimaBitacora()

        //se reestablece el formulario con los nuevos datos actualizados
        await reestablecer()
        return response
      } catch (error) {
        await notificarErrores(error)
      } finally {
        cargando.desactivar()
      }
    }

    async function imprimirPdf(id: number) {
      try {
        const axios = AxiosHttpRepository.getInstance()
        const url =
          apiConfig.URL_BASE +
          '/' +
          axios.getEndpoint(endpoints.bitacoras_vehiculos) +
          '/imprimir/' +
          id
        const filename = 'bitacora_vehicular_' + id + '_' + Date.now()
        await imprimirArchivo(url, 'GET', 'blob', 'pdf', filename)
        // console.log('Bitácora vehicular con éxito')
      } catch (e) {
        notificarAdvertencia('Error al imprimir la bitácora. ' + e)
      }
    }

    async function obtenerTanqueosBitacora() {
      // se consulta los tanqueos correspondientes  esta bitacora y se cargan en bitacora.tanqueos
      const { result } = await (new TanqueoController().listar({        bitacora_id: bitacora.id      }))
      console.log(result)
      bitacora.tiene_tanqueo = result.length>0
      bitacora.tanqueos = result
    }

    function guardado(data) {
      if (data.formulario == 'TanqueoLitePage') {
        bitacora.tanqueos.push(data.modelo)
        console.log('data recibida en el evento emitido de guardado', data)
      }
    }

    /****************************************
     * Botones de tabla
     ****************************************/
    const btnAgregarTanqueo: CustomActionTable = {
      titulo: 'Agregar Registro de Tanqueo',
      icono: 'bi-arrow-bar-down',
      color: 'positive',
      tooltip: 'Agregar tanqueo de combustible',
      accion: async () => {
        const vehiculo = vehiculos.value.filter(
          (v: Vehiculo) => v.id === bitacora.vehiculo
        )[0]

        console.log(vehiculo)

        modales.abrirModalEntidad('TanqueoPage', {
          vehiculo: vehiculo.placa,
          vehiculo_id: vehiculo.id,
          bitacora_id: bitacora.id
        })
      },
      visible: () => accion.value == acciones.editar
    }

    const btnAgregarActividad: CustomActionTable = {
      titulo: 'Agregar Actividad',
      icono: 'bi-arrow-bar-down',
      color: 'positive',
      tooltip: 'Agregar actividad realizada',
      accion: () => {
        const fila = { id: null, fecha_hora: '', actividad: null }
        fila.id = bitacora.actividadesRealizadas.length
          ? encontrarUltimoIdListado(bitacora.actividadesRealizadas) + 1
          : 1
        const fecha = new Date()
        fila.fecha_hora = format(fecha, 'YYYY-MM-DD HH:mm:ss', 'es')
        bitacora.actividadesRealizadas.unshift(fila)
        // emit('actualizar', bitacora.actividadesRealizadas)
      },
      visible: () => accion.value == acciones.editar
    }
    const btnEliminar: CustomActionTable = {
      titulo: 'Eliminar',
      icono: 'bi-trash',
      color: 'negative',
      accion: ({ posicion }) => {
        eliminar({ posicion })
      },
      visible: () => true
    }

    const btnImprimir: CustomActionTable = {
      titulo: 'Imprimir',
      icono: 'bi-printer',
      color: 'secondary',
      accion: async ({ entidad }) => {
        await imprimirPdf(entidad.id)
      },
      visible: () => tabDefecto.value === '1'
    }

    const btnMarcarFinalizada: CustomActionTable = {
      titulo: 'Finalizar',
      icono: 'bi-check2-circle',
      color: 'positive',
      accion: async ({ entidad }) => {
        // console.log('diste clic en finalizar', bitacora)
        bitacora.id = entidad.id
        bitacora.km_inicial = entidad.km_inicial
        // bitacora.km_final = entidad.km_final
        await firmarBitacora(entidad.id)
        // await checkFinalizada(true, null)
      },
      visible: () => tabDefecto.value === '0'
    }

    return {
      mixin,
      bitacora,
      disabled,
      v$,
      accion,
      acciones,
      configuracionColumnas: configuracionColumnasBitacoraVehicular,
      columnasActividades: configuracionColumnasActividadesRealizadas,
      configuracionColumnasTanqueos,
      maskFecha,
      accionesTabla,
      optionsDefault,
      optionsEstadosCualitativos,
      optionsEstados,
      optionsEstadosExtintor,
      accepted: ref('1'),
      tabDefecto,
      tabOptionsBitacoras,
      bloquear_km_tanque,
      puedeEditar,

      //listados
      vehiculos,
      filtrarVehiculos,
      choferes,
      filtrarChoferes,
      tickets,
      filtrarTickets,
      tareas,
      filtrarTareas,

      TanqueFinalValido: computed(
        () => bitacora.tanque_final! <= 100 || bitacora.tanque_final! >= 0
      ),

      modales,

      //funciones
      guardado,
      optionsFecha,
      checkFinalizada,
      filtrarBitacoras,
      vehiculoSeleccionado,

      //botones de tabla
      btnAgregarTanqueo,
      btnAgregarActividad,
      btnMarcarFinalizada,
      btnEliminar,
      btnImprimir
    }
  }
})
