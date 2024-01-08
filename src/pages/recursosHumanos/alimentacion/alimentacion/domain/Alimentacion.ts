import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
export class Alimentacion extends EntidadAuditable {
  id:number | null
  nombre: string | null
  mes: string | null
  finalizado: boolean
  es_quincena: boolean
  constructor() {
    super()
    this.id = null
    this.nombre = null
    this.mes = null
    this.finalizado = false
    this.es_quincena = false
  }
}
