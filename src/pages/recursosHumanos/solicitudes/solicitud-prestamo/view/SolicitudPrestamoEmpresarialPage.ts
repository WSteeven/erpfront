// Dependencias
import {
  requiredIf,
  maxLength,
  minLength,
  required,
} from 'shared/i18n-validators'
import { maxValue, minValue } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, ref, computed, watchEffect, reactive } from 'vue'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import SelectorImagen from 'components/SelectorImagen.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { removeAccents } from 'shared/utils'
import { accionesTabla, maskFecha } from 'config/utils'
import { useNotificaciones } from 'shared/notificaciones'
import { useRecursosHumanosStore } from 'stores/recursosHumanos'
import { SolicitudPrestamo } from '../domain/SolicitudPrestamo'
import { SolicitudPrestamoController } from '../infraestructure/SolicitudPrestamoController'
import { configuracionColumnasSolicitudPrestamo } from '../domain/configuracionColumnasSolicitudPrestamo'

export default defineComponent({
  components: { TabLayout, SelectorImagen },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      SolicitudPrestamo,
      new SolicitudPrestamoController()
    )
    const {
      entidad: solicitudPrestamo,
      disabled,
      accion,
    } = mixin.useReferencias()
    const { setValidador } = mixin.useComportamiento()

    const {
      confirmar,
      prompt,
      notificarCorrecto,
      notificarAdvertencia,
      notificarError,
    } = useNotificaciones()
    const maximoAPrestar = ref()
    const esMayorsolicitudPrestamo = ref(false)
    const recursosHumanosStore = useRecursosHumanosStore()
    const sueldo_basico = computed(() => {
      recursosHumanosStore.obtener_sueldo_basico()
      return recursosHumanosStore.sueldo_basico
    })
    maximoAPrestar.value = parseInt(sueldo_basico.value) * 2
    //Reglas de validacion
    const reglas = computed(() => ({
      fecha: { required },
      monto: { required },
      observacion: {required},
      plazo: { required, minValue: minValue(1), maxValue: maxValue(12) },
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
    return {
      removeAccents,
      mixin,
      solicitudPrestamo,
      sueldo_basico,
      esMayorsolicitudPrestamo,
      optionsSolicitudPrestamo,
      maximoValorsolicitudPrestamo: [
        (val) =>
          (val && val <= parseInt(sueldo_basico.value) * 2) ||
          'Solo se permite prestamo menor o igual a 2 SBU ($ ' +
            parseInt(sueldo_basico.value) * 2 +
            ')',
      ],
      plazo_pago,
      maskFecha,
      v$,
      disabled,
      accion,
      configuracionColumnas: configuracionColumnasSolicitudPrestamo,
      accionesTabla,
    }
  },
})
