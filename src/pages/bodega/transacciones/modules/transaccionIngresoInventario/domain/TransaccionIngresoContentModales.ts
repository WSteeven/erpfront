import { ComponenteModal } from "components/modales/domain/ComponenteModal.domain";
import { markRaw } from "vue";

//paginas
import InventarioPage from "pages/bodega/inventario/view/InventarioPage.vue";
import InventariarPage from "../../transaccionIngreso/modules/inventariarProductos/view/InventariarPage.vue";
import TransaccionIngresoImprimirPage from "../../transaccionIngreso/view/TransaccionIngresoImprimirPage.vue";
import TransaccionIngresoInventariarPage from "../../transaccionIngreso/view/TransaccionIngresoInventariarPage.vue";

export class TransaccionIngresoContentModales{
    InventarioPage:ComponenteModal
    InventariarPage:ComponenteModal
    TransaccionIngresoImprimirPage:ComponenteModal
    TransaccionIngresoInventariarPage:ComponenteModal

    constructor(){
        this.InventarioPage= markRaw(
            new ComponenteModal('CONSTRUCRED', InventarioPage)
        )

        this.InventariarPage= markRaw(
            new ComponenteModal('SELECCIONA EL ESTADO Y LA CANTIDAD PARA INGRESAR AL INVENTARIO', InventariarPage)
        )

        this.TransaccionIngresoImprimirPage= markRaw(
            new ComponenteModal('CONSTRUCRED', TransaccionIngresoImprimirPage)
        )

        this.TransaccionIngresoInventariarPage = markRaw(
            new ComponenteModal('CONSTRUCRED', TransaccionIngresoInventariarPage)
        )
    }
}