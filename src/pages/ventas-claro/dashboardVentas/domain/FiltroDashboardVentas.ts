import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class FiltroDashboardVentas extends EntidadAuditable {
  fecha_inicio: string | null
  fecha_fin: string | null
  vendedor: number | null

  constructor() {
    super()
    this.fecha_inicio = null
    this.fecha_fin = null
    this.vendedor = null
  }
}
