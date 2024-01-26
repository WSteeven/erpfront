import { ColumnConfig } from 'components/tables/domain/ColumnConfig'

export const configuracionColumnasListadoProductosDevolucion: ColumnConfig<any>[] = [
    {
        name: 'producto',
        field: 'producto',
        label: 'Producto',
        align: 'left',
        sortable: true,
    },
    {
        name: 'descripcion',
        field: 'descripcion',
        label: 'Descripción',
        align: 'left',
        sortable: true,
    },
    {
        name: 'serial',
        field: 'serial',
        label: 'Serial',
        align: 'left',
        sortable: false,
    },

    {
        name: 'categoria',
        field: 'categoria',
        label: 'Categoria',
        align: 'left',
        sortable: true,
    },
    {
      name: 'condiciones',
      field: 'condiciones',
      label: 'Condición',
      align: 'left',
      sortable: false,
    },
    {
      name: 'observacion',
      field: 'observacion',
      label: 'Observación',
      align: 'left',
      sortable: false,
    },
    {
        name: 'cantidad',
        field: 'cantidad',
        label: 'Cantidad',
        align: 'left',
        sortable: false,
    },
]

