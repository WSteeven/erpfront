import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain'
import { markRaw } from 'vue'
import DetalleVacacionPage from 'recursosHumanos/vacaciones/modules/detallesVacaciones/view/DetalleVacacionPage.vue'

export class VacacionModales{
  DetalleVacacionPage: ComponenteModal

  constructor() {
  this.DetalleVacacionPage = markRaw(new ComponenteModal('Detalle de Vacación', DetalleVacacionPage))
  }
}
