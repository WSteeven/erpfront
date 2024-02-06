import { ExamenController } from "pages/medico/examenes/infraestructure/ExamenController"
import { Ref, ref } from "vue"
import { EstadoSolicitudExamenController } from "../modules/solicitudExamen/infraestructure/EstadoSolicitudExamenController"
import { StatusEssentialLoading } from "components/loading/application/StatusEssentialLoading"
import { RegistroEmpleadoExamenController } from "pages/medico/examenes/infraestructure/RegistroEmpleadoExamenController"
import { Examen } from "pages/medico/examenes/domain/Examen"
import { RegistroEmpleadoExamen } from "pages/medico/examenes/domain/RegistroEmpleadoExamen"

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
  const examenes: Ref<Examen[]> = ref([])
  const registros: Ref<RegistroEmpleadoExamen[]> = ref([])

  /************
   * Funciones
   ************/
  const consultarRegistrosEmpleadoExamen = async (params: any) => {
    cargando.activar()
    try {
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

  const consultarExamenesSolicitados = async (tab: number, idRegistroEmpleadoExamen: number) => {
    try {
      cargando.activar()
      const { result } = await estadoSolicitudExamenController.listar({ estado_examen_id: tab, empleado_id: 25, registro_empleado_examen_id: idRegistroEmpleadoExamen })
      examenes.value = result
    } catch (e) {
      console.log(e)
    } finally {
      cargando.desactivar()
    }
  }

  const guardarRegistro = async (motivo: string, idEmpleado: number, tipoProcesoExamen: string) => {
    const registro = new RegistroEmpleadoExamen()
    registro.empleado = idEmpleado
    registro.observacion = motivo
    registro.tipo_proceso_examen = tipoProcesoExamen
    const { result } = await registroEmpleadoExamenController.guardar(registro)
    registros.value.push(result)
  }

  return {
    // variables
    examenes,
    registros,
    // funciones
    consultarRegistrosEmpleadoExamen,
    consultarExamenesSinSolicitar,
    consultarExamenesSolicitados,
    guardarRegistro,
  }
}
