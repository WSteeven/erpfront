// Dependencias
import {
  requiredIf,
  maxLength,
  minLength,
  required,
} from 'shared/i18n-validators'
import { apiConfig, endpoints } from 'config/api'
import axios from 'axios'
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
import { MotivoPermisoEmpleadoController } from 'pages/recursosHumanos/motivo/infraestructure/MotivoPermisoEmpleadoController'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { useNotificaciones } from 'shared/notificaciones'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { FormaPagoController } from 'pages/recursosHumanos/forma_pago/infraestructure/FormaPagoController'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { useRecursosHumanosStore } from 'stores/recursosHumanos'
import { SolicitudPrestamo } from '../domain/SolicitudPrestamo'
import { SolicitudPrestamoController } from '../infraestructure/SolicitudPrestamoController'

export default defineComponent({
  components: { TabLayout, SelectorImagen, EssentialTable },
  setup() {
    const mixin = new ContenedorSimpleMixin(SolicitudPrestamo, new SolicitudPrestamoController())
    const {
      entidad: solicitudPrestamo,
      disabled,
      accion,
      listadosAuxiliares,
    } = mixin.useReferencias()
    const { setValidador, obtenerListados, cargarVista } =
      mixin.useComportamiento()
    const { onBeforeConsultar, onConsultado, onBeforeModificar } =
      mixin.useHooks()
    const {
      confirmar,
      prompt,
      notificarCorrecto,
      notificarAdvertencia,
      notificarError,
    } = useNotificaciones()
    const key_enter = ref(0)
    const motivos = ref([])
    const tipos = ref([
      { id: 1, nombre: 'solicitudPrestamo Descuento' },
      { id: 2, nombre: 'Anticipo' },
    ])
    const esConsultado = ref(false)
    onBeforeModificar(() => (esConsultado.value = true))
    const maximoAPrestar = ref()
    const formas_pago = ref([])
    const esMayorsolicitudPrestamo = ref(false)
    const empleados = ref([])
    const recursosHumanosStore = useRecursosHumanosStore()
    const sueldo_basico = computed(() => {
      recursosHumanosStore.obtener_sueldo_basico()
      return recursosHumanosStore.sueldo_basico
    })
    /* async function obtenerSueldoBasico() {
      sueldo_basico.value = await recursosHumanosStore.obtener_sueldo_basico()
      await console.log(sueldo_basico.value)
    }*/
    cargarVista(async () => {
      await obtenerListados({
        motivos: new MotivoPermisoEmpleadoController(),
        empleados: {
          controller: new EmpleadoController(),
          params: { campos: 'id,nombres,apellidos', estado: 1 },
        },
        formas_pago: {
          controller: new FormaPagoController(),
          params: { campos: 'id,nombre' },
        },
      })
      formas_pago.value = listadosAuxiliares.formas_pago
      empleados.value = listadosAuxiliares.empleados
    })
    motivos.value = listadosAuxiliares.motivos

    maximoAPrestar.value = parseInt(sueldo_basico.value) * 2
    //Reglas de validacion
    const reglas = computed(() => ({
      solicitante: { required },
      fecha: { required },
      monto: { required },
      plazo: { required, minValue: minValue(1), maxValue: maxValue(12) },
    }))
    const plazo_pago = ref({ id: 0, vencimiento: '', plazo: 0 })

    const v$ = useVuelidate(reglas, solicitudPrestamo)
    setValidador(v$.value)
    function convertir_fecha(fecha: string) {
      const dateString = fecha
      const dateParts = dateString.split('-')
      const dia = parseInt(dateParts[0])
      const mes = parseInt(dateParts[1]) - 1
      const anio = parseInt(dateParts[2])
      return new Date(anio, mes, dia)
    }

    function filtrarEmpleado(val, update) {
      if (val === '') {
        update(() => {
          empleados.value = listadosAuxiliares.empleados
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        empleados.value = listadosAuxiliares.empleados.filter(
          (v) =>
            v.nombres.toLowerCase().indexOf(needle) > -1 ||
            v.apellidos.toLowerCase().indexOf(needle) > -1
        )
      })
    }




    return {
      removeAccents,
      mixin,
      solicitudPrestamo,
      empleados,
      sueldo_basico,
      watchEffect,
      filtrarEmpleado,
      esMayorsolicitudPrestamo,
      maximoValorsolicitudPrestamo: [
        (val) =>
          (val && val <= parseInt(sueldo_basico.value) * 2) ||
          'Solo se permite solicitudPrestamo menor o igual a 2 SBU (' +
            parseInt(sueldo_basico.value) * 2 +
            ')',
      ],
      esConsultado,
      plazo_pago,
      motivos,
      tipos,
      formas_pago,
      maskFecha,
      v$,
      disabled,
      accion,
      accionesTabla,
    }
  },
})
