import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable"

export class CambiarContrasena extends EntidadAuditable{
  current_password: string | null
  password: string | null
  password_confirmation: string | null

  constructor() {
    super()
    this.current_password = null
    this.password = null
    this.password_confirmation = null
  }
}
