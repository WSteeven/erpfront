// Dependencias
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { Ref, defineComponent, ref } from 'vue'
import { useMedicoStore } from 'stores/medico'
import { maskFecha } from 'config/utils'

// Componentes
import FormularioSolicitudExamen from 'medico/solicitudesExamenes/view/FormularioSolicitudExamen.vue'
import SimpleLayout from 'shared/contenedor/modules/simple/view/SimpleLayout.vue'

// Logica y controladores
import { LaboratorioClinicoController } from 'medico/laboratoriosMedicos/infraestructure/LaboratorioClinicoController'
import { SolicitudExamenController } from 'pages/medico/solicitudesExamenes/infraestructure/SolicitudExamenController'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { ExamenSolicitado } from 'pages/medico/solicitudesExamenes/domain/ExamenSolicitado'
import { SolicitudExamen } from 'pages/medico/solicitudesExamenes/domain/SolicitudExamen'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { Examen } from 'pages/medico/examenes/domain/Examen'

export default defineComponent({
  name: 'solicitudes_examenes', // Igual que el permiso en backend
  components: {
    FormularioSolicitudExamen,
    SimpleLayout,
  },
  emits: ['guardado', 'cerrar-modal'],
  setup(props, { emit }) {
    /*********
     * Stores
     *********/
    const medicoStore = useMedicoStore()
    const empleado = medicoStore.empleado
    const canton = ref(empleado?.canton)

    /************
     * Variables
     ************/
    const cargando = new StatusEssentialLoading()
    const laboratorioClinicoController = new LaboratorioClinicoController()
    const examenes: Ref<Examen[]> = ref([])

    /********
     * Mixin
     ********/
    const mixin = new ContenedorSimpleMixin(SolicitudExamen, new SolicitudExamenController())
    const { entidad: solicitudExamen, listadosAuxiliares, accion, disabled } = mixin.useReferencias()
    const { guardar } = mixin.useComportamiento()
    const { onReestablecer, onGuardado } = mixin.useHooks()

    /************
     * Funciones
     ************/
    const { cantones, filtrarCantones } = useFiltrosListadosSelects(listadosAuxiliares)

    const consultarLaboratoriosClinicos = async (canton: number) => {
      try {
        cargando.activar()
        const { result } = await laboratorioClinicoController.listar({ canton_id: canton, activo: 1, campos: 'id,nombre' })
        listadosAuxiliares.laboratoriosClinicos = result
      } catch (e) {
        console.log(e)
      } finally {
        cargando.desactivar()
      }
    }

    const asignarLaboratorio = (laboratorioClinico: number, index: number) => {
      if (index === 0) {
        solicitudExamen.examenes_solicitados = solicitudExamen.examenes_solicitados.map((examen: ExamenSolicitado) => {
          examen.laboratorio_clinico = laboratorioClinico
          return examen
        })
      }
    }

    const asignarFecha = (fecha: string, index: number) => {
      if (index === 0) {
        solicitudExamen.examenes_solicitados = solicitudExamen.examenes_solicitados.map((examen: ExamenSolicitado) => {
          examen.fecha_asistencia = fecha
          return examen
        })
      }
    }

    const asignarHora = (hora: string, index: number) => {
      if (index === 0) {
        solicitudExamen.examenes_solicitados = solicitudExamen.examenes_solicitados.map((examen: ExamenSolicitado) => {
          examen.hora_asistencia = hora
          return examen
        })
      }
    }

    /********
     * Hooks
     ********/
    onGuardado((id: number, responseData) => {
      const idExamenesSolicitados = responseData.modelo.examenes_solicitados.map((ex: ExamenSolicitado) => ex.examen as number)
      emit('guardado', { data: { idExamenesSolicitados }, page: 'SolicitudExamenSolicitarPage' })
      emit('cerrar-modal')
    })

    onReestablecer(() => emit('cerrar-modal'))

    /*******
     * Init
     *******/
    solicitudExamen.hydrate(medicoStore.solicitudExamen)
    solicitudExamen.registro_empleado_examen = medicoStore.idRegistroEmpleadoExamen ?? null
    accion.value = medicoStore.accion

    return {
      mixin,
      solicitudExamen,
      empleado,
      examenes,
      listadosAuxiliares,
      maskFecha,
      canton,
      cantones,
      filtrarCantones,
      accion,
      disabled,
      // funciones
      consultarLaboratoriosClinicos,
      guardar,
      asignarLaboratorio,
      asignarFecha,
      asignarHora,
    }
  }
})
