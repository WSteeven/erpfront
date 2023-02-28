export class ResetPassword {
  nombreUsuario: string | null
  password_old: string | null
  password: string | null
  password_confirmation: string | null

  constructor() {
    this.nombreUsuario = null
    this.password_old = null
    this.password = null
    this.password_confirmation = null
  }
}
