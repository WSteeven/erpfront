// Dependencias
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { useAuthenticationStore } from 'stores/authentication'
import { tiposCitaMedica, tiposEnfermedades } from 'config/utils/medico'
import { computed, defineComponent, reactive, ref } from 'vue'
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
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { DiagnosticoCitaMedica } from '../domain/DiagnosticoCitaMedica'
import { ConsultaMedica } from '../domain/ConsultaMedica'
import { acciones } from 'config/utils'
import { useNotificaciones } from 'shared/notificaciones'


export default defineComponent({
  name: 'diagnosticos_recetas',
  components: {
    SimpleLayout,
    DetallePaciente,
    ButtonSubmits,
  },
  emits: ['cerrar-modal', 'guardado'],
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
    const tabsEnfermedades = ref(tiposEnfermedades.COMUNES)
    const { confirmar } = useNotificaciones()

    /********
    * Mixin
    *********/
    const mixin = new ContenedorSimpleMixin(ConsultaMedica, consultaController)
    const { entidad: consulta, accion, listadosAuxiliares, listado, disabled } = mixin.useReferencias()
    const { setValidador, cargarVista, obtenerListados, listar, editarParcial } = mixin.useComportamiento()
    const { onBeforeGuardar, onReestablecer, onGuardado, onModificado } = mixin.useHooks()

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

    const consultarConsulta = async () => {
      const filtro = { registro_empleado_examen_id: consulta.registro_empleado_examen, cita_medica_id: consulta.cita_medica }
      const { result } = await consultaController.listar(filtro)
      if (result[0]) consulta.hydrate(result[0])
      accion.value = consulta.id ? acciones.consultar : acciones.nuevo
    }

    const darAlta = () => {
      confirmar('¿Está seguro del dar de alta al paciente?', () => editarParcial(consulta.id, { dado_alta: true }))
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
      consulta.diagnosticos = consulta.diagnosticos.map((enfermedad: any) => {
        const diagnostico = new DiagnosticoCitaMedica()
        diagnostico.cie = enfermedad.id
        diagnostico.recomendacion = enfermedad.recomendacion
        return diagnostico
      })
    })

    onReestablecer(() => {
      consulta.diagnosticos = []
      emit('cerrar-modal')
    })

    onGuardado((id, responseData) => {
      emit('guardado', { page: 'DiagnosticoRecetaPage', entidad: responseData.modelo, hook: 'onGuardado' })
    })

    onModificado((id, responseData) => {
      emit('guardado', { page: 'DiagnosticoRecetaPage', entidad: responseData.modelo, hook: 'onModificado' })
    })

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

    const esAccidenteTrabajo = computed(() => medicoStore.tipoCitaMedica === tiposCitaMedica.ACCIDENTE_DE_TRABAJO.value)

    return {
      v$,
      mixin,
      disabled,
      listado,
      consulta,
      empleado,
      enfermedades,
      filtrarEnfermedades,
      esConsultable: computed(() => accion.value === acciones.consultar),
      esAccidenteTrabajo,
      tipoCitaMedica: computed(() => {
        if (medicoStore.tipoCitaMedica === tiposCitaMedica.ENFERMEDAD_COMUN.value) return tiposCitaMedica.ENFERMEDAD_COMUN.label
        else if (esAccidenteTrabajo.value) return tiposCitaMedica.ACCIDENTE_DE_TRABAJO.label
      }),
      darAlta,
      // enfermedadesSeleccionadas,
      tiposEnfermedades,
      tabsEnfermedades,
    }
  }
})
