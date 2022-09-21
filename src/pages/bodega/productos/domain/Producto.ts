import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Producto extends EntidadAuditable {
  nombre: string|null
  categoria: number|null
  cantidad: number |null

  constructor(){
    super()
    this.nombre= null
    this.categoria = null
    this.cantidad= null
  }
}
