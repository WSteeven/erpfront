import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { ControlMaterialSubtarea } from './ControlMaterialSubtarea'

export const configuracionColumnasControlMaterialSubtarea: ColumnConfig<ControlMaterialSubtarea>[] = [
    {
        name: 'detalle_producto',
        field: 'detalle_producto',
        label: 'Producto',
        align: 'left',
        sortable: true,
        input_type: 'number'
    },
    {
        name: 'cantidad_inicial',
        field: 'cantidad_inicial',
        label: 'Cantidad inicial',
        align: 'left',
        sortable: true,
        input_type: 'number'
    },
    {
        name: 'cantidad_usada',
        field: 'cantidad_usada',
        label: 'Cantidad usada',
        align: 'left',
        sortable: true,
        input_type: 'number'
    },
    {
        name: 'cantidad_devuelta',
        field: 'cantidad_devuelta',
        label: 'Cantidad devuelta',
        align: 'left',
        sortable: true,
        input_type: 'number'
    },
]
