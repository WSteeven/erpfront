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
    // {
    //     name: 'computadora',
    //     field: 'computadora',
    //     label: 'Caracteristicas',
    //     align: 'left',
    //     sortable: true
    // },
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

