import { Empleado } from 'recursosHumanos/empleados/domain/Empleado'
import { ApiError } from 'shared/error/domain/ApiError'
import { rolesSistema } from 'config/utils'
import { useRouter } from 'vue-router'
import { UserLoginPostulante } from '../domain/UserLoginPostulante'
import { useAuthenticationExternalStore } from 'stores/authenticationExternal'
import router from 'src/router'

export class LoginPostulanteController {
  store = useAuthenticationExternalStore()
  Router = useRouter()

  async login(userLogin: UserLoginPostulante): Promise<Empleado> {
    try {
      const usuario = await this.store.login(userLogin)
      const roles = usuario.roles
      this.Router.push(this.Router.currentRoute.value.redirectedFrom || { name: 'puestos_disponibles' })
      // this.Router.replace({ name: 'puestos_disponibles' })

      return usuario
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        switch (error.status) {
          case 412:
            this.Router.replace({ name: 'ResetearContrasena' })
            this.store.setNombreusuario(userLogin.name!)
            break
        }
      }
      throw error
    }
  }
  async loginterceros(driver) {
    try {
      await this.store.loginTerceros(driver)
    } catch (error: unknown) {
      throw error
    }
  }
  async obtenerSesionUser() {
    try {
      const usuario = this.store.obtenerSesion()

      this.Router.replace({ name: 'puestos_disponibles' })
    } catch (error: unknown) {
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
