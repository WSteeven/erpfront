import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable"
import { ExamenSolicitado } from "./ExamenSolicitado"

export class EstadoSolicitudExamen extends EntidadAuditable {
  observacion: string | null
  registro_empleado_examen: number | null
  examenes_solicitados: ExamenSolicitado[]

  constructor() {
    super()
    this.observacion = null
    this.registro_empleado_examen = null
    this.examenes_solicitados = []
  }
}
