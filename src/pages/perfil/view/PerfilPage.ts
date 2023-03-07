// Dependencias
import { useAuthenticationStore } from 'stores/authentication'
import { defineComponent, reactive } from 'vue'
// Logica y controladores
import { Perfil } from '../domain/Perfil'

export default defineComponent({
  setup() {
    const perfil = reactive(new Perfil())
    const authenticationStore = useAuthenticationStore()
    perfil.hydrate(authenticationStore.user)


    return {
      perfil,
    }
  },
})
