export class UserLogin {
  email: string | null
  password: string | null
  password_confirmation: string | null

  constructor() {
    this.email = ''
    this.password = null
    this.password_confirmation = null
  }
}
