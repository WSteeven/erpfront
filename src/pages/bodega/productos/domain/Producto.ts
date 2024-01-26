import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Producto extends EntidadAuditable {
  nombre: string|null
  categoria: number|null
  unidad_medida: number|null
  cantidad: number |null
  codigo: number |null
  tipo:string |null

  detalles: number |null

  constructor(){
    super()
    this.nombre= null
    this.categoria = null
    this.tipo = null
    this.unidad_medida = null
    this.cantidad= null
    this.codigo= null
    this.detalles= null
  }
}
