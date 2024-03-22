// Dependencias
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { useAuthenticationStore } from 'stores/authentication'
import { Ref, defineComponent, reactive, ref } from 'vue'
import { tiposEnfermedades } from 'config/utils/medico'
import { required } from 'shared/i18n-validators'
import { useMedicoStore } from 'stores/medico'
import useVuelidate from '@vuelidate/core'

// Componentes
import SimpleLayout from 'src/shared/contenedor/modules/simple/view/SimpleLayout.vue'
import DetallePaciente from 'medico/gestionarPacientes/view/DetallePaciente.vue'
import ButtonSubmits from 'components/buttonSubmits/buttonSubmits.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { ConsultaMedicaController } from '../infraestructure/ConsultaMedicaController'
import { CieController } from 'pages/medico/cie/infraestructure/CieController'
import { Empleado } from 'pages/recursosHumanos/empleados/domain/Empleado'
import { ConsultaMedica } from '../domain/ConsultaMedica'
import { Cie } from 'pages/medico/cie/domain/Cie'
import { DiagnosticoCitaMedica } from '../domain/DiagnosticoCitaMedica'
import { DiagnosticoCitaMedicaController } from '../infraestructure/DiagnosticoCitaMedicaController'
import { acciones } from 'config/utils'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'


export default defineComponent({
  name: 'diagnosticos_recetas',
  components: {
    SimpleLayout,
    DetallePaciente,
    ButtonSubmits,
  },
  emits: ['cerrar-modal'],
  setup(props, { emit }) {
    /*********
     * Stores
     *********/
    const authenticationStore = useAuthenticationStore()
    const medicoStore = useMedicoStore()

    /****************
     * Controladores
     ****************/
    const empleadoController = new EmpleadoController()
    const consultaController = new ConsultaMedicaController()

    /***********
     * Variable
     ***********/
    const empleado = reactive(new Empleado())
    const cargando = new StatusEssentialLoading()
    const tabsEnfermedades = ref(tiposEnfermedades.HISTORIAL_CLINICO)
    const enfermedadesSeleccionadas: Ref<DiagnosticoCitaMedica[]> = ref([])

    /********
    * Mixin
    *********/
    const mixin = new ContenedorSimpleMixin(ConsultaMedica, consultaController)
    const { entidad: consulta, accion, listadosAuxiliares, listado, disabled } = mixin.useReferencias()
    const { setValidador, cargarVista, obtenerListados, listar } = mixin.useComportamiento()
    const { onBeforeGuardar, onReestablecer, onListado } = mixin.useHooks()

    cargarVista(async () => {
      await obtenerListados({
        enfermedades: new CieController(),
      })
    })

    /************
     * Funciones
     ************/
    const { enfermedades, filtrarEnfermedades } = useFiltrosListadosSelects(listadosAuxiliares)

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
      diagnosticos: { required },
    }

    const v$ = useVuelidate(reglas, consulta)
    setValidador(v$.value)

    /*********
     * Hooks
     *********/
    onBeforeGuardar(() => {
      consulta.diagnosticos = enfermedadesSeleccionadas.value.map((enfermedad: any) => {
        const diagnostico = new DiagnosticoCitaMedica()
        diagnostico.cie = enfermedad.id
        diagnostico.recomendacion = enfermedad.recomendacion
        return diagnostico
      })

      // console.log(consulta)
    })

    onReestablecer(() => {
      enfermedadesSeleccionadas.value = []
      emit('cerrar-modal')
    })

    const consultarConsulta = async () => {
      const filtro = { registro_empleado_examen_id: consulta.registro_empleado_examen, cita_medica_id: consulta.cita_medica }
      const { result } = await consultaController.listar(filtro)
      consulta.hydrate(result[0])
      enfermedadesSeleccionadas.value = consulta.diagnosticos
      accion.value = consulta.id ? acciones.consultar : acciones.nuevo
    }

    /*******
    * Init
    *******/
    if (medicoStore.empleado) {
      empleado.hydrate(medicoStore.empleado)
    } else {
      consultarEmpleado(authenticationStore.user.id)
    }

    consulta.cita_medica = medicoStore.idCita
    consulta.registro_empleado_examen = medicoStore.idRegistroEmpleadoExamen

    consultarConsulta()
    listar({ empleado_id: medicoStore.empleado?.id })

    return {
      v$,
      mixin,
      disabled,
      listado,
      consulta,
      empleado,
      enfermedades,
      filtrarEnfermedades,
      enfermedadesSeleccionadas,
      tiposEnfermedades,
      tabsEnfermedades,
    }
  }
})
