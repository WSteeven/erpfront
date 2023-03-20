import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
export class ReporteSaldoActual extends EntidadAuditable {
  usuario: number | null
  saldo_anterior: number
  constructor() {
    super()
    this.usuario = null
    this.saldo_anterior = 0
  }
}
