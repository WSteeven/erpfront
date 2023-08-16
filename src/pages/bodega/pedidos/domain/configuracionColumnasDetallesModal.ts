import { ColumnConfig } from 'components/tables/domain/ColumnConfig'

export const configuracionColumnasDetallesModal: ColumnConfig<any>[] = [
    {
        name: 'producto',
        field: 'producto',
        label: 'Producto',
        style: 'max-width: 300px; overflow: auto;',
        align: 'left',
        sortable: true
    },
    {
        name: 'descripcion',
        field: 'descripcion',
        label: 'Descripción',
        style: 'max-width: 500px; overflow: auto;',
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
        name: 'stock',
        field: 'stock',
        label: 'Stock',
        align: 'left',
        sortable: true
    },
    {
        name: 'fibra',
        field: 'fibra',
        label: 'Fibra',
        align: 'left',
        sortable: true
    },
    {
        name: 'puntas',
        field: 'puntas',
        label: 'Detalles Fibra',
        align: 'left',
        sortable: true
    },
    {
        name: 'adicionales',
        field: 'adicionales',
        label: 'Campos adicionales',
        align: 'left',
        sortable: true
    },

]

