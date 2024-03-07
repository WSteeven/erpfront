//Dependencias
import { markRaw } from 'vue';
import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain';

//Paginas
import VisualizarIngresoPage from 'pages/bodega/transacciones/modules/transaccionIngreso/view/VisualizarIngresoPage.vue';
import VisualizarEgresoPage from 'pages/bodega/transacciones/modules/transaccionEgreso/VisualizarEgresoPage.vue';
import VisualizarPedidoPage from 'pages/bodega/pedidos/view/VisualizarPedidoPage.vue';
// import VisualizarDevolucionPage from 'pages/bodega/transacciones/modules/transaccionEgreso/VisualizarEgresoPage.vue';

export class DashboardBodegaModales{
  VisualizarIngresoPage: ComponenteModal
  VisualizarEgresoPage: ComponenteModal
  VisualizarPedidoPage: ComponenteModal
  // VisualizarDevolucionPage: ComponenteModal

  constructor(){
    this.VisualizarIngresoPage = markRaw(new ComponenteModal('Ingreso de bodega', VisualizarIngresoPage))
    this.VisualizarEgresoPage = markRaw(new ComponenteModal('Egreso de bodega', VisualizarEgresoPage))
    this.VisualizarPedidoPage = markRaw(new ComponenteModal('Pedido de materiales a bodega',VisualizarPedidoPage))
    // this.VisualizarDevolucionPage = markRaw(new ComponenteModal('Pedido de materiales a bodega',VisualizarDevolucionPage))
  }
}
