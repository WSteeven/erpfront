// Dependencias
import { markRaw } from 'vue';
import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain';

// Páginas
import VisualizarAsistenciaPage from 'pages/controlPersonal/asistencias/view/VisualizarAsistenciaPage.vue';
import VisualizarAtrasoPage from 'pages/controlPersonal/atrasos/view/VisualizarAtrasoPage.vue';

export class DashboardControlPersonalModales {
  VisualizarAsistenciaPage: ComponenteModal;
  VisualizarAtrasoPage: ComponenteModal;

  constructor() {
    this.VisualizarAsistenciaPage = markRaw(
      new ComponenteModal('Detalle de Asistencia', VisualizarAsistenciaPage)
    );
    this.VisualizarAtrasoPage = markRaw(
      new ComponenteModal('Detalle de Atraso', VisualizarAtrasoPage)
    );
  }
}
