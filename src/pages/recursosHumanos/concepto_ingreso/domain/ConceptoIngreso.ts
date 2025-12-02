import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable';

export class ConceptoIngreso extends EntidadAuditable {
  nombre: string | null
  abreviatura: string | null
  calculable_iess: boolean

  constructor() {
    super()
    this.nombre = null
    this.abreviatura = null
    this.calculable_iess = false

  }
}
