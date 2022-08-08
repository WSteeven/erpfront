import { UserLogin } from '../domain/UserLogin'
import { useRouter } from 'vue-router'
import { useAuthenticationStore } from 'src/stores/authentication'

export class LoginController {
  store = useAuthenticationStore()
  Router = useRouter()

  async login(loginUser: UserLogin): Promise<void> {
    return this.store.login(loginUser).then(() => {
      this.Router.replace('/')
    })
  }

  async logout(): Promise<void> {
    return this.store
      .logout()
      .then(() => {
        this.Router.replace({ name: 'Login' })
      })
      .catch((e) => alert(e))
  }
}
