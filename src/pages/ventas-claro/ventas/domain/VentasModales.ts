// Dependencias
import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain'
import { markRaw } from 'vue'

// Paginas
import VentasPage from '../view/VentasPage'
export class VentasModales {
  VentasPage: ComponenteModal

  constructor() {

    this.VentasPage = markRaw(new ComponenteModal('Ventas', VentasPage))
    

  }
}
