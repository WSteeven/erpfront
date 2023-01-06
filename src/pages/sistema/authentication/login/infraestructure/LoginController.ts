import { useAuthenticationStore } from 'src/stores/authentication'
import { UserLogin } from '../domain/UserLogin'
import { rolesAdmitidos } from 'config/utils'
import { useRouter } from 'vue-router'
import { watch, computed } from 'vue'

export class LoginController {
  store = useAuthenticationStore()
  Router = useRouter()

  async login(userLogin: UserLogin): Promise<any> {
    try {
      const response = await this.store.login(userLogin)
      return response
    } catch (error) {
      throw error
    }
  }

  async logout(): Promise<void> {
    return this.store
      .logout()
      .then(() => {
        this.Router.replace({ name: 'Login' })
      })
      .catch((e) => alert(e))
  }

  constructor() {
    watch(computed(() => this.store.user), () => {
      if (this.store.extraerRol(rolesAdmitidos.tecnico_lider) || this.store.extraerRol(rolesAdmitidos.tecnico_secretario)) {
        this.Router.replace({ name: 'trabajo_asignado' })
      } else {
        this.Router.replace('/')
      }
    })
  }
}
