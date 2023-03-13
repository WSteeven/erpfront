import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
export class Acreditacion extends EntidadAuditable {
  id_tipo_saldo:number|null
  tipo_saldo:string|null
  id_saldo:number |null
  tipo_saldo_info:string|null
  id_tipo_fondo:number |null
  tipo_fondo_info: string | null
  tipo_fondo:string|null
  descripcion_acreditacion:string|null
  saldo_anterior:number | null
  saldo_depositado:number | null
  monto:number | null
  saldo_actual:number | null
  gasto:number | null
  fecha_inicio:Date |null
  fecha_fin:Date|null
  id_usuario:number|null
  usuario:string|null
  usuario_info:string|null
  id_estatus:number|null
  estatus:string|null
  estatus_info:string|null
  transcriptor:string|null
  fecha_trans:Date|null

  constructor() {
    super()
    this.id_tipo_saldo=null
    this.id_saldo=null
    this.tipo_saldo_info=null
    this.tipo_saldo=null
    this.id_tipo_fondo=null
    this.tipo_fondo_info=null
    this.tipo_fondo=null
    this.descripcion_acreditacion=null
    this.saldo_anterior=null
    this.saldo_depositado=null
    this.saldo_actual=null
    this.monto=null
    this.gasto=null
    this.fecha_inicio=null
    this.fecha_fin=null
    this.id_usuario=null
    this.usuario=null
    this.usuario_info=null
    this.id_estatus=null
    this.estatus_info=null
    this.estatus=null
    this.transcriptor = null
    this.fecha_trans = null
  }
}
