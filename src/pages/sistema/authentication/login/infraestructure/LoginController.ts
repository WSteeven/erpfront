import { useAuthenticationStore } from 'src/stores/authentication'
import { UserLogin } from '../domain/UserLogin'
import { rolesSistema } from 'config/utils'
import { useRouter } from 'vue-router'
import { watch, computed } from 'vue'

export class LoginController {
  store = useAuthenticationStore()
  Router = useRouter()

  async login(userLogin: UserLogin): Promise<any> {
    try {
      // const response = await this.store.login(userLogin)
      const usuario = await this.store.login(userLogin)
      const roles = usuario.rol

      console.log('soy user')
      console.log(usuario)

      if (this.store.extraerRol(roles, rolesSistema.tecnico_lider) || this.store.extraerRol(roles, rolesSistema.tecnico_secretario)) {
        console.log('es tecnico')
        this.Router.replace({ name: 'trabajo_asignado' })
      } else {
        console.log('raiz')
        this.Router.replace('/')
      }

      return usuario
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

  /* constructor() {
    watch(computed(() => this.store.user), () => {
      if (this.store.extraerRol(rolesSistema.tecnico_lider) || this.store.extraerRol(rolesSistema.tecnico_secretario)) {
        this.Router.replace({ name: 'trabajo_asignado' })
      } else {
        this.Router.replace('/')
      }
    })
  } */
}
