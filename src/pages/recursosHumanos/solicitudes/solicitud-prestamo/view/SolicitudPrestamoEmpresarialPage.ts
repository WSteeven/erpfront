// Dependencias
import { maxValue, required, requiredIf } from 'shared/i18n-validators'
import { useVuelidate } from '@vuelidate/core'
import { computed, defineComponent, ref, watch } from 'vue'

// Componentes
import NoOptionComponent from 'components/NoOptionComponent.vue'
import SelectorImagen from 'components/SelectorImagen.vue'
import ErrorComponent from 'components/ErrorComponent.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import {
  acciones,
  autorizacionesId,
  autorizacionesTransacciones,
  maskFecha,
  tabOptionsSolicitudPedido
} from 'config/utils'
import { useRecursosHumanosStore } from 'stores/recursosHumanos'
import { SolicitudPrestamo } from '../domain/SolicitudPrestamo'
import { SolicitudPrestamoController } from '../infraestructure/SolicitudPrestamoController'
import { configuracionColumnasSolicitudPrestamo } from '../domain/configuracionColumnasSolicitudPrestamo'
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'

import { useAuthenticationStore } from 'stores/authentication'
import { PeriodoController } from 'pages/recursosHumanos/periodo/infraestructure/PeriodoController'
import { AutorizacionController } from 'pages/administracion/autorizaciones/infraestructure/AutorizacionController'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { Autorizacion } from 'pages/administracion/autorizaciones/domain/Autorizacion'

