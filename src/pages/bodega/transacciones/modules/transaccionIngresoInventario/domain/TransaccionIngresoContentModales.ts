import { ComponenteModal } from "components/modales/domain/ComponenteModal.domain";
import { markRaw } from "vue";

//paginas
import InventarioPage from "pages/bodega/inventario/view/InventarioPage.vue";
import TransaccionIngresoImprimirPage from "../../transaccionIngreso/view/TransaccionIngresoImprimirPage.vue";

export class TransaccionIngresoContentModales{
    InventarioPage:ComponenteModal
    TransaccionIngresoImprimirPage:ComponenteModal

    constructor(){
        this.InventarioPage= markRaw(
            new ComponenteModal('CONSTRUCRED', InventarioPage)
        )

        this.TransaccionIngresoImprimirPage= markRaw(
            new ComponenteModal('CONSTRUCRED', TransaccionIngresoImprimirPage)
        )
    }
}