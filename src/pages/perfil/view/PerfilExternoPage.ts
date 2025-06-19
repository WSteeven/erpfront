// Dependencias
import { defineComponent, ref } from 'vue'
import ModalEntidad from 'components/modales/view/ModalEntidad.vue'
// Logica y controladores
import { useAuthenticationExternalStore } from 'stores/authenticationExternal'


export default defineComponent({
  components: { ModalEntidad },
  setup() {
    // const perfil = reactive(new Perfil())
    const opened = ref(false)
    const store = useAuthenticationExternalStore()
    console.log(store.user)
    // perfil.hydrate(store.user)

    const imagenPerfil = `https://ui-avatars.com/api/?name=${store.user.nombres.substr(0, 1)}+${store.user.apellidos.substr(0, 1)}`//&bold=true&background=0879dc28&color=0879dc`
    return {
      opened,
      imagenPerfil,
      perfil: store.user,
    }
  },
})
