//Dependencias
import { ComponenteModal } from "components/modales/domain/ComponenteModal.domain";
import { markRaw } from "vue";

//Paginas
import CategoriaPage from 'pages/bodega/categorias/view/CategoriaPage.vue'

export class ProductoModales{
    CategoriaPage: ComponenteModal

    constructor(){
        this.CategoriaPage = markRaw( new ComponenteModal('CONSTRUCRED', CategoriaPage))
    }
}