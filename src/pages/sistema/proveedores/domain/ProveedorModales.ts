//Dependencias
import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain'
import { markRaw } from 'vue'

//Paginas
import EmpresaPage from "pages/administracion/empresas/view/EmpresaPage.vue"
import ContactoProveedorPage from "pages/comprasProveedores/contactosProveedor/view/ContactoProveedorPage.vue"
import CalificacionProveedorPage from 'pages/comprasProveedores/calificacionProveedor/view/CalificacionProveedorPage.vue'
import InfoCalificacionProveedorPage from 'pages/comprasProveedores/calificacionProveedor/view/InfoCalificacionProveedorPage.vue'
import MiCalificacionProveedorPage from 'pages/comprasProveedores/calificacionProveedor/view/MiCalificacionProveedorPage.vue'
import CategoriaOfertaPage from 'pages/comprasProveedores/categoriaOfertas/view/CategoriaOfertaPage.vue'
import DatoBancarioPage from 'pages/comprasProveedores/datosBancariosProveedor/view/DatoBancarioPage.vue'
import VisualizarProveedorPage from '../view/VisualizarProveedorPage.vue'

export class ProveedorModales {
  EmpresaPage: ComponenteModal
  ContactoProveedorPage: ComponenteModal
  CalificacionProveedorPage: ComponenteModal
  InfoCalificacionProveedorPage: ComponenteModal
  CategoriaOfertaPage: ComponenteModal
  DatoBancarioPage: ComponenteModal
  MiCalificacionProveedorPage: ComponenteModal
  VisualizarProveedorPage: ComponenteModal

  constructor() {
    this.EmpresaPage = markRaw(new ComponenteModal('Información Tributaria', EmpresaPage))
    this.ContactoProveedorPage = markRaw(new ComponenteModal('Contacto de Proveedor', ContactoProveedorPage))
    this.CalificacionProveedorPage = markRaw(new ComponenteModal('Calificación del Proveedor', CalificacionProveedorPage))
    this.InfoCalificacionProveedorPage = markRaw(new ComponenteModal('Resultados de la Calificación del Proveedor', InfoCalificacionProveedorPage))
    this.CategoriaOfertaPage = markRaw(new ComponenteModal('Categoria de Oferta', CategoriaOfertaPage))
    this.DatoBancarioPage = markRaw(new ComponenteModal('Datos Bancarios del Proveedor', DatoBancarioPage))
    this.MiCalificacionProveedorPage = markRaw(new ComponenteModal('Mi Calificación del Proveedor', MiCalificacionProveedorPage))
    this.VisualizarProveedorPage = markRaw(new ComponenteModal('Proveedor', VisualizarProveedorPage))
  }
}
