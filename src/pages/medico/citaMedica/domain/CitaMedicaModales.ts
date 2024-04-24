// Dependencias
import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain'
import { markRaw } from 'vue'

// Paginas
import DiagnosticoRecetaPage from 'medico/diagnosticoReceta/view/DiagnosticoRecetaPage.vue'

export class CitaMedicaModales {
  DiagnosticoRecetaPage: ComponenteModal

  constructor() {
    this.DiagnosticoRecetaPage = markRaw(new ComponenteModal('Consulta médica', DiagnosticoRecetaPage))
  }
}
