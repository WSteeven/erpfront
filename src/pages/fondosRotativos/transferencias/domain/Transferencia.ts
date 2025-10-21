import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
export class Transferencia extends EntidadAuditable {
  fecha: Date | null
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
  estado:number|null
  motivo_aprobacion_tercero:string|null
  usuario_tercero_aprueba:string|null
  usuario_tercero_aprueba_id:number|null
  estado_info:string|null
  es_devolucion: boolean

  constructor() {
    super()
    this.fecha=null
    this.usuario_envia_info=null
    this.usuario_recibe_info=null
    this.usuario_envia=null
    this.usuario_recibe=null
    this.monto=null
    this.motivo='TRANSFERENCIA ENTRE USUARIOS'
    this.observacion=null
    this.cuenta=null
    this.tarea=null
    this.tarea_info=null
    this.comprobante=null
    this.estado=null
    this.estado_info=null
    this.es_devolucion = false
    this.motivo_aprobacion_tercero = null
    this.usuario_tercero_aprueba = null
    this.usuario_tercero_aprueba_id = null
  }
}
