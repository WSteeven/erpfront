import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class AntecedenteFamiliar extends EntidadAuditable {
  tipo_antecedente_familiar: number | string | null
  tipo_antecedente_familiar_id: number | null
  descripcion: number | null
  parentesco: string | null

  constructor() {
    super()
    this.tipo_antecedente_familiar = null
    this.tipo_antecedente_familiar_id = null
    this.descripcion = null
    this.parentesco = null
  }
}
