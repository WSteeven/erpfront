// Dependencias
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { configuracionColumnasCitaMedica } from '../domain/configuracionColumnasCitaMedica'
import { estadosCitaMedica, tabOptionsEstadosCitaMedica } from 'config/utils/medico'
import { computed, defineComponent, reactive, ref } from 'vue'
import { useAuthenticationStore } from 'stores/authentication'
import { CitaMedica } from '../domain/CitaMedica'
import { required } from 'shared/i18n-validators'
import useVuelidate from '@vuelidate/core'
import { maskFecha } from 'config/utils'

// Componentes
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import DetallePaciente from 'medico/gestionarPacientes/view/DetallePaciente.vue'
import EstadosSubtareas from 'components/tables/view/EstadosSubtareas.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { CitaMedicaController } from '../infraestructure/CitaMedicaController'
import { Empleado } from 'pages/recursosHumanos/empleados/domain/Empleado'
import { useBotonesCitaMedica } from '../application/UseBotonesCitaMedica'
import { formatearFechaHora } from 'shared/utils'
import { ComportamientoModalesCitaMedica } from '../domain/ComportamientoModalesCitaMedica'

export default defineComponent({
  components: {
    TabLayoutTabs: TabLayoutFilterTabs2,
    Estado: EstadosSubtareas,
    DetallePaciente,
    ModalesEntidad,
  },
  setup() {
    /*********
     * Stores
     *********/
    const authenticationStore = useAuthenticationStore()

    /*********
     * Mixin
     *********/
    const mixin = new ContenedorSimpleMixin(CitaMedica, new CitaMedicaController())
    const { entidad: citaMedica } = mixin.useReferencias()
    const { setValidador, listar } = mixin.useComportamiento()
    const { onConsultado, onBeforeModificar, onReestablecer } = mixin.useHooks()

    /****************
     * Controladores
     ****************/
    const empleadoController = new EmpleadoController()

    /***********
     * Variable
     ***********/
    const tabCita = ref(estadosCitaMedica.PENDIENTE)
    const empleado = reactive(new Empleado())
    const cargando = new StatusEssentialLoading()
    const fecha_cita_medica = ref()
    const hora_cita_medica = ref()

    const modales = new ComportamientoModalesCitaMedica()

    /************
     * Funciones
     ************/
    const { btnCancelarCita, btnRechazar, btnDiagnosticoReceta, btnAgendarCita } = useBotonesCitaMedica(mixin, tabCita, modales)

    const filtrarCitaMedica = (tabSeleccionado: string) => {
      tabCita.value = tabSeleccionado
      const params = { estado_cita_medica: tabCita.value, paciente_id: authenticationStore.user.id }
      if (authenticationStore.esMedico) delete params.paciente_id
      listar(params)
    }

    const consultarEmpleado = async (id: number) => {
      cargando.activar()
      try {
        const { result } = await empleadoController.consultar(id)
        empleado.hydrate(result)
      } catch (e) {
        console.log(e)
      } finally {
        cargando.desactivar()
      }
    }

    /*************
    * Validaciones
    **************/
    const reglas = {
      sintomas: { required },
    }

    const v$ = useVuelidate(reglas, citaMedica)
    setValidador(v$.value)

    /********
     * Hooks
     ********/
    onConsultado(async () => {
      empleado.hydrate(new Empleado())
      if (citaMedica.paciente_id) await consultarEmpleado(citaMedica.paciente_id)
    })

    onBeforeModificar(() => {
      citaMedica.fecha_hora_cita = formatearFechaHora(fecha_cita_medica.value, hora_cita_medica.value)
      citaMedica.paciente = citaMedica.paciente_id
    })

    onReestablecer(() => {
      hora_cita_medica.value = null
      fecha_cita_medica.value = null
      citaMedica.estado_cita_medica = estadosCitaMedica.PENDIENTE
    })

    /*******
     * Init
     *******/
    citaMedica.estado_cita_medica = estadosCitaMedica.PENDIENTE
    citaMedica.paciente = authenticationStore.user.id
    consultarEmpleado(authenticationStore.user.id)

    return {
      v$,
      mixin,
      modales,
      citaMedica,
      configuracionColumnasCitaMedica,
      tabCita,
      filtrarCitaMedica,
      tabOptionsEstadosCitaMedica,
      empleado,
      estadosCitaMedica,
      mostrarAgendado: computed(() => citaMedica.estado_cita_medica === estadosCitaMedica.AGENDADO),
      esPaciente: computed(() => citaMedica.paciente_id === authenticationStore.user.id),
      esMedico: computed(() => authenticationStore.esMedico && citaMedica.estado_cita_medica !== estadosCitaMedica.PENDIENTE),
      maskFecha,
      fecha_cita_medica,
      hora_cita_medica,
      // Botones tabla
      btnCancelarCita,
      btnRechazar,
      btnDiagnosticoReceta,
      btnAgendarCita,
    }
  }
})
