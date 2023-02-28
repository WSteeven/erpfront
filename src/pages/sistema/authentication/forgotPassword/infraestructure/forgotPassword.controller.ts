import { useAuthenticationStore } from 'stores/authentication'
import { useRouter } from 'vue-router';
import { ForgotPassword } from '../domain/ForgotPassword'

export class ForgotPasswordController {
  store = useAuthenticationStore()
  Router = useRouter()
  async enviarCorreoRecuperacion(userLogin: ForgotPassword): Promise<void> {
    try {
       await this.store.enviarCorreoRecuperacion(userLogin);
    } catch (error) {

    }
  }
  async recuperacionCuenta(userLogin: ForgotPassword): Promise<void> {
    try {
       await this.store.recuperacionCuenta(userLogin);
       this.Router.replace('/login')

    } catch (error) {

    }
  }
}
