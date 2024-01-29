import { ExamenController } from "pages/medico/examenes/infraestructure/ExamenController"
import { ref } from "vue"
import { EstadoSolicitudExamenController } from "../modules/solicitudExamen/infraestructure/EstadoSolicitudExamenController"
import { StatusEssentialLoading } from "components/loading/application/StatusEssentialLoading"
import { RegistroEmpleadoExamenController } from "pages/medico/examenes/infraestructure/RegistroEmpleadoExamenController"

export function useExamenes() {
  /***************
   * Controllers
   ***************/
  const registroEmpleadoExamenController = new RegistroEmpleadoExamenController()
  const examenController = new ExamenController()
  const estadoSolicitudExamenController = new EstadoSolicitudExamenController()

  /************
   * Variables
   ************/
  const cargando = new StatusEssentialLoading()
  const examenes = ref([])
  const registros = ref([])

  /************
   * Funciones
   ************/
  const consultarRegistrosEmpleadoExamen = async (params: any) => {
    try {
      cargando.activar()
      const { result } = await registroEmpleadoExamenController.listar(params)
      registros.value = result
    } catch (e) {
      console.log(e)
    } finally {
      cargando.desactivar()
    }
  }

  const consultarExamenesSinSolicitar = async (params: any) => {
    try {
      cargando.activar()
      const { result } = await examenController.listar({ pendiente_solicitar: true, ...params })
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
      const { result } = await estadoSolicitudExamenController.listar({ estado_examen_id: tab, empleado_id: 25 })
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
    registros,
    // funciones
    consultarRegistrosEmpleadoExamen,
    consultarExamenesSinSolicitar,
    consultarExamenesSolicitados,
  }
}
