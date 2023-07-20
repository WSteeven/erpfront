// Dependencias
import {
  requiredIf,
  maxLength,
  minLength,
  required,
} from 'shared/i18n-validators'
import { maxValue, minValue } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, ref, computed, watchEffect, reactive, Ref } from 'vue'

// Componentes
import SelectorImagen from 'components/SelectorImagen.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { removeAccents } from 'shared/utils'
import {
  accionesTabla,
  maskFecha,
  tabOptionsSolicitudPedido,
} from 'config/utils'
import { useNotificaciones } from 'shared/notificaciones'
import { useRecursosHumanosStore } from 'stores/recursosHumanos'
import { SolicitudPrestamo } from '../domain/SolicitudPrestamo'
import { SolicitudPrestamoController } from '../infraestructure/SolicitudPrestamoController'
import { configuracionColumnasSolicitudPrestamo } from '../domain/configuracionColumnasSolicitudPrestamo'
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useSolicitudPrestamoEmpresarialStore } from 'stores/solicitudPrestamoEmpresarial'
import { useRouter } from 'vue-router'
import { useAuthenticationStore } from 'stores/authentication'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { AxiosResponse } from 'axios'
import { endpoints } from 'config/api'
import { LocalStorage } from 'quasar'

export default defineComponent({
  components: { TabLayoutFilterTabs2, SelectorImagen },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      SolicitudPrestamo,
      new SolicitudPrestamoController()
    )
    const {
      entidad: solicitudPrestamo,
      disabled,
      accion,
      listado,
    } = mixin.useReferencias()
    const { setValidador, listar } = mixin.useComportamiento()

    const {
      confirmar,
      prompt,
      notificarCorrecto,
      notificarAdvertencia,
      notificarError,
    } = useNotificaciones()
    const { onBeforeConsultar, onConsultado, onBeforeModificar } =
      mixin.useHooks()

    const maximoAPrestar = ref()
    const esMayorsolicitudPrestamo = ref(false)
    // Stores
    const recursosHumanosStore = useRecursosHumanosStore()
    const store = useAuthenticationStore()
    const router = useRouter()
    const autorizaciones = ref()
    const sueldo_basico = computed(() => {
      recursosHumanosStore.obtener_sueldo_basico()
      return recursosHumanosStore.sueldo_basico
    })
    recursosHumanosStore.nivel_endeudamiento(
      solicitudPrestamo.solicitante == null
        ? store.user.id
        : solicitudPrestamo.solicitante
    )

    maximoAPrestar.value = parseInt(sueldo_basico.value) * 2
    const esValidador = computed(() => store.can('puede.ver.campo.validado'))
    const esAutorizador = computed(() =>
      store.can('puede.autorizar.solicitud_prestamo_empresarial')
    )
    autorizaciones.value =
      LocalStorage.getItem('autorizaciones') == null
        ? []
        : JSON.parse(LocalStorage.getItem('autorizaciones')!.toString())
    onConsultado(() => {
      if (esValidador.value) {
        if (!store.esAdministrador) {
          autorizaciones.value.splice(
            autorizaciones.value.findIndex((obj) => obj.nombre === 'APROBADO'),
            1
          )
          autorizaciones.value.splice(
            autorizaciones.value.findIndex((obj) => obj.nombre === 'PENDIENTE'),
            1
          )
        }
      }
      if (esAutorizador.value) {
        autorizaciones.value.splice(
          autorizaciones.value.findIndex((obj) => obj.nombre === 'VALIDADO'),
          1
        )
        autorizaciones.value.splice(
          autorizaciones.value.findIndex((obj) => obj.nombre === 'PENDIENTE'),
          1
        )
      }
    })
    //Reglas de validacion
    const reglas = computed(() => ({
      fecha: { required },
      monto: { required },
      motivo: { required },
      foto: { required },
      estado: requiredIf(esValidador.value),
      observacion: { requiredValidador: requiredIf(esValidador.value) },
      plazo: {
        minValue: minValue(1),
        maxValue: maxValue(12),
        requiredValidador: requiredIf(esValidador.value),
      },
    }))
    const plazo_pago = ref({ id: 0, vencimiento: '', plazo: 0 })
    const v$ = useVuelidate(reglas, solicitudPrestamo)

    setValidador(v$.value)
    function optionsSolicitudPrestamo(date) {
      const currentDate = new Date() // Obtener la fecha actual
      const year = currentDate.getFullYear() // Obtener el año
      const month = String(currentDate.getMonth() + 1).padStart(2, '0') // Obtener el mes y asegurarse de que tenga dos dígitos
      const day = String(currentDate.getDate()).padStart(2, '0') // Obtener el día y asegurarse de que tenga dos dígitos
      const currentDateString = `${year}/${month}/${day}` // Formatear la fecha actual
      return date >= currentDateString
    }
    let tabSolicitudPrestaamo = '1'
    function filtrarSolicitudPrestamo(tabSeleccionado: string) {
      listar({ estado: tabSeleccionado }, false)
      tabSolicitudPrestaamo = tabSeleccionado
    }

    return {
      removeAccents,
      mixin,
      solicitudPrestamo,
      sueldo_basico,
      esMayorsolicitudPrestamo,
      esValidador,
      esAutorizador,
      optionsSolicitudPrestamo,
      filtrarSolicitudPrestamo,
      maximoValorsolicitudPrestamo: [
        (val) =>
          val <= parseInt(sueldo_basico.value) * 2 ||
          'Solo se permite prestamo menor o igual a 2 SBU ($ ' +
            parseInt(sueldo_basico.value) * 2 +
            ')',
      ],
      plazo_pago,
      autorizaciones,
      maskFecha,
      v$,
      disabled,
      store,
      recursosHumanosStore,
      tabOptionsSolicitudPedido,
      accion,
      configuracionColumnas: configuracionColumnasSolicitudPrestamo,

      accionesTabla,
    }
  },
})
