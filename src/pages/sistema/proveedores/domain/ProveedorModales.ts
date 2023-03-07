//Dependencias
import { ComponenteModal } from "components/modales/domain/ComponenteModal.domain"
import { markRaw } from "vue"

//Paginas
import EmpresaPage from "pages/administracion/empresas/view/EmpresaPage.vue"

export class ProveedorModales{
  EmpresaPage: ComponenteModal

  constructor(){
    this.EmpresaPage = markRaw(new ComponenteModal('Empresa', EmpresaPage))
  }
}
