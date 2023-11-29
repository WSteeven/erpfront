//Dependencies

import { ComponenteModal } from "components/modales/domain/ComponenteModal.domain";
import { markRaw } from "vue";

//Paginas
import CorregirPedidoPage from "../view/CorregirPedidoPage.vue";
import VisualizarPedidoPage from "../view/VisualizarPedidoPage.vue";

export class PedidoModales{
    CorregirPedidoPage: ComponenteModal
    VisualizarPedidoPage: ComponenteModal

    constructor(){
        this.CorregirPedidoPage = markRaw(new ComponenteModal('CorregirPedidoPage', CorregirPedidoPage))
        this.VisualizarPedidoPage = markRaw(new ComponenteModal('VisualizarPedidoPage', VisualizarPedidoPage))
    }
}