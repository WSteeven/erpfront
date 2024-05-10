import { Empleado } from 'recursosHumanos/empleados/domain/Empleado'
import { useAuthenticationStore } from 'src/stores/authentication'
import { ApiError } from 'shared/error/domain/ApiError'
import { rolesSistema } from 'config/utils'
import { useRouter } from 'vue-router'
import { UserLoginPostulante } from '../domain/UserLoginPostulante'

export class LoginPostulanteController {
  store = useAuthenticationStore()
  Router = useRouter()

  async login(userLogin: UserLoginPostulante): Promise<Empleado> {
    try {
      const usuario = await this.store.loginPostulante(userLogin)
      const roles = usuario.roles
      if (roles?.includes(rolesSistema.tecnico_lider)) {
        this.Router.replace({ name: 'trabajo_agendado' })
      } else {
        this.Router.replace('/')
      }

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
}
