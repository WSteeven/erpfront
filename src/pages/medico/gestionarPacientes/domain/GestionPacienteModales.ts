// Dependencias
import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain'
import { markRaw } from 'vue'

// Paginas
import ResultadosExamenPage from 'src/pages/medico/gestionarPacientes/view/ResultadosExamenPage.vue'

export class GestionPacienteModales {
  ResultadosExamenPage: ComponenteModal

  constructor() {
    this.ResultadosExamenPage = markRaw(new ComponenteModal('Resultados de examen', ResultadosExamenPage))
  }
}
