// Dependencias
import { estadosCitaMedica, estadosSolicitudesExamenes, tabOptionsEstadosSolicitudExamen } from 'config/utils/medico'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { useAuthenticationStore } from 'stores/authentication'
import { defineComponent, reactive, ref } from 'vue'
import { required } from 'shared/i18n-validators'
import useVuelidate from '@vuelidate/core'
import { maskFecha } from 'config/utils'

// Componentes
import FormularioSolicitudExamen from 'medico/solicitudesExamenes/view/FormularioSolicitudExamen.vue'
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import EstadosSubtareas from 'components/tables/view/EstadosSubtareas.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { configuracionColumnasSolicitudExamen } from '../domain/configuracionColumnasSolicitudExamen'
import { useBotoncesTablaSolicitudExamen } from '../application/UseBotonesTablaSolicitudExamen'
import { SolicitudExamenController } from '../infraestructure/SolicitudExamenController'
import { Empleado } from 'pages/recursosHumanos/empleados/domain/Empleado'
import { ExamenSolicitado } from '../domain/ExamenSolicitado'
import { SolicitudExamen } from '../domain/SolicitudExamen'
import { useMedicoStore } from 'stores/medico'


export default defineComponent({
  components: {
    TabLayoutTabs: TabLayoutFilterTabs2,
    Estado: EstadosSubtareas,
    ModalesEntidad,
    FormularioSolicitudExamen,
  },
  setup() {
    /*********
     * Stores
     *********/
    const authenticationStore = useAuthenticationStore()
    const medicoStore = useMedicoStore()

    /*********
     * Mixin
     *********/
    const mixin = new ContenedorSimpleMixin(SolicitudExamen, new SolicitudExamenController())
    const { entidad: solicitudExamen, accion } = mixin.useReferencias()
    const { setValidador, listar } = mixin.useComportamiento()
    const { onConsultado, onBeforeModificar, onReestablecer } = mixin.useHooks()

    /****************
     * Controladores
     ****************/
    const empleadoController = new EmpleadoController()

    /***********
     * Variable
     ***********/
    const tabSolicitud = ref(estadosSolicitudesExamenes.SOLICITADO.value)
    const empleado = reactive(new Empleado())
    const cargando = new StatusEssentialLoading()
    const fecha_cita_medica = ref()
    const hora_cita_medica = ref()

    /************
     * Funciones
     ************/
    const { btnAprobar } = useBotoncesTablaSolicitudExamen(tabSolicitud)

    const filtrarSolicitudes = (estadoSolicitud: string) => {
      tabSolicitud.value = estadoSolicitud
      const params = { estado_solicitud_examen: tabSolicitud.value, registro_empleado_examen_id: medicoStore.idRegistroEmpleadoExamen }
      listar(params)
    }

    const consultarEmpleado = async (id: number) => {
      cargando.activar()
      const campos = { campos: 'id,foto_url,nombres,apellidos,identificacion,nombre_canton,email,fecha_nacimiento,tipo_sangre,genero,telefono,area_info,nombre_cargo,fecha_ingreso,canton' }
      try {
        const { result } = await empleadoController.consultar(id, campos)
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
      registro_empleado_examen: { required },
    }

    const v$ = useVuelidate(reglas, solicitudExamen)
    setValidador(v$.value)

    /********
     * Hooks
     ********/
    onConsultado(async () => {
      // accion.value = acciones.consultar
      empleado.hydrate(new Empleado())
      if (solicitudExamen.empleado_id) await consultarEmpleado(solicitudExamen.empleado_id)
      solicitudExamen.examenes_solicitados = solicitudExamen.examenes_solicitados.map((examenSolicitado: ExamenSolicitado) => {
        const examenSolicitadoAux = new ExamenSolicitado()
        examenSolicitadoAux.hydrate(examenSolicitado)
        examenSolicitadoAux.fecha_asistencia = examenSolicitado.fecha_hora_asistencia?.split(' ')[0] || null
        examenSolicitadoAux.hora_asistencia = examenSolicitado.fecha_hora_asistencia?.split(' ')[1] || null
        return examenSolicitadoAux
      })
    })

    onBeforeModificar(() => {
      // citaMedica.fecha_hora_cita = formatearFechaHora(fecha_cita_medica.value, hora_cita_medica.value)
      // citaMedica.paciente = citaMedica.paciente_id
    })

    onReestablecer(() => {
      // hora_cita_medica.value = null
      // fecha_cita_medica.value = null
      // citaMedica.estado_cita_medica = estadosCitaMedica.PENDIENTE
    })

    /*******
     * Init
     *******/
    consultarEmpleado(authenticationStore.user.id)

    return {
      v$,
      mixin,
      solicitudExamen,
      configuracionColumnasSolicitudExamen,
      tabSolicitud,
      filtrarSolicitudes,
      tabOptionsEstadosSolicitudExamen,
      empleado,
      estadosCitaMedica,
      maskFecha,
      fecha_cita_medica,
      hora_cita_medica,
      accion,
      // botones tabla
      btnAprobar,
    }
  }
})
