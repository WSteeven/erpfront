import { ColumnConfig } from 'components/tables/domain/ColumnConfig'

export const configuracionColumnasStockResponsables: ColumnConfig<any>[] = [
    {
        name: 'despachado',
        field: 'despachado',
        label: 'Despachado',
        align: 'left',
        sortable: true
    },
    {
        name: 'stock_actual',
        field: 'stock_actual',
        label: 'Cantidad en stock',
        align: 'left',
        sortable: true
    },
    {
        name: 'total_cantidad_utilizada',
        field: 'total_cantidad_utilizada',
        label: 'Cantidad utilizada',
        align: 'left',
        sortable: true
    },
    {
        name: 'devuelto',
        field: 'devuelto',
        label: 'Cantidad devuelta',
        align: 'left',
        sortable: true
    },
    {
        name: 'responsable',
        field: 'responsable',
        label: 'Responsable',
        align: 'left',
        sortable: true,
    },
]