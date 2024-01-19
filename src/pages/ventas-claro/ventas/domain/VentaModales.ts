// Dependencias
import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain'
import { markRaw } from 'vue'

// Paginas
import ClienteClaroPage from 'pages/ventas-claro/cliente/view/ClienteClaroPage.vue'


export class VentaModales {
  ClientePage: ComponenteModal

  constructor() {

    this.ClientePage = markRaw(new ComponenteModal('Clientes Claro', ClienteClaroPage))


  }
}
