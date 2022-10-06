import { useAuthenticationStore } from 'src/stores/authentication'
import { UserLogin } from '../domain/UserLogin'
import { useRouter } from 'vue-router'

export class LoginController {
  store = useAuthenticationStore()
  Router = useRouter()

  /* async login(userLogin: UserLogin): Promise<void> {
    return this.store.login(userLogin).then(() => {
      this.Router.replace('/')
    })
  } */

  async login(userLogin: UserLogin): Promise<any> {
    try {
      const response = await this.store.login(userLogin)
      this.Router.replace('/')
      return response
    } catch (error) {
      throw error
    }
  }

  async logout(): Promise<any> {
    
      this.store.logout()
      this.Router.replace('/')
      console.log('Cerraste la sesión')
      
      /* .then(() => {
        // this.Router.replace({ name: 'Login' })
      }).catch((e) => alert(e)) */
  }
}
