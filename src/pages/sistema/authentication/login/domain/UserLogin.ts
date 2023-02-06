export class UserLogin {
  name: string | null
  email: string | null
  password: string | null
  password_confirmation: string | null
  remember_session: boolean

  constructor() {
    this.name = null
    this.email = null
    this.password = null
    this.password_confirmation = null
    this.remember_session = false
  }
}
