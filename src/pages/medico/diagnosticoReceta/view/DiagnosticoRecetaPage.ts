// Dependencias
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { tiposCitaMedica, tiposEnfermedades } from 'config/utils/medico'
import { useAuthenticationStore } from 'stores/authentication'
import { computed, defineComponent, reactive, ref } from 'vue'
import { useNotificaciones } from 'shared/notificaciones'
import { required } from 'shared/i18n-validators'
import { useMedicoStore } from 'stores/medico'
import useVuelidate from '@vuelidate/core'
import { acciones } from 'config/utils'
import { useRoute } from 'vue-router'

// Componentes
import ContantesVitales from 'medico/gestionarPacientes/modules/seccionesFichas/constantesVitales/ContantesVitales.vue'
import SimpleLayout from 'src/shared/contenedor/modules/simple/view/SimpleLayout.vue'
import DetallePaciente from 'medico/gestionarPacientes/view/DetallePaciente.vue'
import GestorArchivos from 'components/gestorArchivos/GestorArchivos.vue'
import ButtonSubmits from 'components/buttonSubmits/buttonSubmits.vue'

// Logica y controladores
import { ConstanteVital } from 'pages/medico/gestionarPacientes/modules/seccionesFichas/domain/ConstanteVital'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { ConsultaMedicaController } from '../infraestructure/ConsultaMedicaController'
import { CieController } from 'pages/medico/cie/infraestructure/CieController'
import { Empleado } from 'pages/recursosHumanos/empleados/domain/Empleado'
import { DiagnosticoCitaMedica } from '../domain/DiagnosticoCitaMedica'
import { ConsultaMedica } from '../domain/ConsultaMedica'


