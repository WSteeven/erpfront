// Dependencias
import { ComponenteModal } from "components/modales/domain/ComponenteModal.domain";
import { markRaw } from "vue";


//Paginas
import MultaConductorPage from "../modules/multas/view/MultaConductorPage.vue"


export class ConductorModales{
    MultaConductorPage: ComponenteModal

    constructor(){
        this.MultaConductorPage = markRaw(new ComponenteModal('Multas', MultaConductorPage))
    }
}