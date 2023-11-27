//Dependencias

import { ComponenteModal } from "components/modales/domain/ComponenteModal.domain";
import { markRaw } from "vue";

import VisualizarOrdenCompraPage from "pages/comprasProveedores/ordenCompra/view/VisualizarOrdenCompraPage.vue";
import SeguimientoOrdenCompraPage from "pages/comprasProveedores/ordenCompra/modules/novedadesOrdenesCompras/view/SeguimientoOrdenCompraPage.vue";

export class OrdenesComprasModales{
  VisualizarOrdenCompra: ComponenteModal
  SeguimientoNovedadesOrdenesCompras: ComponenteModal

  constructor(){
    this.VisualizarOrdenCompra = markRaw(new ComponenteModal('Orden de Compra', VisualizarOrdenCompraPage))
    this.SeguimientoNovedadesOrdenesCompras= markRaw(new ComponenteModal('Novedades de Ordenes de Compra', SeguimientoOrdenCompraPage))
  }
}
