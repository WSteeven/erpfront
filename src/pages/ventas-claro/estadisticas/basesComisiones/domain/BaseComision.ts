import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class BaseComision extends EntidadAuditable {
  modalidad: string | null
  presupuesto_ventas: number | null
  comisiones:[]

  constructor() {
    super()
    this.modalidad = null
    this.presupuesto_ventas = null
    this.comisiones =[]
  }
}
