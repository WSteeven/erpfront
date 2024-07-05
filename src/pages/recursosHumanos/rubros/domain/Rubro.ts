import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable';

export class Rubro extends EntidadAuditable {
  nombre_rubro: string | null
  valor_rubro: number | null
  es_porcentaje: boolean

  constructor() {
    super()
    this.nombre_rubro = null
    this.valor_rubro = null
    this.es_porcentaje = true
  }
}
