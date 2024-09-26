import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class RevisionActualOrganoSistema extends EntidadAuditable {
  organo: number | string | null
  organo_id: number | null
  descripcion: string | null
  ficha_preocupacional: number | null

  constructor() {
    super()
    this.organo = null
    this.organo_id = null
    this.ficha_preocupacional = null
    this.descripcion = null
  }
}
