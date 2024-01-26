import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class BonoTrimestralCumplimiento extends EntidadAuditable {
  id: number | null
  trimestre: string | null
  vendedor: number | null
  vendedor_id:number | null
  vendedor_info: string | null
  cant_ventas: number |null
  valor:number | null

  constructor() {
    super()
    this.id = null
    this.trimestre = null
    this.vendedor = null
    this.vendedor_id = null
    this.vendedor_info = null
    this.cant_ventas = null
    this.valor = null
  }
}
