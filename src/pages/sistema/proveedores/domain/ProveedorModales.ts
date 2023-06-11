//Dependencias
import { ComponenteModal } from "components/modales/domain/ComponenteModal.domain"
import { markRaw } from "vue"

//Paginas
import EmpresaPage from "pages/administracion/empresas/view/EmpresaPage.vue"
import ContactoProveedorPage from "pages/comprasProveedores/contactosProveedor/view/ContactoProveedorPage.vue"

export class ProveedorModales{
  EmpresaPage: ComponenteModal
  ContactoProveedorPage: ComponenteModal

  constructor(){
    this.EmpresaPage = markRaw(new ComponenteModal('Empresa', EmpresaPage))
    this.ContactoProveedorPage = markRaw(new ComponenteModal('Contacto de Proveedor', ContactoProveedorPage))
  }
}
