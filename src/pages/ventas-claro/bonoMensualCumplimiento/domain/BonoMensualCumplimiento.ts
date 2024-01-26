import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class BonoMensualCumplimiento extends EntidadAuditable {
  id: number | null
  fecha: string | null
  vendedor: number | null
  vendedor_id:number | null
  vendedor_info: string | null
  bono_id: number |null
  bono:number |null
  bono_info: string | null
  mes:string | null
  cant_ventas : number | null
  valor:number | null

  constructor() {
    super()
    this.id = null
    this.fecha = null
    this.vendedor = null
    this.vendedor_id = null
    this.vendedor_info = null
    this.bono_id = null
    this.bono = null
    this.bono_info = null
    this.mes= null
    this.cant_ventas = null
    this.valor = null
  }
}
