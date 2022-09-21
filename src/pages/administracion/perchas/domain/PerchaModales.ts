//Dependencias
import { ComponenteModal } from "components/modales/domain/ComponenteModal.domain";
import { markRaw } from "vue";

//Paginas
import SucursalPage from "pages/administracion/sucursales/view/SucursalPage";

export class PerchaModales {
    SucursalPage: ComponenteModal

    constructor(){
        this.SucursalPage = markRaw(new ComponenteModal('CONSTRUCRED', SucursalPage))
    }
}