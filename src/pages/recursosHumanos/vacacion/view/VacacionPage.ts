// Dependencias
import { configuracionColumnasVacacion } from '../domain/configuracionColumnasVacacion'
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
import { VacacionController } from '../infraestructure/VacacionController'
import { Vacacion } from '../domain/Vacacion'
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
import { integer } from 'vuelidate/lib/validators'
import { number } from 'echarts'
import { PeriodoController } from 'pages/recursosHumanos/periodo/infraestructure/PeriodoController'

export default defineComponent({
  components: { TabLayout, SelectorImagen, EssentialTable },
  setup() {
    const mixin = new ContenedorSimpleMixin(Vacacion, new VacacionController())
    const {
      entidad: vacacion,
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
      { id: 1, nombre: 'Vacacion Descuento' },
      { id: 2, nombre: 'Anticipo' },
    ])
    const esConsultado = ref(false)
    onBeforeModificar(() => (esConsultado.value = true))
    const maximoAPrestar = ref()
    const periodos = ref([])
    const empleados = ref([])
    const recursosHumanosStore = useRecursosHumanosStore()


    cargarVista(async () => {
      await obtenerListados({
        motivos: new MotivoPermisoEmpleadoController(),
        empleados: {
          controller: new EmpleadoController(),
          params: { campos: 'id,nombres,apellidos', estado: 1 },
        },
        periodos: {
          controller: new PeriodoController(),
          params: { campos: 'id,nombre', estado:true },
        },
      })
      periodos.value = listadosAuxiliares.periodos
      empleados.value = listadosAuxiliares.empleados
    })
    motivos.value = listadosAuxiliares.motivos


    //Reglas de validacion
    const reglas = computed(() => ({
      empleado: { required },
      periodo: { required },
      descuento_vacaciones: { required },
      fecha_inicio_rango1_vacaciones: { required },
      fecha_fin_rango1_vacaciones: { required },
      solicitud: { required, minValue: minValue(1), maxValue: maxValue(12) },
    }))


    const v$ = useVuelidate(reglas, vacacion)
    setValidador(v$.value)

    watchEffect(() => {
      try {

      } catch (error) {}
    })
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
      Vacacion,
      empleados,
      watchEffect,
      filtrarEmpleado,
      esConsultado,
      motivos,
      tipos,
      maskFecha,
      v$,
      disabled,
      configuracionColumnas: configuracionColumnasVacacion,
      accion,
      accionesTabla,
    }
  },
})
