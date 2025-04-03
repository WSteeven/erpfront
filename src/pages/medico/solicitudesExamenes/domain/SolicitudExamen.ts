import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { ExamenSolicitado } from './ExamenSolicitado'

export class SolicitudExamen extends EntidadAuditable {
  codigo: string | null
  observacion: string | null
  observacion_autorizador: string | null
  registro_empleado_examen: number | null
  estado_solicitud_examen: number | null
  cantidad_examenes_solicitados: number | null
  examenes_solicitados: ExamenSolicitado[]
  empleado?: string | null
  empleado_id?: number | null
  departamento: string | null
  canton: number | null
  autorizador: number | null
  solicitante: number | null
  autorizacion: string | null

  constructor() {
    super()
    this.codigo = null
    this.observacion = null
    this.observacion_autorizador = null
    this.registro_empleado_examen = null
    this.estado_solicitud_examen = null
    this.cantidad_examenes_solicitados = null
    this.examenes_solicitados = []
    this.empleado = null
    this.empleado_id = null
    this.departamento = null
    this.canton = null
    this.autorizador = null
    this.solicitante = null
    this.autorizacion = null
  }
}
