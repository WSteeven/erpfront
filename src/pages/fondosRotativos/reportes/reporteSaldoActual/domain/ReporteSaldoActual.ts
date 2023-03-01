import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
export class ReporteSaldoActual extends EntidadAuditable {
  usuario: number | null
  constructor() {
    super()
    this.usuario = null
  }
}
