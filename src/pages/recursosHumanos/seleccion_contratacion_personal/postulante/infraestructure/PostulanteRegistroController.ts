import { Postulante } from '../domain/Postulante';
import { useAuthenticationExternalStore } from 'stores/authenticationExternal';
import { useRouter } from 'vue-router';
import { ApiError } from 'shared/error/domain/ApiError';

export class PostulanteRegistroController {
  store = useAuthenticationExternalStore()
  Router = useRouter()
  async registro(postulante: Postulante) {
    try {
      const response = await this.store.registro(postulante)
      this.Router.replace({ name: 'puestos_disponibles' })
      return response
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        switch (error.status) {
          case 412:
            this.Router.replace({ name: 'ResetearContrasena' })
            break;
        }
      }
      throw error
    }
  }
}

