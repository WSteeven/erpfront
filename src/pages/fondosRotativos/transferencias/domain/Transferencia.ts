import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
export class Transferencia extends EntidadAuditable {
  usuario_envia_info:string|null
  usuario_recive_info:string|null
  usuario_envia:number |null
  usuario_recive:number|null
  monto:number |null
  motivo: string | null
  comprobante:string|null

  constructor() {
    super()
    this.usuario_envia_info=null
    this.usuario_recive_info=null
    this.usuario_envia=null
    this.usuario_recive=null
    this.monto=null
    this.motivo=null
    this.comprobante=null
  }
}
