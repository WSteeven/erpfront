// Dependencias
import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain'
import { markRaw } from 'vue'

// Paginas
import ClienteClaroPage from 'pages/ventas-claro/cliente/view/ClienteClaroPage.vue'
import VendedorPage from 'pages/ventas-claro/vendedores/view/VendedorPage.vue'


export class VentaModales {
  ClientePage: ComponenteModal
  VendedorPage: ComponenteModal

  constructor() {

    this.ClientePage = markRaw(new ComponenteModal('Clientes Claro', ClienteClaroPage))
    this.VendedorPage = markRaw(new ComponenteModal('Vendedores', VendedorPage))


  }
}
