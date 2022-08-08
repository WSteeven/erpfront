import { EntidadAuditable } from '@/app/shared/entidad/domain/entidadAuditable'

export class Perfil extends EntidadAuditable {
  name: string | null
  lastname: string | null
  cellphone: string | null
  email: string | null

  constructor() {
    super()
    this.name = null
    this.lastname = null
    this.cellphone = null
    this.email = null
  }
}
