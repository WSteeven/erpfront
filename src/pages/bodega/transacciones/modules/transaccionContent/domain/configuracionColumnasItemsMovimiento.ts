import { ColumnConfig } from "components/tables/domain/ColumnConfig"

export const configuracionColumnasItemsMovimiento:ColumnConfig<any>[]=[
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
        label: 'Cliente',
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
        name: 'precio_unitario',
        field: 'precio_unitario',
        label: 'Precio U',
        align: 'left',
        sortable: true
    },
]