export default defineComponent({
  name: 'diagnosticos_recetas',
  components: {
    SimpleLayout,
    DetallePaciente,
    ButtonSubmits,
    ContantesVitales,
    GestorArchivos,
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
    const enRutaAccidentes = computed(() => useRoute().name === 'accidentes')
    const idEntidad = ref()
    const refArchivo = ref()

    /********
    * Mixin
    *********/
    const mixin = new ContenedorSimpleMixin(ConsultaMedica, consultaController)
    const { entidad: consulta, accion, listadosAuxiliares, listado, disabled } = mixin.useReferencias()
    const { setValidador, cargarVista, obtenerListados, listar, editarParcial, guardar, reestablecer } = mixin.useComportamiento()
    const { onBeforeGuardar, onReestablecer, onGuardado, onModificado, onConsultado, onListado } = mixin.useHooks()

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

    const consultarConsulta = async (filtro) => {
      // const filtro = { registro_empleado_examen_id: consulta.registro_empleado_examen, cita_medica_id: consulta.cita_medica }
      listar(filtro)
      // if (result[0]) consulta.hydrate(result[0])
    }
    /* const consultarConsulta = async () => {
      const filtro = { registro_empleado_examen_id: consulta.registro_empleado_examen, cita_medica_id: consulta.cita_medica }
      const { result } = await consultaController.listar(filtro)
      if (result[0]) consulta.hydrate(result[0])
      accion.value = consulta.id ? acciones.consultar : acciones.nuevo
    } */

    const darAlta = () => {
      confirmar('¿Está seguro del dar de alta al paciente?', () => editarParcial(consulta.id, { dado_alta: true }))
    }

    const guardarYDarAlta = () => {
      consulta.dado_alta = true
      guardar(consulta)
    }

    const hidratarConstanteVital = (constanteVital: ConstanteVital) => consulta.constante_vital.hydrate(constanteVital)

    const subirArchivos = async () => await refArchivo.value.subir()

    /*************
   * Validaciones
   **************/
    const reglas = {
      diagnosticos: { required },
      constante_vital: {
        presion_arterial: { required },
        temperatura: { required },
        frecuencia_cardiaca: { required },
        saturacion_oxigeno: { required },
        frecuencia_respiratoria: { required },
        peso: { required },
        talla: { required },
        indice_masa_corporal: { required },
        perimetro_abdominal: { required },
      }
    }

    const v$ = useVuelidate(reglas, consulta)
    setValidador(v$.value)

    /*********
     * Hooks
     *********/
    onListado(() => {
      if (listado.value[0]) consulta.hydrate(listado.value[0])
      if (!enRutaAccidentes.value) {
        accion.value = consulta.id ? (authenticationStore.esMedico || authenticationStore.esAdministrador ? acciones.editar : acciones.consultar) : acciones.nuevo
      }
      setTimeout(() => refArchivo.value.listarArchivosAlmacenados(consulta.id), 1)
    })

    onBeforeGuardar(() => {
      consulta.diagnosticos = consulta.diagnosticos.map((enfermedad: any) => {
        const diagnostico = new DiagnosticoCitaMedica()
        diagnostico.id = enfermedad.id
        diagnostico.codigo_nombre_enfermedad = enfermedad.codigo_nombre_enfermedad
        diagnostico.codigo = enfermedad.codigo
        diagnostico.nombre_enfermedad = enfermedad.nombre_enfermedad
        diagnostico.cie = enfermedad.id
        diagnostico.recomendacion = enfermedad.recomendacion
        return diagnostico
      })
    })

    onReestablecer(() => {
      consulta.diagnosticos = []
      refArchivo.value.limpiarListado()
    })

    onGuardado(async (id, responseData) => {
      idEntidad.value = id
      setTimeout(async () => await subirArchivos(), 1)
      emit('guardado', { page: 'DiagnosticoRecetaPage', entidad: responseData.modelo, hook: 'onGuardado', data: {} }) // Para CitaMedicaPage
      emit('cerrar-modal')
    })

    onModificado((id, responseData) => {
      idEntidad.value = id
      setTimeout(async () => {
        await subirArchivos(), 1
        emit('guardado', { page: 'DiagnosticoRecetaPage', entidad: responseData.modelo, hook: 'onModificado' })
      })
      // emit('cerrar-modal')
    })

    /*******
    * Init
    *******/
    if (!enRutaAccidentes.value) {
      consulta.cita_medica = medicoStore.idCita
      consulta.registro_empleado_examen = medicoStore.idRegistroEmpleadoExamen
      if (medicoStore.empleado) {
        empleado.hydrate(medicoStore.empleado)
      } else {
        consultarEmpleado(authenticationStore.user.id)
      }
      console.log(consulta.cita_medica)
      const filtro = { registro_empleado_examen_id: consulta.registro_empleado_examen, cita_medica_id: consulta.cita_medica }
      if (medicoStore.empleado?.id) listar({ empleado_id: medicoStore.empleado?.id })
      consultarConsulta(filtro)
    }

    const esAccidenteTrabajo = computed(() => medicoStore.tipoCitaMedica === tiposCitaMedica.ACCIDENTE_DE_TRABAJO.value)

    return {
      v$,
      mixin,
      idEntidad,
      refArchivo,
      accion,
      acciones,
      disabled,
      listado,
      consulta,
      empleado,
      enfermedades,
      filtrarEnfermedades,
      // esConsultable: computed(() => accion.value === acciones.consultar),
      esAccidenteTrabajo,
      tipoCitaMedica: computed(() => {
        if (medicoStore.tipoCitaMedica === tiposCitaMedica.ENFERMEDAD_COMUN.value) return tiposCitaMedica.ENFERMEDAD_COMUN.label
        else if (esAccidenteTrabajo.value) return tiposCitaMedica.ACCIDENTE_DE_TRABAJO.label
      }),
      darAlta,
      guardarYDarAlta,
      // enfermedadesSeleccionadas,
      tiposEnfermedades,
      tabsEnfermedades,
      hidratarConstanteVital,
      consultarConsulta,
      reestablecer,
      consultarEmpleado,
      enRutaAccidentes,
    }
  }
})
