import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
export class Transferencia extends EntidadAuditable {
  usuario_envia_info:string|null
  usuario_recibe_info:string|null
  usuario_envia: number |null
  usuario_recibe: number|null
  monto:number |null
  motivo: string | null
  cuenta:number|null
  comprobante:string|null

  constructor() {
    super()
    this.usuario_envia_info=null
    this.usuario_recibe_info=null
    this.usuario_envia=null
    this.usuario_recibe=null
    this.monto=null
    this.motivo='DEVOLUCION'
    this.cuenta=null
    this.comprobante=null
  }
}
