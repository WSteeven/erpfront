import { Empleado } from 'recursosHumanos/empleados/domain/Empleado'
import { useAuthenticationStore } from 'src/stores/authentication'
import { ApiError } from 'shared/error/domain/ApiError'
import { UserLogin } from '../domain/UserLogin'
import { rolesSistema } from 'config/utils'
import { useRouter } from 'vue-router'

export class LoginController {
  store = useAuthenticationStore()
  Router = useRouter()

  async login(userLogin: UserLogin): Promise<Empleado> {
    try {
      // const response = await this.store.login(userLogin)
      const usuario = await this.store.login(userLogin)
      const roles = usuario.roles


      //if (existeYEsArreglo && (this.store.extraerRol(roles, rolesSistema.tecnico_lider) || this.store.extraerRol(roles, rolesSistema.tecnico_secretario))) {
      // console.log(roles)
      // console.log(existeYEsArreglo)

      // if (typeof usuario.cargo === 'string' && [cargosSistema.tecnico_lider, cargosSistema.tecnico_secretario].includes(usuario.cargo)) {
        this.Router.replace('/intranet')
      // if (roles?.includes(rolesSistema.tecnico_lider)) {
      //   this.Router.replace({ name: 'trabajo_agendado' })
      // } else {
      //   this.Router.replace('/')
      // }

      return usuario
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        switch (error.status) {
          case 412:
            this.Router.replace({ name: 'ResetearContrasena' })
            this.store.setNombreusuario(userLogin.name!);
            break;
        }
      }
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
