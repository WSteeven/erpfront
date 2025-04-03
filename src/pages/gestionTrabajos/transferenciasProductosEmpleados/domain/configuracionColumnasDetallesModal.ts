import { ColumnConfig } from 'components/tables/domain/ColumnConfig'

export const configuracionColumnasDetallesModal: ColumnConfig<any>[] = [
    {
        name: 'producto',
        field: 'producto',
        label: 'Producto',
        align: 'left',
        sortable: true
    },
    {
        name: 'descripcion',
        field: 'descripcion',
        label: 'Descripción',
        align: 'left',
        sortable: true
    },
    {
        name: 'modelo',
        field: 'modelo',
        label: 'Modelo',
        align: 'left',
        sortable: true
    },
    {
        name: 'serial',
        field: 'serial',
        label: 'Serial',
        align: 'left',
        sortable: true
    },
    {
        name: 'cantidad',
        field: 'cantidad',
        label: 'Cantidad Disponible',
        align: 'left',
        sortable: true
    },
    {
        name: 'cliente',
        field: 'cliente',
        label: 'Cliente Propietario',
        align: 'left',
        sortable: true
    },
    {
        name: 'categoria',
        field: 'categoria',
        label: 'Categoria',
        align: 'left',
        sortable: true
    },
]

