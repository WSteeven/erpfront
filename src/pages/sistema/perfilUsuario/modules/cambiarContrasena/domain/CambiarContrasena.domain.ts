export class CambiarContrasena {
  current_password: string | null
  password: string | null
  password_confirmation: string | null

  constructor() {
    this.current_password = null
    this.password = null
    this.password_confirmation = null
  }
}
