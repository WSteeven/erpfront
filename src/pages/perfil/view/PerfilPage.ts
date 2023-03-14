// Dependencias
import { useAuthenticationStore } from 'stores/authentication'
import { defineComponent, reactive, ref } from 'vue'
import ModalEntidad from 'components/modales/view/ModalEntidad.vue'
// Logica y controladores
import { Perfil } from '../domain/Perfil'
import { ComportamientoModalesPerfil } from '../application/ComportamientoModalesPerfil'


export default defineComponent({
  components: { ModalEntidad },
  setup() {
    const perfil = reactive(new Perfil())
    const opened = ref(false)
    const authenticationStore = useAuthenticationStore()
    perfil.hydrate(authenticationStore.user)
    /**Modales */
    const modales = new ComportamientoModalesPerfil()
    function cambiarContrasena() {
      modales.abrirModalEntidad('CambiarContrasenaPage')
    }
    return {
      opened,
      modales,
      perfil,
      cambiarContrasena,
    }
  },
})
