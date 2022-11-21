import { ComponenteModal } from "components/modales/domain/ComponenteModal.domain";
import { markRaw } from "vue";

//paginas
import DespacharPage from "../view/DespacharPage.vue"
import InventarioPage from "pages/bodega/inventario/view/InventarioPage";

export class TransaccionEgresoModales {
    DespacharPage: ComponenteModal
    // InventarioPage: ComponenteModal

    constructor() {
        this.DespacharPage = markRaw(new ComponenteModal('CONSTRUCRED', DespacharPage))
        // this.InventarioPage = markRaw(new ComponenteModal('CONSTRUCRED', InventarioPage))
    }
}