export default defineComponent({
  components: {
    ErrorComponent,
    NoOptionComponent,
    TabLayoutFilterTabs2,
    SelectorImagen
  },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      SolicitudPrestamo,
      new SolicitudPrestamoController()
    )
    const {
      entidad: solicitudPrestamo,
      disabled,
      accion,
      listadosAuxiliares
    } = mixin.useReferencias()
    const { setValidador, cargarVista, obtenerListados, listar } =
      mixin.useComportamiento()
    const { onConsultado } = mixin.useHooks()
    const puede_editar = ref(true)

    // Stores
    const recursosHumanosStore = useRecursosHumanosStore()
    const store = useAuthenticationStore()
    const autorizaciones = ref()

    const ver_boton_editar = computed(() => {
      let validar = false
      if (esValidador.value) {
        validar = tabSolicitudPrestamo.value === '1'
      }
      if (esAutorizador.value) {
        validar = tabSolicitudPrestamo.value === '4'
      }
      return validar
    })
    const restringirMotivo = computed(() => {
      if (accion.value === acciones.editar) {
        return (
          solicitudPrestamo.estado === autorizacionesId.CANCELADO ||
          store.user.id !== solicitudPrestamo.solicitante
        )
      } else {
        return disabled.value
      }
    })

    // recursosHumanosStore.nivelEndeudamiento(solicitudPrestamo.solicitante == null? store.user.id: solicitudPrestamo.solicitante)

    const dosSBU = ref(0)
    const maximoValorsolicitudPrestamo = [
      val =>
        val <= parseInt(recursosHumanosStore.sueldo_basico) * 2 ||
        'Solo se permite prestamo menor o igual a 2 SBU ($ ' +
          parseInt(recursosHumanosStore.sueldo_basico) * 2 +
          ')'
    ]
    const tabSolicitudPrestamo = ref('1')
    const esValidador = computed(() => store.can('puede.ver.campo.validado'))
    const esAutorizador = computed(() =>
      store.can('puede.autorizar.solicitud_prestamo_empresarial')
    )
    const { periodos, filtrarPeriodos } =
      useFiltrosListadosSelects(listadosAuxiliares)
    cargarVista(async () => {
      await recursosHumanosStore.obtenerSueldoBasico()
      await recursosHumanosStore.nivelEndeudamiento(
        solicitudPrestamo.solicitante ?? store.user.id
      )
      await obtenerListados({
        periodos: {
          controller: new PeriodoController(),
          params: { campos: 'id,nombre', activo: 1 }
        },
        autorizaciones: {
          controller: new AutorizacionController(),
          params: {
            campos: 'id,nombre',
            es_validado: false,
            es_modulo_rhh: true
          }
        }
      })
      autorizaciones.value = listadosAuxiliares.autorizaciones
      periodos.value = listadosAuxiliares.periodos

      dosSBU.value = parseInt(recursosHumanosStore.sueldo_basico) * 2
    })

    /***************
     * HOOKS
     ***************/
    onConsultado(async () => {
      puede_editar.value = false
      await recursosHumanosStore.nivelEndeudamiento(
        solicitudPrestamo.solicitante ?? store.user.id
      )
    })
    /************************
     * Reglas de validacion
     ***********************/
    const reglas = computed(() => ({
      fecha: { required },
      monto: {
        required,
        maxValue: maxValue(dosSBU)
      },
      motivo: { required },
      estado: { required: requiredIf(() => esValidador.value) },
      observacion: { required: requiredIf(() => esValidador.value) },
      periodo: {
        requiredIf: requiredIf(() => solicitudPrestamo.cargo_utilidad)
      },
      valor_utilidad: {
        required: requiredIf(() => solicitudPrestamo.cargo_utilidad)
      },
      plazo: {
        // minValue: minValue(1),
        maxValue: maxValue(12),
        required: requiredIf(
          () =>
            esValidador.value &&
            solicitudPrestamo.estado !== autorizacionesId.CANCELADO
        )
      }
    }))
    const v$ = useVuelidate(reglas, solicitudPrestamo)
    setValidador(v$.value)

    /*********************
     * WATCHS
     ********************/
    /**
     * Con el uso de este watch se configura que al validador(RRHH) no le aparezca opción para aprobar préstamos
     * y que al autorizador (GERENTE) no le aparezca la opción de pendiente, porque solo puede una vez que el préstamo está validado, aprobar o cancelarlo
     */
    watch(accion, () => {
      autorizaciones.value = listadosAuxiliares.autorizaciones
      if (accion.value === acciones.editar && esValidador) {
        autorizaciones.value = listadosAuxiliares.autorizaciones.filter(
          (v: Autorizacion) => v.nombre !== autorizacionesTransacciones.aprobado
        )
      }
      if (accion.value === acciones.editar && esAutorizador.value) {
        autorizaciones.value = listadosAuxiliares.autorizaciones.filter(
          (v: Autorizacion) =>
            v.nombre !== autorizacionesTransacciones.pendiente
        )
      }
    })

    /*********************
     * FUNCIONES
     ********************/
    function optionsSolicitudPrestamo(date) {
      const currentDate = new Date() // Obtener la fecha actual
      const year = currentDate.getFullYear() // Obtener el año
      const month = String(currentDate.getMonth() + 1).padStart(2, '0') // Obtener el mes y asegurarse de que tenga dos dígitos
      const day = String(currentDate.getDate()).padStart(2, '0') // Obtener el día y asegurarse de que tenga dos dígitos
      const currentDateString = `${year}/${month}/${day}` // Formatear la fecha actual
      return date >= currentDateString
    }

    async function filtrarSolicitudPrestamo(tabSeleccionado: string) {
      await listar({ estado: tabSeleccionado })
      tabSolicitudPrestamo.value = tabSeleccionado
    }

    return {
      mixin,
      solicitudPrestamo,
      periodos,
      filtrarPeriodos,
      esValidador,
      esAutorizador,
      optionsSolicitudPrestamo,
      filtrarSolicitudPrestamo,
      maximoValorsolicitudPrestamo,
      autorizaciones,
      autorizacionesId,
      maskFecha,
      v$,
      disabled,
      recursosHumanosStore,
      tabOptionsSolicitudPedido,
      accion,
      configuracionColumnas: configuracionColumnasSolicitudPrestamo,
      tabSolicitudPrestamo,
      ver_boton_editar,
      acciones,
      restringirMotivo
    }
  }
})
