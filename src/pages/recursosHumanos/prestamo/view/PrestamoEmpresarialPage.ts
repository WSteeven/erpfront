// Dependencias
import { configuracionColumnasPrestamo } from '../domain/configuracionColumnasPrestamo'
import { configuracionColumnasPlazoPrestamo } from '../domain/configuracionColumnasPlazoPrestamo'
import { required, requiredIf } from 'shared/i18n-validators'
import { maxValue, minValue } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { computed, defineComponent, ref } from 'vue'

// Componentes
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import NoOptionComponent from 'components/NoOptionComponent.vue'
import ErrorComponent from 'components/ErrorComponent.vue'
import SelectorImagen from 'components/SelectorImagen.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { PrestamoController } from '../infraestructure/PrestamoController'
import { Prestamo } from '../domain/Prestamo'
import {
  acciones,
  accionesTabla,
  maskFecha,
  tabPrestamoEmpresarial
} from 'config/utils'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { useNotificaciones } from 'shared/notificaciones'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useRecursosHumanosStore } from 'stores/recursosHumanos'
import { PeriodoController } from 'pages/recursosHumanos/periodo/infraestructure/PeriodoController'
import { PrestamoCustomController } from '../infraestructure/PrestamoCustomController'
import { useAuthenticationStore } from 'stores/authentication'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { endpoints } from 'config/api'
import { AxiosError, AxiosResponse } from 'axios'
import {
  isApiError,
  notificarMensajesError,
  obtenerFechaActual
} from 'shared/utils'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { PlazoPrestamo } from 'recursosHumanos/prestamo/domain/PlazoPrestamo'
import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'
import { useCargandoStore } from 'stores/cargando'

