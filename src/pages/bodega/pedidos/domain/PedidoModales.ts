//Dependencies

import { ComponenteModal } from "components/modales/domain/ComponenteModal.domain";
import { markRaw } from "vue";

//Paginas
import CorregirPedidoPage from "../view/CorregirPedidoPage.vue";

export class PedidoModales{
    CorregirPedidoPage: ComponenteModal

    constructor(){
        this.CorregirPedidoPage = markRaw(new ComponenteModal('CorregirPedidoPage', CorregirPedidoPage))
    }
}