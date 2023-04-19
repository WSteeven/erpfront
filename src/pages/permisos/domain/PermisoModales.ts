// Dependencias
import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain'
import { markRaw } from 'vue'
import PermisoNuevoPage from '../view/PermisoNuevoPage.vue'

// Paginas


export class PermisoModales {
  PermisoNuevoPage: ComponenteModal

  constructor() {
    this.PermisoNuevoPage = markRaw(
      new ComponenteModal('Nuevo Permiso', PermisoNuevoPage)
    )
  }
}
