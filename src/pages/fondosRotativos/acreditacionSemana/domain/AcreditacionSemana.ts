import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
export class AcreditacionSemana extends EntidadAuditable {
  semana: string | null
  constructor() {
    super()
    this.semana = null
  }
}
