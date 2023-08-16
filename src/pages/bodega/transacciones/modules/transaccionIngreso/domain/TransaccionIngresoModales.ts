//Dependencias
import { markRaw } from 'vue';
import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain';

//Paginas
import VisualizarIngresoPage from '../view/VisualizarIngresoPage.vue';
import DetalleProductoPage from 'pages/bodega/detalles_productos/view/DetalleProductoPage.vue';

export class GestionarIngresoModales{
  VisualizarIngresoPage: ComponenteModal
  DetalleProductoPage: ComponenteModal

  constructor(){
    this.VisualizarIngresoPage = markRaw(new ComponenteModal('Ingreso de bodega', VisualizarIngresoPage))
    this.DetalleProductoPage = markRaw(new ComponenteModal('Detalle de producto', DetalleProductoPage))
  }
}
