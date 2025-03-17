// Dependencias
import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain'
import { markRaw } from 'vue'

// Paginas
import ActividadBitacoraPage from '../modules/actividadBitacora/view/ActividadBitacoraPage.vue'

export class BitacoraModales {
  ActividadBitacoraPage: ComponenteModal

  constructor() {
    this.ActividadBitacoraPage = markRaw(
      new ComponenteModal('Actividad de bitácora', ActividadBitacoraPage)
    )
  }
}
