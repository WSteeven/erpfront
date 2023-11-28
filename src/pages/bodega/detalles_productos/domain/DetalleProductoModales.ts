//Dependencias
import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain';
import { markRaw } from 'vue';

//Paginas
import ProductoPage from 'pages/bodega/productos/view/ProductoPage.vue'
import MarcaPage from 'pages/bodega/marcas/view/MarcaPage.vue'
import ModeloPage from 'pages/bodega/modelos/view/ModeloPage.vue'

export class DetalleProductoModales{
    ProductoPage: ComponenteModal
    MarcaPage: ComponenteModal
    ModeloPage: ComponenteModal

    constructor(){
        this.ProductoPage = markRaw(new ComponenteModal('Producto', ProductoPage))
        this.MarcaPage = markRaw(new ComponenteModal('Producto', MarcaPage))
        this.ModeloPage = markRaw(new ComponenteModal('Producto', ModeloPage))
    }
}