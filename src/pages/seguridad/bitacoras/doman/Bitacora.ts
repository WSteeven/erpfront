import { ActividadBitacora } from './../modules/actividadBitacora/domain/ActividadBitacora'
import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Bitacora extends EntidadAuditable {
  zona: number | null = null
  jornada: number | null = null
  fecha_hora_inicio_turno: string | null = null
  fecha_hora_fin_turno: string | null = null
  agente_turno: number | null = null
  protector: number | null = null
  conductor: number | null = null
  nombres_agente_turno: number | null = null
  nombres_protector: number | null = null
  nombres_conductor: number | null = null
  observaciones: string | null = null
  prendas_recibidas: number[] = []
  actividades: ActividadBitacora[] = []

  //revision del supervisor

  revisado_por_supervisor= false
  retroalimentacion_supervisor: string | null = null
}
