//Dependencias
import { markRaw } from 'vue';
import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain';

//Paginas
import VisualizarIngresoPage from 'pages/bodega/transacciones/modules/transaccionIngreso/view/VisualizarIngresoPage.vue';
import VisualizarEgresoPage from 'pages/bodega/transacciones/modules/transaccionEgreso/VisualizarEgresoPage.vue';

export class DashboardBodegaModales{
  VisualizarIngresoPage: ComponenteModal
  VisualizarEgresoPage: ComponenteModal

  constructor(){
    this.VisualizarIngresoPage = markRaw(new ComponenteModal('Ingreso de bodega', VisualizarIngresoPage))
    this.VisualizarEgresoPage = markRaw(new ComponenteModal('Egreso de bodega', VisualizarEgresoPage))
  }
}
