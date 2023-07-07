import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class FiltroReporteMaterial extends EntidadAuditable {
  mes_anio: string | null
  grupo: string | null
  cliente: number | null
  tipo_trabajo: number | null
  causa_intervencion: number | null

  constructor() {
    super()
    this.mes_anio = null
    this.grupo = null
    this.cliente = null
    this.tipo_trabajo = null
    this.causa_intervencion = null
  }
}
