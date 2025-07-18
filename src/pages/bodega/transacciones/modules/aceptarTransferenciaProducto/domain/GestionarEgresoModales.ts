//Dependencias
import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain'
import { markRaw } from 'vue'

// Paginas
import VisualizarTransferenciaProductoPage from 'src/pages/bodega/transacciones/modules/aceptarTransferenciaProducto/view/VisualizarTransferenciaProductoPage.vue'

export class GestionarEgresoModales {
    VisualizarTransferenciaProductoPage: ComponenteModal

    constructor() {
        this.VisualizarTransferenciaProductoPage = markRaw(new ComponenteModal('Aceptar transferencia de productos', VisualizarTransferenciaProductoPage))
    }
}