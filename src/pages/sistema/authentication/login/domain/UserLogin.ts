export class UserLogin {
  email: string | null
  password: string | null
  password_confirmation: string | null
  remember_session: boolean

  constructor() {
    this.email = ''
    this.password = null
    this.password_confirmation = null
    this.remember_session = false
  }
}
