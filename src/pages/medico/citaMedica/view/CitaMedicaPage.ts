// Dependencias
import { configuracionColumnasCitaMedica } from '../domain/configuracionColumnasCitaMedica'
import { estadosCitaMedica, tabOptionsEstadosCitaMedica } from 'config/utils/medico'
import { computed, defineComponent, reactive, ref } from 'vue'
import { CitaMedica } from '../domain/CitaMedica'
import { required } from 'shared/i18n-validators'

// Componentes
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import DetallePaciente from 'medico/gestionarPacientes/view/DetallePaciente.vue'
import EstadosSubtareas from 'components/tables/view/EstadosSubtareas.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { CitaMedicaController } from '../infraestructure/CitaMedicaController'
import { Empleado } from 'pages/recursosHumanos/empleados/domain/Empleado'
import useVuelidate from '@vuelidate/core'
import { useAuthenticationStore } from 'stores/authentication'

export default defineComponent({
  components: {
    TabLayoutTabs: TabLayoutFilterTabs2,
    Estado: EstadosSubtareas,
    DetallePaciente,
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
    const { entidad: citaMedica, listadosAuxiliares, accion, disabled } = mixin.useReferencias()
    const { setValidador } = mixin.useComportamiento()

    /****************
     * Controladores
     ****************/
    const empleadoController = new EmpleadoController()

    /***********
     * Variable
     ***********/
    const tabActual = ref(estadosCitaMedica.PENDIENTE)
    const empleado = reactive(new Empleado())

    /************
     * Funciones
     ************/
    const filtrarCitaMedica = () => {
      //
    }

    const consultarEmpleado = async (id: number) => {
      const { result } = await empleadoController.consultar(id)
      empleado.hydrate(result)
    }

    /*************
    * Validaciones
    **************/
    const reglas = {
      sintomas: { required },
    }

    const v$ = useVuelidate(reglas, citaMedica)
    setValidador(v$.value)

    /*******
     * Init
     *******/
    citaMedica.estado = estadosCitaMedica.PENDIENTE
    citaMedica.paciente = authenticationStore.user.id
    consultarEmpleado(authenticationStore.user.id)

    return {
      v$,
      mixin,
      citaMedica,
      configuracionColumnasCitaMedica,
      tabActual,
      filtrarCitaMedica,
      tabOptionsEstadosCitaMedica,
      empleado,
      estadosCitaMedica,
      mostrarAgendado: computed(() => citaMedica.estado === estadosCitaMedica.AGENDADO)
    }
  }
})
