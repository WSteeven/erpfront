import { useAuthenticationStore } from 'src/stores/authentication'
import { UserLogin } from '../domain/UserLogin'
import { useRouter } from 'vue-router'

export class LoginController {
  store = useAuthenticationStore()
  Router = useRouter()

  async login(userLogin: UserLogin): Promise<void> {
    return this.store.login(userLogin).then(() => {
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
