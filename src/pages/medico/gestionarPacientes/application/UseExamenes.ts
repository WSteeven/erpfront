import { ExamenController } from "pages/medico/examenes/infraestructure/ExamenController"
import { ref } from "vue"
import { EstadoSolicitudExamenController } from "../infraestructure/EstadoSolicitudExamenController"

export function useExamenes() {
  /***************
   * Controllers
   ***************/
  const examenController = new ExamenController()
  const estadoSolicitudExamenController = new EstadoSolicitudExamenController()

  /************
   * Variables
   ************/
  const examenes = ref([])

  /************
   * Funciones
   ************/
  const consultarExamenes = async () => {
    const { result } = await examenController.listar()
    examenes.value = result
  }

  const consultarExamenesSolicitados = async (tab: number) => {
    const { result } = await estadoSolicitudExamenController.listar({ estado_examen_id: tab })
    examenes.value = result
  }

  return {
    // variables
    examenes,
    // funciones
    consultarExamenes,
    consultarExamenesSolicitados,
  }
}
