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
            listar()
        }
        
        actualizarInventario() //se carga el inventario

        const configuracionColumnasInventariosLocal: ColumnConfig<Inventario>[] = [
            {
                name: 'producto',
                field: 'producto',
                label: 'Producto',
                align: 'left',
                sortable: true
            },
            {
                name: 'detalle_id',
                field: 'detalle_id',
                label: 'Descripción',
                align: 'left',
                sortable: true
            },
            {
                name: 'cliente_id',
                field: 'cliente_id',
                label: 'Propietario',
                align: 'left',
                sortable: true
            },
            {
                name: 'sucursal_id',
                field: 'sucursal_id',
                label: 'Sucursal',
                align: 'left',
                sortable: true
            },
            {
                name: 'por_recibir',
                field: 'por_recibir',
                label: 'Por recibir',
                align: 'center',
                sortable: true
            },
            {
                name: 'cantidad',
                field: 'cantidad',
                label: 'Cantidad',
                align: 'center',
                sortable: true
            },
            {
                name: 'por_entregar',
                field: 'por_entregar',
                label: 'Por entregar',
                align: 'center',
                sortable: true
            },
            {
                name: 'condicion',
                field: 'condicion',
                label: 'Condicion',
                align: 'center',
                sortable: true
            },
        ]

        return {
            mixin, inventario, disabled, listado,
            configuracionColumnas: configuracionColumnasInventarios,
            actualizarInventario,
        }
    }
})
