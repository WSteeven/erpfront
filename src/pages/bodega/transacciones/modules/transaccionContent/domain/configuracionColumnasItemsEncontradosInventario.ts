import { ColumnConfig } from 'components/tables/domain/ColumnConfig'

export const configuracionColumnasItemsEncontradosInventario: ColumnConfig<any>[] = [
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
        name: 'cantidad',
        field: 'cantidad',
        label: 'Cantidad',
        align: 'left',
        sortable: true
    },
    {
        name: 'condicion',
        field: 'condicion',
        label: 'Condicion',
        align: 'left',
        sortable: true
    },
    {
        name: 'estado',
        field: 'estado',
        label: 'Estado',
        align: 'left',
        sortable: true
    },
]

