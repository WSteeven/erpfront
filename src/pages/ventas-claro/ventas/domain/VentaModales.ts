// Dependencias
import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain'
import { markRaw } from 'vue'

// Paginas
import ClienteClaroPage from 'pages/ventas-claro/cliente/view/ClienteClaroPage.vue'
import VendedorPage from 'pages/ventas-claro/vendedores/view/VendedorPage.vue'
import SeguimientoVentaPage from '../modules/novedadesVentas/view/SeguimientoVentaPage.vue'


export class VentaModales {
  ClientePage: ComponenteModal
  VendedorPage: ComponenteModal
  SeguimientoVentaPage: ComponenteModal

  constructor() {

    this.ClientePage = markRaw(new ComponenteModal('Clientes Claro', ClienteClaroPage))
    this.VendedorPage = markRaw(new ComponenteModal('Vendedores', VendedorPage))
    this.SeguimientoVentaPage = markRaw(new ComponenteModal('Novedades de la venta', SeguimientoVentaPage))


  }
}
