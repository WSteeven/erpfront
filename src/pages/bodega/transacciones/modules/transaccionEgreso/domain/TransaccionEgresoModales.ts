import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain'
import { markRaw } from 'vue'

//paginas
import DespacharPage from '../view/DespacharPage.vue'
import TransaccionEgresoImprimirPage from '../view/TransaccionEgresoImprimirPage.vue'
import InventarioPage from 'pages/bodega/inventario/view/InventarioPage'

export class TransaccionEgresoModales {
    DespacharPage: ComponenteModal
    TransaccionEgresoImprimirPage: ComponenteModal

    constructor() {
        this.DespacharPage = markRaw(new ComponenteModal('CONSTRUCRED', DespacharPage))
        this.TransaccionEgresoImprimirPage = markRaw(new ComponenteModal('CONSTRUCRED', TransaccionEgresoImprimirPage))
    }
}