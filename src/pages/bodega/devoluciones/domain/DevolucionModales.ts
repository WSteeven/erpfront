import { ComponenteModal } from "components/modales/domain/ComponenteModal.domain";
import { markRaw } from "vue";

//paginas
import CorregirDevolucionPage from '../view/CorregirDevolucionPage.vue'

export class DevolucionModales {
    CorregirDevolucionPage: ComponenteModal

    constructor(){
        this.CorregirDevolucionPage = markRaw(new ComponenteModal('CorregirDevolucionPage', CorregirDevolucionPage))
    }
}