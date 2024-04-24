import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class RevisionActualOrganoSistema extends EntidadAuditable {
  organo_sistema: number | string | null
  descripcion: string | null
  ficha_preocupacional: number | null

  constructor() {
    super()
    this.organo_sistema = null
    this.ficha_preocupacional = null
    this.descripcion = null
  }
}
