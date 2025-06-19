// Dependencias
import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain'
import { markRaw } from 'vue'

// Paginas
import PedidoPage from 'src/pages/bodega/pedidos/view/PedidoPage.vue'
import DevolucionPage from 'src/pages/bodega/devoluciones/view/DevolucionPage.vue'
import SolicitudDescuentoPage from 'sso/solicitudesDescuentos/view/SolicitudDescuentoPage.vue'

export class SeguimientoIncidenteModales {
    PedidoPage: ComponenteModal
    DevolucionPage: ComponenteModal
    SolicitudDescuentoPage: ComponenteModal

    constructor() {
        this.PedidoPage = markRaw(
            new ComponenteModal('Pedido', PedidoPage)
        )
        this.DevolucionPage = markRaw(
            new ComponenteModal('Devolución', DevolucionPage)
        )
        this.SolicitudDescuentoPage = markRaw(
            new ComponenteModal('Solicitud de descuento', SolicitudDescuentoPage)
        )
    }
}
