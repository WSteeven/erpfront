import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class BaseComision extends EntidadAuditable {
  modalidad: string | null
  presupuesto_ventas: number | null
  comisiones: []
  bono_comision_semanal:number|null

  constructor() {
    super()
    this.modalidad = null
    this.presupuesto_ventas = null
    this.comisiones = []
    this.bono_comision_semanal = null
  }
}
