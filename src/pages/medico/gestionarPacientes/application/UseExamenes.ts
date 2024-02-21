// Dependencias
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { Ref, ref } from 'vue'

// Logica y controladores
import { EstadoSolicitudExamenController } from '../modules/solicitudExamen/infraestructure/EstadoSolicitudExamenController'
import { RegistroEmpleadoExamenController } from 'pages/medico/examenes/infraestructure/RegistroEmpleadoExamenController'
import { RegistroEmpleadoExamen } from 'pages/medico/examenes/domain/RegistroEmpleadoExamen'
import { ExamenController } from 'pages/medico/examenes/infraestructure/ExamenController'
import { Examen } from 'pages/medico/examenes/domain/Examen'
import { SolicitudExamen } from '../domain/SolicitudExamen'

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
  const solicitudesExamenes: Ref<SolicitudExamen[]> = ref([])
  const listadoGeneral: Ref<Examen | SolicitudExamen[]> = ref([])

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
      listadoGeneral.value = result
    } catch (e) {
      console.log(e)
    } finally {
      cargando.desactivar()
    }
  }

  /*const consultarExamenesSolicitados2 = async (tab: number, idRegistroEmpleadoExamen: number) => {
    try {
      cargando.activar()
      const { result } = await estadoSolicitudExamenController.listar({ estado_examen_id: tab, empleado_id: 25, registro_empleado_examen_id: idRegistroEmpleadoExamen })
      examenes.value = result
    } catch (e) {
      console.log(e)
    } finally {
      cargando.desactivar()
    }
  }*/

  const consultarSolicitudesExamenes = async (tab: number, idRegistroEmpleadoExamen: number) => {
    cargando.activar()
    try {
      const { result } = await estadoSolicitudExamenController.listar({ estado_examen_id: tab, registro_empleado_examen_id: idRegistroEmpleadoExamen, solicitudes: true })
      solicitudesExamenes.value = result
      listadoGeneral.value = result
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
    solicitudesExamenes,
    listadoGeneral,
    registros,
    // funciones
    consultarRegistrosEmpleadoExamen,
    consultarExamenesSinSolicitar,
    consultarSolicitudesExamenes,
    guardarRegistro,
  }
}
