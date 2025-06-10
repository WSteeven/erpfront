import { useAuthenticationStore } from 'stores/authentication';
import { useRouter } from 'vue-router';
import { ResetPassword } from '../domain/ResetPassword'
import { AxiosError } from 'axios';
import { ApiError } from 'shared/error/domain/ApiError';

export class ResetPasswordController {
  store = useAuthenticationStore()
  Router = useRouter()
  async actualizarContrasena(resetPassword: ResetPassword): Promise<void> {
    try {
      await this.store.actualizarContrasena(resetPassword);
      this.Router.replace('/login')
    } catch (error) {
      const axiosError = error as AxiosError
      throw new ApiError(axiosError)
    }
  }
}
