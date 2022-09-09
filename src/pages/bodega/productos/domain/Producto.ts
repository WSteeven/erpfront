import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Producto extends EntidadAuditable {
  categoria_id?: number
  codigo_barras: string | null
  condicion_id?:number
  descripcion: string|null
  hilo_id?: number
  modelo_id?: number
  nombre_id?: number
  precio?: number
  punta_a?:number
  punta_b?:number
  punta_corte?:number
  serial: string|null
  tipo_fibra_id?: number

  constructor(){
    super()
    this.categoria_id = undefined
    this.codigo_barras= null
    this.condicion_id= undefined
    this.descripcion= null
    this.hilo_id=undefined
    this.modelo_id=undefined
    this.nombre_id=undefined
    this.precio=undefined
    this.punta_a=undefined
    this.punta_b=undefined
    this.punta_corte=undefined
    this.serial=null
    this.tipo_fibra_id=undefined
  }
}
