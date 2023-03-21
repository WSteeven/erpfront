// Dependencias
import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain'
import cambiarContrasenaPage from 'pages/administracion/cambiarContrasena/view/cambiarContrasenaPage.vue'
import { markRaw } from 'vue'

// Paginas


export class PerfilModales {
  CambiarContrasenaPage: ComponenteModal

  constructor() {
    this.CambiarContrasenaPage = markRaw(
      new ComponenteModal('Cambiar contraseña', cambiarContrasenaPage)
    )
  }
}
