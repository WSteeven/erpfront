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
import { PeriodoController } from 'pages/recursosHumanos/periodo/infraestructure/PeriodoController'
import { AutorizacionController } from 'pages/administracion/autorizaciones/infraestructure/AutorizacionController'

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
      listadosAuxiliares,
    } = mixin.useReferencias()
    const { setValidador, cargarVista, obtenerListados, listar } =
      mixin.useComportamiento()

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
    const puede_editar = ref(true)

    // Stores
    const recursosHumanosStore = useRecursosHumanosStore()
    const store = useAuthenticationStore()
    const router = useRouter()
    const autorizaciones = ref()
    const periodos = ref()
    const ver_boton_editar = computed(() => {
      let validar = false;
      if (esValidador.value === true) {
        validar=  tabSolicitudPrestaamo.value==='1'?true:false
      }
      if (esAutorizador.value === true) {
        validar =tabSolicitudPrestaamo.value==='4'?true:false
      }
      return validar;
    })
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
    cargarVista(async () => {
      await obtenerListados({
        periodos: {
          controller: new PeriodoController(),
          params: { campos: 'id,nombre', activo: 1 },
        },
        autorizaciones: {
          controller: new AutorizacionController(),
          params: { campos: 'id,nombre', es_validado: false, es_modulo_rhh:true },
        },
      })
      autorizaciones.value = listadosAuxiliares.autorizaciones
    })
    onConsultado(() => {
      puede_editar.value = false
      recursosHumanosStore.nivel_endeudamiento(
        solicitudPrestamo.solicitante == null
          ? store.user.id
          : solicitudPrestamo.solicitante
      )
    })

    //Reglas de validacion
    const reglas = computed(() => ({
      fecha: { required },
      monto: { required },
      motivo: { required },
      foto: { required },
      estado: requiredIf(esValidador.value),
      observacion: { requiredValidador: requiredIf(esValidador.value) },
      periodo: {
        requiredIf: requiredIf(
          solicitudPrestamo.cargo_utilidad != null
            ? solicitudPrestamo.cargo_utilidad
            : false
        ),
      },
      valor_utilidad: {
        requiredIf: requiredIf(
          solicitudPrestamo.cargo_utilidad != null
            ? solicitudPrestamo.cargo_utilidad
            : false
        ),
      },
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
    const tabSolicitudPrestaamo = ref('1')
    function filtrarSolicitudPrestamo(tabSeleccionado: string) {
      listar({ estado: tabSeleccionado }, false)
      tabSolicitudPrestaamo.value = tabSeleccionado
    }
    /**
     * La función `filtrarPeriodo` filtra una lista de períodos en función de un valor dado y actualiza la
     * lista filtrada.
     * @param val - El parámetro `val` es un valor de cadena que representa el valor de entrada para
     * filtrar los períodos. Se utiliza para buscar períodos que tienen un nombre que contiene el valor de
     * entrada.
     * @param update - El parámetro `update` es una función que se utiliza para actualizar el valor de
     * `periodos`. Es una función de devolución de llamada que toma otra función como argumento. La función
     * interna es responsable de actualizar el valor de `periodos` en función del parámetro `val` dado.
     * @returns nada (indefinido).
     */
    function filtrarPeriodo(val, update) {
      if (val === '') {
        update(() => {
          periodos.value = listadosAuxiliares.periodos
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        periodos.value = listadosAuxiliares.periodos.filter(
          (v) => v.nombre.toLowerCase().indexOf(needle) > -1
        )
      })
    }

    return {
      removeAccents,
      mixin,
      solicitudPrestamo,
      periodos,
      filtrarPeriodo,
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
      puede_editar,
      configuracionColumnas: configuracionColumnasSolicitudPrestamo,
      tabSolicitudPrestaamo,
      accionesTabla,
      ver_boton_editar,
    }
  },
})
