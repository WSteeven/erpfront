import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Movimiento } from './Movimiento'

export const configuracionColumnasMovimientos: ColumnConfig<Movimiento>[] = [
    {
        name: 'inventario',
        field: 'inventario',
        label: 'Item',
        align: 'left',
        sortable: true
    },
    {
        name: 'cantidad',
        field: 'cantidad',
        label: 'Cantidad',
        align: 'left',
        sortable: true
    },
    {
        name: 'precio_unitario',
        field: 'precio_unitario',
        label: 'Precio U',
        align: 'left',
        sortable: true
    },
    /* {
        name: 'saldo',
        field: 'saldo',
        label: 'saldo',
        align: 'left',
        sortable: true
    }, */
]