export default defineComponent({
  name: 'PrestamoEmpresarial',
  components: {
    NoOptionComponent,
    ErrorComponent,
    TabLayoutFilterTabs2,
    SelectorImagen,
    EssentialTable
  },
  setup() {
    const mixin = new ContenedorSimpleMixin(Prestamo, new PrestamoController())
    const {
      entidad: prestamo,
      disabled,
      accion,
      listadosAuxiliares,
      listado
    } = mixin.useReferencias()
    const { setValidador, obtenerListados, cargarVista, listar } =
      mixin.useComportamiento()
    const {
      onGuardado,
      onReestablecer,
      onBeforeModificar,
      onBeforeConsultar,
      onConsultado
    } = mixin.useHooks()

    const {
      confirmar,
      prompt,
      notificarCorrecto,
      notificarAdvertencia,
      notificarError
    } = useNotificaciones()

    // stores
    useNotificacionStore().setQuasar(useQuasar())
    useCargandoStore().setQuasar(useQuasar())
    const recursosHumanosStore = useRecursosHumanosStore()
    const authenticationStore = useAuthenticationStore()

    const cargando = new StatusEssentialLoading()
    const esConsultado = ref(false)
    const is_month = ref(false)
    const sueldo_basico = computed(() => {
      recursosHumanosStore.obtenerSueldoBasico()
      return recursosHumanosStore.sueldo_basico
    })
    const prestamoEmpresarialCustomController = new PrestamoCustomController()
    const esNuevo = computed(() => {
      return accion.value === acciones.nuevo
    })
    const fecha_vencimiento = computed(() => {
      if (accion.value == acciones.nuevo) {
        return prestamo.plazos != null
          ? prestamo.plazos[prestamo.plazo - 1].fecha_vencimiento
          : null
      }
      return obtenerFechaActual(maskFecha)
    })
    let tabActualPrestamoEmpresarial = 'ACTIVO'

    /*************************************************************************
     * HOOKS
     *************************************************************************/
    onGuardado(() => {
      recursosHumanosStore.resetearSolicitudPrestamo()
    })
    onReestablecer(() => {
      recursosHumanosStore.resetearSolicitudPrestamo()
    })
    onBeforeConsultar(async () => {
      await consultarEmpleados()
    })
    onConsultado(() => (prestamo.vencimiento = fecha_vencimiento.value))
    onBeforeModificar(() => (esConsultado.value = true))

    const { periodos, filtrarPeriodos, empleados, filtrarEmpleados } =
      useFiltrosListadosSelects(listadosAuxiliares)
    cargarVista(async () => {
      await obtenerListados({
        empleados: {
          controller: new EmpleadoController(),
          params: { campos: 'id,nombres,apellidos', estado: 1 }
        },
        periodos: {
          controller: new PeriodoController(),
          params: { campos: 'id,nombre', activo: 1 }
        }
      })
      empleados.value = listadosAuxiliares.empleados
      periodos.value = listadosAuxiliares.periodos

      // Datos default
      prestamo.estado = 'ACTIVO'
      if (recursosHumanosStore.solicitudPrestamo.id) {
        await cargarDatosSolicitudPrestamo()
      }
    })

    /*************************************************************************
     * Reglas de validación y validaciones
     *************************************************************************/
    //Reglas de validacion
    const reglas = computed(() => ({
      solicitante: { required },
      fecha: { required },
      vencimiento: { required },
      monto: { required },
      valor_utilidad: { requiredIf: requiredIf(prestamo.periodo != null) },
      plazo: { required, minValue: minValue(1), maxValue: maxValue(12) },
      plazos: { required },
      fecha_inicio_cobro: { required }
    }))

    const v$ = useVuelidate(reglas, prestamo)
    setValidador(v$.value)

    /*************************************************************************
     * Funciones
     *************************************************************************/
    async function cargarDatosSolicitudPrestamo() {
      // Copiamos los valores de la solicitud en el préstamo
      prestamo.solicitante = recursosHumanosStore.solicitudPrestamo.solicitante
      prestamo.solicitante_info =
        recursosHumanosStore.solicitudPrestamo.solicitante_info
      prestamo.fecha = recursosHumanosStore.solicitudPrestamo.fecha
      prestamo.fecha_inicio_cobro = recursosHumanosStore.solicitudPrestamo.fecha
      prestamo.monto = recursosHumanosStore.solicitudPrestamo.monto
      prestamo.plazo = Number.parseInt(
        recursosHumanosStore.solicitudPrestamo.plazo
      )
      prestamo.estado = 'ACTIVO'
      prestamo.periodo = recursosHumanosStore.solicitudPrestamo.periodo
      prestamo.valor_utilidad =
        recursosHumanosStore.solicitudPrestamo.valor_utilidad
      prestamo.id_solicitud_prestamo_empresarial =
        recursosHumanosStore.solicitudPrestamo.id
      await calcularCantidadCuotas()
    }

    /**
     * Calcula la cantidad y valores de las cuotas para el préstamo empresarial.
     * Envía los datos actuales del préstamo al endpoint correspondiente y actualiza
     * la propiedad `plazos` del préstamo con la respuesta recibida.
     * También actualiza la fecha de vencimiento y gestiona el estado de carga y notificaciones.
     *
     * @async
     * @returns {Promise<void>} No retorna ningún valor, pero actualiza el estado del préstamo.
     *
     * @throws Muestra notificaciones de error si la petición falla o si hay errores de validación.
     */
    async function calcularCantidadCuotas() {
      try {
        cargando.activar()
        if (prestamo.plazo != null && prestamo.monto != null) {
          const axios = AxiosHttpRepository.getInstance()
          const ruta = axios.getEndpoint(
            endpoints.calcular_cuotas_prestamo_empresarial
          )
          const response: AxiosResponse = await axios.post(ruta, prestamo)

          if (response.status == 200) notificarCorrecto('Cuotas calculadas')
          prestamo.plazos = response.data.cuotas

          // se actualiza la variable de fecha de vencimiento
          prestamo.vencimiento = fecha_vencimiento.value
        }
      } catch (e) {
        const axiosError = e as AxiosError
        if (isApiError(axiosError)) {
          const mensajes: string[] = error.erroresValidacion
          await notificarMensajesError(mensajes, this.notificaciones)
        }
      } finally {
        cargando.desactivar()
      }
    }

    async function consultarEmpleados() {
      const { result } = await new EmpleadoController().listar({
        campos: 'id,nombres,apellidos'
      })
      empleados.value = result
      listadosAuxiliares.empleados = result
    }

    /**
     * Aplaza una cuota de préstamo empresarial.
     * Envía una solicitud al backend con el motivo del aplazamiento y actualiza la cuota correspondiente.
     * Muestra notificaciones según el resultado y gestiona el estado de carga.
     *
     * @param {number} id - Identificador de la cuota a aplazar.
     * @param {number} posicion - Posición de la cuota en el arreglo de plazos.
     * @param {string} comentario - Motivo o comentario del aplazamiento.
     * @async
     * @returns {Promise<void>} No retorna ningún valor, pero actualiza la cuota en el estado local.
     * @throws Muestra notificaciones de error si la petición falla o hay errores de validación.
     */
    async function aplazarCuota(
      id: number,
      posicion: number,
      comentario: string
    ) {
      try {
        cargando.activar()
        const axios = AxiosHttpRepository.getInstance()
        const ruta =
          axios.getEndpoint(endpoints.aplazar_cuota_prestamo_empresarial) + id
        const response: AxiosResponse = await axios.post(ruta, {
          comentario: comentario
        })

        if (response.status == 200) {
          notificarCorrecto(response.data.mensaje)
          prestamo.plazos[posicion] = response.data.cuota
        }
      } catch (e) {
        const axiosError = e as AxiosError
        if (isApiError(axiosError)) {
          const mensajes: string[] = error.erroresValidacion
          await notificarMensajesError(mensajes, this.notificaciones)
        }
      } finally {
        cargando.desactivar()
      }
    }

    function modificarCuota(entidad: PlazoPrestamo, posicion) {
      confirmar(
        '¿Está seguro de modificar la cuota N' + entidad.num_cuota + '?',
        () => {
          const data: CustomActionPrompt = {
            titulo: 'Modificar cuota',
            mensaje: 'Ingrese nuevo valor de la cuota',
            defecto: entidad.valor_cuota,
            accion: async data => {
              try {
                prestamo.plazos[posicion].valor_cuota = data

                if (verificarCuotasVSMonto('valor_cuota') !== prestamo.monto)
                  notificarAdvertencia(
                    'La suma de todas las cuotas debe ser igual al valor del prestamo, por favor reajusta'
                  )
              } catch (e: any) {
                notificarError(
                  'modificarCuota: No se pudo modificar, debes ingresar monto'
                )
              }
            }
          }
          prompt(data)
        }
      )
    }

    /**
     * Suma los valores de una propiedad específica de todas las cuotas del préstamo.
     *
     * @param {string} clave - Nombre de la propiedad a sumar (por ejemplo, 'valor_cuota').
     * @returns {number} Total sumado de la propiedad indicada en todas las cuotas.
     */
    function verificarCuotasVSMonto(clave: string): number {
      return prestamo.plazos?.reduce((acc, plazo: PlazoPrestamo) => {
        return acc + parseFloat(plazo[clave])
      }, 0)
    }

    /**
     * Modifica el comentario de una cuota específica del préstamo.
     * Muestra un cuadro de diálogo para ingresar o editar el comentario y actualiza el valor en el arreglo de cuotas.
     * Si ocurre un error, muestra una notificación.
     *
     * @param {number} posicion - Índice de la cuota a modificar en el arreglo de plazos.
     */
    function modificarComentario(posicion) {
      const data: CustomActionPrompt = {
        titulo: 'Modificar comentario',
        mensaje: 'Ingrese o modifique el comentario de esta cuota',
        defecto: prestamo.plazos[posicion].comentario,
        accion: async data => {
          try {
            prestamo.plazos[posicion].comentario = data
          } catch (e: any) {
            notificarError('No se pudo modificar, debes ingresar un comentario')
          }
        }
      }
      prompt(data)
    }

    /**
     * Modifica el valor total a pagar de una cuota específica del préstamo.
     * Solicita el nuevo valor mediante un cuadro de diálogo y actualiza el monto en el arreglo de cuotas.
     * Verifica que la suma total de las cuotas coincida con el monto del préstamo y muestra advertencias si es necesario.
     * Si ocurre un error, muestra una notificación.
     *
     * @param {number} posicion - Índice de la cuota a modificar en el arreglo de plazos.
     */
    function modificarTotalCuota(posicion) {
      confirmar('¿Está seguro de modificar la cuota?', () => {
        const data: CustomActionPrompt = {
          titulo: 'Modificar cuota',
          mensaje: 'Ingrese nuevo valor total de la cuota',
          accion: async data => {
            try {
              prestamo.plazos[posicion].valor_a_pagar = data
              if (verificarCuotasVSMonto('valor_a_pagar') !== Number.parseFloat(prestamo.monto))
                notificarAdvertencia(
                  'La suma de todas las cuotas debe ser igual al valor del prestamo, por favor reajusta las otras cuotas'
                )
            } catch (e: any) {
              console.error('error', e)
              notificarError('modificarTotalCuota: No se pudo modificar, debes ingresar monto')
            }
          }
        }
        prompt(data)
      })
    }

    async function pagar(entidad:PlazoPrestamo, posicion:number) {
      confirmar('¡Esta acción es irreversible! ¿Está seguro de pagar la cuota N' + entidad.num_cuota + '?', () => {
        const data: CustomActionPrompt = {
          titulo: 'Pagar cuota',
          mensaje: 'Ingrese valor de la cuota a pagar',
          accion: async data => {
            try {
              if (data > parseFloat(prestamo.plazos[posicion].valor_a_pagar)) {
                notificarError('No se pudo pagar, debes ingresar monto menor o igual a '
                    +prestamo.plazos[posicion].valor_a_pagar)
                return
              }

              //Aqui se llamar a pagar
              await pagarCuotaPrestamoEmpresarial(entidad.id, data, posicion)

            } catch (e: any) {
              notificarError('No se pudo pagar, a ocurido un error: ' + e)
            }
          }
        }
        prompt(data)
      })
    }

    async function pagarCuotaPrestamoEmpresarial(id:number, valorAPagar:number, posicion:number) {
        try {
            cargando.activar()
            const axios = AxiosHttpRepository.getInstance()
            const ruta =
            axios.getEndpoint(endpoints.pagar_cuota_prestamo) + id
            const response: AxiosResponse = await axios.post(ruta, {monto:valorAPagar})

            if (response.status == 200) notificarCorrecto('Cuota pagada')
            prestamo.plazos[posicion] = response.data.cuota

        } catch (e) {
            const axiosError = e as AxiosError
            if (isApiError(axiosError)) {
            const mensajes: string[] = error.erroresValidacion
            await notificarMensajesError(mensajes, this.notificaciones)
            }
        } finally {
            cargando.desactivar()
        }
    }

    /**
     * Actualiza la información de un préstamo empresarial.
     * Utiliza el controlador personalizado para realizar la actualización y muestra notificaciones según el resultado.
     * Refresca la lista de préstamos empresariales filtrados tras la actualización.
     *
     * @param {number} id - Identificador del préstamo empresarial a actualizar.
     * @async
     * @returns {Promise<void>} No retorna ningún valor, pero actualiza el estado y la vista de los préstamos.
     * @throws Muestra notificación de error si la actualización falla.
     */
    async function actualizarPrestamoEmpresarial(id: number) {
      try {
        await prestamoEmpresarialCustomController.actualizarPrestamoEmpresarial(id)
        notificarCorrecto('Se ha actualizado  el PrestamoEmpresarial')
        await filtrarPrestamoEmpresarial(tabActualPrestamoEmpresarial)
      } catch (e: any) {
        notificarError('No se pudo actualizar, ocurrio un error')
      }
    }

    /**
     * Anula (elimina) un préstamo empresarial.
     * Solicita al usuario un motivo de anulación mediante un cuadro de diálogo.
     * Actualiza el estado y motivo del préstamo, realiza la anulación usando el controlador
     * y elimina el préstamo de la lista local. Muestra notificaciones según el resultado.
     *
     * @param entidad
     * @param posicion
     * @async
     * @returns {Promise<void>} No retorna ningún valor, pero actualiza la lista de préstamos.
     * @throws Muestra notificación de error si la anulación falla o no se ingresa un motivo.
     */
    async function anularPrestamoEmpresarial(entidad, posicion) {
      try {
        const data: CustomActionPrompt = {
          titulo: 'Eliminar PrestamoEmpresarial',
          mensaje: 'Ingrese motivo de eliminacion',
          accion: async data => {
            entidad.estado = false
            entidad.motivo = data
            entidad.descripcion_prestamoempresarial = data
            await prestamoEmpresarialCustomController.anularPrestamoEmpresarial(
              entidad
            )
            notificarCorrecto('Se ha eliminado PrestamoEmpresarial')
            listado.value.splice(posicion, 1)
          }
        }
        prompt(data)
      } catch (e: any) {
        notificarError(
          'No se pudo anular, debes ingresar un motivo para la anulacion: '+e
        )
      }
    }



    async function filtrarPrestamoEmpresarial(tabSeleccionado: string) {
      await listar({ estado: tabSeleccionado }, false)
      tabActualPrestamoEmpresarial = tabSeleccionado
    }

    /**Verifica si es un mes */
    function checkMes(_, reason) {
      is_month.value = reason !== 'month'
      if (!is_month.value) calcularCantidadCuotas()
    }

    /*************************************************************************
     * Botones de tabla
     *************************************************************************/

    /**
     * TODO: Esta función solo se usa cuando es nuevo
     */
    const btnModificarCuota: CustomActionTable<PlazoPrestamo> = {
      titulo: 'Modificar Cuota',
      icono: 'bi-pencil-square',
      color: 'secondary',
      tooltip: 'Modificar el valor de la cuota',
      accion: ({ entidad, posicion }) => {
        modificarCuota(entidad, posicion)
      },
      visible: () => accion.value == acciones.nuevo
    }

    /**
     * TODO: Esta función falta de probar su funcionalidad
     */
    const btnPagarCuota: CustomActionTable<PlazoPrestamo> = {
      titulo: 'pagar',
      icono: 'bi-cash',
      color: 'primary',
      accion: async ({ entidad, posicion }) => {

        await pagar(entidad, posicion)
      },
      visible: ({entidad}) => accion.value == acciones.editar && !entidad.pago_cuota
    }

    const btnAplazarCuota: CustomActionTable<PlazoPrestamo> = {
      titulo: 'Aplazar',
      icono: 'bi-caret-down-fill',
      color: 'warning',
      accion: ({ entidad, posicion }) => {
        confirmar(
          'Se modificará el mes de vencimiento hasta el mes siguiente de la ultima cuota. ¡Esta acción es irreversible! ¿Está seguro de continuar?',
          async () => {
            const data: CustomActionPrompt = {
              titulo: 'Comentario',
              mensaje: 'Escribe el motivo por el que vas a aplazar la cuota',
              accion: async data => {
                await aplazarCuota(entidad.id, posicion, data)
              }
            }
            prompt(data)
          }
        )
      },
      visible: () => accion.value == acciones.editar
    }
    const btnEditarTotalCuota: CustomActionTable<PlazoPrestamo> = {
      titulo: 'Editar Valor a Pagar',
      icono: 'bi-pencil-square',
      color: 'warning',
      accion: ({ posicion }) => {
        modificarTotalCuota(posicion)
      },
      visible: ({ entidad }) =>
        accion.value == acciones.editar && !entidad.pago_cuota
    }

    const btnComentario: CustomActionTable = {
      titulo: 'Editar Comentario',
      icono: 'bi-pencil-square',
      color: 'positive',
      accion: ({ posicion }) => {
        modificarComentario(posicion)
      },
      visible: () => accion.value == acciones.editar
    }

    const btnActualizarPrestamoEmpresarial: CustomActionTable = {
      titulo: 'Actualizar préstamo',
      icono: 'bi-arrow-clockwise',
      color: 'warning',
      tooltip: 'Actualizar el estado del préstamo',
      visible: () =>
        authenticationStore.can('puede.editar.prestamo_empresarial') &&
        tabActualPrestamoEmpresarial == 'ACTIVO',
      accion: ({ entidad }) => {
        actualizarPrestamoEmpresarial(entidad.id)
      }
    }
    const btnEliminarPrestamoEmpresarial: CustomActionTable = {
      titulo: '',
      icono: 'bi-trash',
      color: 'negative',
      visible: () =>
        authenticationStore.can('puede.eliminar.prestamo_empresarial') &&
        tabActualPrestamoEmpresarial == 'ACTIVO',
      accion: ({ entidad, posicion }) => {
        accion.value = acciones.eliminar
        anularPrestamoEmpresarial( entidad, posicion)
      }
    }

    return {
      mixin,
      prestamo,
      empleados,
      sueldo_basico,
      periodos,
      filtrarEmpleados,
      filtrarPeriodos,
      filtrarPrestamoEmpresarial,
      calcularCantidadCuotas,
      checkMes,
      btnModificarCuota,
      btnPagarCuota,
      btnEditarTotalCuota,
      btnComentario,
      btnAplazarCuota,
      btnEliminarPrestamoEmpresarial,
      btnActualizarPrestamoEmpresarial,
      esNuevo,
      configuracionColumnasPlazoPrestamo,
      maskFecha,
      is_month,
      v$,
      disabled,
      tabPrestamoEmpresarial,
      configuracionColumnas: configuracionColumnasPrestamo,
      accionesTabla
    }
  }
})
