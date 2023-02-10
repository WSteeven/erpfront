import { useAuthenticationStore } from '@/stores/authentication'
import { UserLogin } from '../../login/domain/UserLogin'

export class ResetPasswordController {
  async actualizarContrasena(userLogin: UserLogin): Promise<void> {
    const authentication = useAuthenticationStore()
    return await authentication.actualizarContrasena(userLogin)
  }
}
