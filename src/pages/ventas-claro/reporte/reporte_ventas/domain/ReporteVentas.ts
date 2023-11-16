import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
export class ReporteVentas extends EntidadAuditable {
  mes: string | null
  constructor() {
    super()
    this.mes = null
  }
}
