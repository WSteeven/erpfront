import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Inventario } from './Inventario'

export const configuracionColumnasInventarios: ColumnConfig<Inventario>[] = [
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
    /* {
        name: 'estado',
        field: 'estado',
        label: 'Estado',
        align: 'left',
        sortable: true
    }, */
]