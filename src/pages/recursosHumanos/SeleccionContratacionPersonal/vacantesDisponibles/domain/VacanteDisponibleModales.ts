// Dependencies
import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain';
import { markRaw } from 'vue';

// Paginas
import VisualizarVacantePage from '../../vacantes/view/VisualizarVacantePage.vue';

export class VacanteDisponibleModales {
  VisualizarVacantePage: ComponenteModal

  constructor() {
    this.VisualizarVacantePage = markRaw(new ComponenteModal('Detalles de la vacante', VisualizarVacantePage))
  }
}
