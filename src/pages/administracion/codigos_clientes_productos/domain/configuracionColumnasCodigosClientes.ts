import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { CodigoCliente } from './CodigoCliente'

export const configuracionColumnasCodigosClientes: ColumnConfig<CodigoCliente>[] = [
    {
        name: 'codigo',
        field: 'codigo',
        label: 'Código',
        align: 'left',
        sortable: true
    },
    {
        name: 'producto',
        field: 'producto',
        label: 'Producto',
        align: 'left',
        sortable: true
    },
    {
        name: 'cliente',
        field: 'cliente',
        label: 'Cliente',
        align: 'left',
        sortable: true
    },
]