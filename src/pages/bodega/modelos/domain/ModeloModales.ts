//Dependencias
import { ComponenteModal } from "components/modales/domain/ComponenteModal.domain";
import { markRaw } from "vue";

//Paginas
import MarcaPage from "pages/bodega/marcas/view/MarcaPage.vue";

export class ModeloModales{
    MarcaPage: ComponenteModal

    constructor(){
        this.MarcaPage = markRaw(new ComponenteModal('CONSTRUCRED', MarcaPage))
    }
}