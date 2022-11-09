import { ComponenteModal } from "components/modales/domain/ComponenteModal.domain";
import { markRaw } from "vue";

//paginas
import InventarioPage from "pages/bodega/inventario/view/InventarioPage.vue";

export class TransaccionIngresoContentModales{
    InventarioPage:ComponenteModal

    constructor(){
        this.InventarioPage= markRaw(
            new ComponenteModal('CONSTRUCRED', InventarioPage)
        )
    }
}