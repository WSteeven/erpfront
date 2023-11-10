//Dependencias

import { ComponenteModal } from "components/modales/domain/ComponenteModal.domain";
import { markRaw } from "vue";

import VisualizarOrdenCompraPage from "pages/comprasProveedores/ordenCompra/view/VisualizarOrdenCompraPage.vue";

export class OrdenesComprasModales{
  VisualizarOrdenCompra: ComponenteModal

  constructor(){
    this.VisualizarOrdenCompra = markRaw(new ComponenteModal('Orden de Compra', VisualizarOrdenCompraPage))
  }
}
