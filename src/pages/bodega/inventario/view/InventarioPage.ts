//Dependencias
import { configuracionColumnasInventarios } from '../domain/configuracionColumnasInventarios'
import { defineComponent} from 'vue'

//Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { InventarioController } from '../infraestructure/InventarioController'
import { Inventario } from '../domain/Inventario'
import { ColumnConfig } from 'components/tables/domain/ColumnConfig'

export default defineComponent({
    components: { EssentialTable },
    setup() {
        const mixin = new ContenedorSimpleMixin(Inventario, new InventarioController())
        const { entidad: inventario, disabled, listado } = mixin.useReferencias()
        const { listar } = mixin.useComportamiento()


        function actualizarInventario(){
            listar({zeros:true})
        }

        actualizarInventario() //se carga el inventario


        return {
            mixin, inventario, disabled, listado,
            configuracionColumnas: configuracionColumnasInventarios,
            actualizarInventario,
        }
    }
})
