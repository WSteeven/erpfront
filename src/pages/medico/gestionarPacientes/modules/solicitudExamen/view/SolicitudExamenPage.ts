// Dependencias
import { useMedicoStore } from 'stores/medico'
import { Ref, defineComponent, ref } from 'vue'

// Componentes
import DetallePaciente from '../../../view/DetallePaciente.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { EstadoSolicitudExamenController } from '../infraestructure/EstadoSolicitudExamenController'
import { EstadoSolicitudExamen } from '../domain/EstadoSolicitudExamen'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { ExamenController } from 'pages/medico/examenes/infraestructure/ExamenController'
import { Examen } from 'pages/medico/examenes/domain/Examen'

export default defineComponent({
  components: {
    DetallePaciente,
  },
  setup() {
    const medicoStore = useMedicoStore()
    const empleado = medicoStore.empleado
    const detalleExamen = medicoStore.detalleExamen

    const cargando = new StatusEssentialLoading()
    const examenController = new ExamenController()
    const examenes: Ref<Examen[]> = ref([])

    const mixin = new ContenedorSimpleMixin(EstadoSolicitudExamen, new EstadoSolicitudExamenController())
    const { entidad: solicitud } = mixin.useReferencias()

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

    /************
     * Funciones
     ************/
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

    return {
      mixin,
      solicitud,
      empleado,
      detalleExamen,
      examenes,
    }
  }
})
