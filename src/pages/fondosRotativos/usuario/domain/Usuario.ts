import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
export class Usuario extends EntidadAuditable {
  name: string | null
  email: string | null
  password: Date | null

  constructor() {
    super()
    this.name = null
    this.email = null
    this.password = null
  }
}
