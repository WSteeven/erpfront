import { ExamenController } from "pages/medico/examenes/infraestructure/ExamenController"
import { ref } from "vue"
import { EstadoSolicitudExamenController } from "../infraestructure/EstadoSolicitudExamenController"
import { StatusEssentialLoading } from "components/loading/application/StatusEssentialLoading"

export function useExamenes() {
  /***************
   * Controllers
   ***************/
  const examenController = new ExamenController()
  const estadoSolicitudExamenController = new EstadoSolicitudExamenController()

  /************
   * Variables
   ************/
  const cargando = new StatusEssentialLoading()
  const examenes = ref([])

  /************
   * Funciones
   ************/
  const consultarExamenes = async () => {
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

  const consultarExamenesSolicitados = async (tab: number) => {
    try {
      cargando.activar()
      const { result } = await estadoSolicitudExamenController.listar({ estado_examen_id: tab })
      examenes.value = result
    } catch (e) {
      console.log(e)
    } finally {
      cargando.desactivar()
    }
  }

  return {
    // variables
    examenes,
    // funciones
    consultarExamenes,
    consultarExamenesSolicitados,
  }
}
