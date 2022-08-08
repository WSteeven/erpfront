import { LoginUser } from '../../login/domain/UserLogin'
import store from '@/store'

export class ForgotPasswordController {
  async enviarCorreoRecuperacion(loginUser: LoginUser): Promise<void> {
    return await store.dispatch(
      'authentication/enviarCorreoRecuperacion',
      loginUser
    )
  }
}
