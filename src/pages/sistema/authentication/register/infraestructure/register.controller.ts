import store from '@/store'
import { RegisterUser } from '../domain/registerUser.domain'

export class RegisterController {
  async registrarUsuario(registerUser: RegisterUser): Promise<void> {
    return await store.dispatch('authentication/registrarUsuario', registerUser)
  }
}
