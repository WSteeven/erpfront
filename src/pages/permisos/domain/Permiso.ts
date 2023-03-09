import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Permiso extends EntidadAuditable {
  id: number | null;
  name: string | null
  role_id: number | null


  constructor() {
    super()
    this.id = null
    this.name = null
    this.role_id = null

  }
}
