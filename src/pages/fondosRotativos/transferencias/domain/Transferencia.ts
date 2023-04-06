import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
export class Transferencia extends EntidadAuditable {
  usuario_envia_info:string|null
  usuario_recibe_info:string|null
  usuario_envia: number |null
  usuario_recibe: number|null
  monto:number |null
  motivo: string | null
  observacion: string | null
  cuenta:number|null
  tarea:number|null
  tarea_info:string|null
  comprobante:string|null
  estado_info:string|null

  constructor() {
    super()
    this.usuario_envia_info=null
    this.usuario_recibe_info=null
    this.usuario_envia=null
    this.usuario_recibe=null
    this.monto=null
    this.motivo='DEVOLUCION'
    this.observacion=null
    this.cuenta=null
    this.tarea=null
    this.tarea_info=null
    this.comprobante=null
    this.estado_info=null
  }
}
