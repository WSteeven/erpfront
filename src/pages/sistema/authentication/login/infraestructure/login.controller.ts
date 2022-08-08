import { UserLogin } from '../domain/UserLogin'
// import router from 'src/router'
import { useAuthenticationStore } from 'src/stores/authentication'

export class LoginController {
  store = useAuthenticationStore()

  async login(loginUser: UserLogin): Promise<void> {
    return this.store.login(loginUser)
  }

  async logout(): Promise<void> {
    return this.store.logout()
  }
}
