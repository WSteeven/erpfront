import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Comision extends EntidadAuditable {
  desde: number | null
  hasta: number | null
  comision:number|null

  constructor() {
    super()
    this.desde = null
    this.hasta = null
    this.comision = null
  }
}
