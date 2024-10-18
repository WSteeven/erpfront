import { Empleado } from 'recursosHumanos/empleados/domain/Empleado'
import { ApiError } from 'shared/error/domain/ApiError'
import { useRoute, useRouter } from 'vue-router'
import { UserLoginPostulante } from '../domain/UserLoginPostulante'
import { useAuthenticationExternalStore } from 'stores/authenticationExternal'

export class LoginPostulanteController {
  store = useAuthenticationExternalStore()
  Router = useRouter()
  route = useRoute()

  async login(userLogin: UserLoginPostulante): Promise<Empleado> {
    try {
      const redirectTo = this.route.query.redirect || '/puestos-disponibles'

      const usuario = await this.store.login(userLogin)
      const roles = usuario.roles
      await this.Router.replace(redirectTo)
      // this.Router.replace({ name: 'puestos_disponibles' })

      return usuario
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        switch (error.status) {
          case 412:
            await this.Router.replace({ name: 'ResetearContrasena' })
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
