import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class FiltroReporteMaterial extends EntidadAuditable {
  mes_anio: string | null
  grupo: string | null
  cliente: string | null
  tipo_trabajo: number | null

  constructor() {
    super()
    this.mes_anio = null
    this.grupo = null
    this.cliente = null
    this.tipo_trabajo = null
  }
}
