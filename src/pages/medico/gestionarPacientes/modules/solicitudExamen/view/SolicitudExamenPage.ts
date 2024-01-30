// Dependencias
import { useMedicoStore } from 'stores/medico'
import { Ref, computed, defineComponent, ref } from 'vue'

// Componentes
import DetallePaciente from '../../../view/DetallePaciente.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { EstadoSolicitudExamenController } from '../infraestructure/EstadoSolicitudExamenController'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { ExamenController } from 'pages/medico/examenes/infraestructure/ExamenController'
import { EstadoSolicitudExamen } from '../domain/EstadoSolicitudExamen'
import { ExamenSolicitado } from '../domain/ExamenSolicitado'
import { Examen } from 'pages/medico/examenes/domain/Examen'

export default defineComponent({
  components: {
    DetallePaciente,
  },
  setup() {
    const medicoStore = useMedicoStore()
    const empleado = medicoStore.empleado
    // const examen = medicoStore.examen
    const examenesSolicitados = medicoStore.examenesSolicitados

    const cargando = new StatusEssentialLoading()
    const examenController = new ExamenController()
    const examenes: Ref<Examen[]> = ref([])

    const mixin = new ContenedorSimpleMixin(EstadoSolicitudExamen, new EstadoSolicitudExamenController())
    const { entidad: estadoSolicitudExamen } = mixin.useReferencias()

    /************
     * Funciones
     ************/
    const consultarTodosExamenes = async () => {
      try {
        cargando.activar()
        const { result } = await examenController.listar()
        examenes.value = result
      } catch (e) {
        console.log(e)
      } finally {
        cargando.desactivar()
      }
    }

    const guardar = async () => {
      //
    }

    const cancelar = () => {
      //
    }

    /*******
     * Init
     *******/
    consultarTodosExamenes()

    examenesSolicitados?.forEach((examen: Examen) => {
      const examenSolicitado = new ExamenSolicitado()
      // console.log(examen)
      examenSolicitado.examen_id = examen.id
      estadoSolicitudExamen.examenes_solicitados.push(examenSolicitado)
    })

    return {
      mixin,
      estadoSolicitudExamen,
      empleado,
      examenes,
    }
  }
})
