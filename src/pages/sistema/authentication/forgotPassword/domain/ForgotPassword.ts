export class ForgotPassword {
  email: string | null
  code: string | null
  password: string | null
  password_confirmation: string | null

  constructor() {
    this.email = null
    this.code = null
    this.password = null
    this.password_confirmation = null
  }
}
