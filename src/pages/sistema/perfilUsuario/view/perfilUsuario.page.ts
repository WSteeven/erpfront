import { defineComponent, ref } from 'vue'
import Perfil from '@sistema/perfilUsuario/modules/perfil/view/perfil.page.vue'
import CambiarContrasena from '@sistema/perfilUsuario/modules/cambiarContrasena/view/cambiarContrasena.page.vue'

export default defineComponent({
  setup() {
    const currentTab = ref('Perfil')
    const tabs = {
      Perfil,
      'Cambiar contraseña': CambiarContrasena,
    }

    return {
      currentTab,
      tabs,
    }
  },
})
