import { useAuthenticationStore } from 'stores/authentication'
import { ForgotPassword } from '../domain/ForgotPassword'

export class ForgotPasswordController {
  store = useAuthenticationStore()

  async enviarCorreoRecuperacion(userLogin: ForgotPassword): Promise {
    return await this.store.enviarCorreoRecuperacion(userLogin)
  }

  async recuperacionCuenta(userLogin: ForgotPassword): Promise<void> {
    return await this.store.recuperacionCuenta(userLogin)
  }
}
