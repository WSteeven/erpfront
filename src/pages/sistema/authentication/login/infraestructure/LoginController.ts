import { Empleado } from 'recursosHumanos/empleados/domain/Empleado'
import { useAuthenticationStore } from 'src/stores/authentication'
import { ApiError } from 'shared/error/domain/ApiError'
import { UserLogin } from '../domain/UserLogin'
import { useRoute, useRouter } from 'vue-router'

export class LoginController {
  store = useAuthenticationStore()
  Router = useRouter()
  route = useRoute()

  async login(userLogin: UserLogin): Promise<Empleado> {
    try {
      const redirectTo = this.route.query.redirect || '/'
      // const response = await this.store.login(userLogin)
      const usuario = await this.store.login(userLogin)
      await this.Router.replace(redirectTo)

      return usuario
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        switch (error.status) {
          case 412:
            await this.Router.replace({ name: 'ResetearContrasena' })
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
