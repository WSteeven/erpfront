// dependencies
import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain';
import { markRaw } from 'vue';


// paginas
import SeguimientoOrdenCompraPage from '../modules/novedadesOrdenesCompras/view/SeguimientoOrdenCompraPage.vue';

export class OrdenCompraModales {
    SeguimientoNovedadesOrdenesCompras: ComponenteModal

    constructor() {
        this.SeguimientoNovedadesOrdenesCompras = markRaw(
            new ComponenteModal('Registro de novedades de la orden de compra', SeguimientoOrdenCompraPage))
    }
}