import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Permiso extends EntidadAuditable {
  id: number | null;
  name: string | null


  constructor() {
    super()
    this.id = null
    this.name = null

  }
}
