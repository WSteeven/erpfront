import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain'
import { markRaw } from 'vue'

//paginas
import MarcacionPage from 'controlPersonal/asistencia/view/MarcacionPage.vue'

export  class AtrasosModales {
  MarcacionPage: ComponenteModal

  constructor() {
    this.MarcacionPage = markRaw(new ComponenteModal('Registro de Marcaciones en biométrico', MarcacionPage))
  }
}
