import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
export class Modalidad extends EntidadAuditable {
  nombre: string | null
  umbral_minimo: string | null
  constructor() {
    super()
    this.nombre = null
    this.umbral_minimo = null
  }
}
