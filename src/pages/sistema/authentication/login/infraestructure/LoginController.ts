import { useAuthenticationStore } from 'src/stores/authentication'
import { UserLogin } from '../domain/UserLogin'
import { cargosSistema, rolesSistema } from 'config/utils'
import { useRouter } from 'vue-router'
import { Empleado } from 'pages/recursosHumanos/empleados/domain/Empleado'

export class LoginController {
  store = useAuthenticationStore()
  Router = useRouter()

  async login(userLogin: UserLogin): Promise<Empleado> {
    try {
      // const response = await this.store.login(userLogin)
      const usuario = await this.store.login(userLogin)
      // const roles = usuario.roles

      // const existeYEsArreglo = typeof (roles) === 'object' && roles

      //if (existeYEsArreglo && (this.store.extraerRol(roles, rolesSistema.tecnico_lider) || this.store.extraerRol(roles, rolesSistema.tecnico_secretario))) {

      if (typeof usuario.cargo === 'string' && [cargosSistema.tecnico_lider, cargosSistema.tecnico_secretario].includes(usuario.cargo)) {
        this.Router.replace({ name: 'trabajo_asignado' })
      } else {
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
