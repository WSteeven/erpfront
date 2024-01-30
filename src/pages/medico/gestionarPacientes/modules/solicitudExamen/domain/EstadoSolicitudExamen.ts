import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable"
import { ExamenSolicitado } from "./ExamenSolicitado"

export class EstadoSolicitudExamen extends EntidadAuditable {
  observacion: string | null
  examenes_solicitados: ExamenSolicitado[]

  constructor() {
    super()
    this.observacion = null
    this.examenes_solicitados = []
  }
}
