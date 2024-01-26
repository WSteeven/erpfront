// Dependencias
import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain'
import { markRaw } from 'vue'

// Paginas
import VentasPage from '../view/VentasPage.vue'
import DetalleCompletoVentas from 'pages/ventas-claro/dashboardVentas/view/DetalleCompletoVentas.vue'
export class VentasModales {
  VentasPage: ComponenteModal
  DetalleCompletoVentas: ComponenteModal

  constructor() {

    this.VentasPage = markRaw(new ComponenteModal('Ventas', VentasPage))
    this.DetalleCompletoVentas = markRaw(new ComponenteModal('Detalle',DetalleCompletoVentas))


  }
}
