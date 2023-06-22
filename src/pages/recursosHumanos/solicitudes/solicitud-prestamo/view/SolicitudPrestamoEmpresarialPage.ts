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
    const solicitudPrestamoStore = useSolicitudPrestamoEmpresarialStore()
    const recursosHumanosStore = useRecursosHumanosStore()
    const store = useAuthenticationStore()
    const router = useRouter()
    const es_validado = ref(false)
    const estado_aux = ref()
    const sueldo_basico = computed(() => {
      recursosHumanosStore.obtener_sueldo_basico()
      return recursosHumanosStore.sueldo_basico
    })
    maximoAPrestar.value = parseInt(sueldo_basico.value) * 2
    onConsultado(() =>{
      estado_aux.value = solicitudPrestamo.estado
    console.log(estado_aux.value);

    })
    //Reglas de validacion
    const reglas = computed(() => ({
      fecha: { required },
      monto: { required },
      observacion: { required },
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
    let tabSolicitudPrestaamo = '1'
    function filtrarSolicitudPrestamo(tabSeleccionado: string) {
      listar({ estado: tabSeleccionado }, false)
      tabSolicitudPrestaamo = tabSeleccionado
    }
    const botonValidar: CustomActionTable = {
      titulo: 'Validar',
      icono: 'bi-check-lg',
      color: 'orange-8',
      accion: ({ entidad }) => {
        console.log(entidad)
        solicitudPrestamoStore.solicitudPrestamo = entidad
        router.push('solicitud-prestamo-empresarial')
      },
      visible: () => (tabSolicitudPrestaamo == '1' ? true : false),
    }
    const botonAprobar: CustomActionTable = {
      titulo: 'Aprobar',
      icono: 'bi-check-all',
      color: 'positive',
      accion: ({ posicion }) => {
        console.log(posicion)
      },
      visible: () => (tabSolicitudPrestaamo == '4' ? true : false),
    }
    const botonCancelar: CustomActionTable = {
      titulo: 'cancelar',
      icono: 'bi-x',
      color: 'negative',
      accion: ({ posicion }) => {
        console.log(posicion)
      },
      visible: () => (tabSolicitudPrestaamo == '2' ? true : false),
    }
    function validarPermiso(val){
      if(es_validado.value){
        solicitudPrestamo.estado= 4
     }else{
      solicitudPrestamo.estado= estado_aux.value!= undefined?estado_aux.value:1
     }
    }

    return {
      removeAccents,
      mixin,
      solicitudPrestamo,
      sueldo_basico,
      esMayorsolicitudPrestamo,
      botonValidar,
      botonAprobar,
      botonCancelar,
      validarPermiso,
      optionsSolicitudPrestamo,
      filtrarSolicitudPrestamo,
      maximoValorsolicitudPrestamo: [
        (val) =>
          (val && val <= parseInt(sueldo_basico.value) * 2) ||
          'Solo se permite prestamo menor o igual a 2 SBU ($ ' +
            parseInt(sueldo_basico.value) * 2 +
            ')',
      ],
      plazo_pago,
      maskFecha,
      es_validado,
      estado_aux,
      v$,
      disabled,
       store,
      tabOptionsSolicitudPedido,
      accion,
      configuracionColumnas: configuracionColumnasSolicitudPrestamo,
      accionesTabla,
    }
  },
})
