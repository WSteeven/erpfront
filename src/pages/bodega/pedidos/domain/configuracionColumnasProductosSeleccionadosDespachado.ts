import { ColumnConfig } from 'components/tables/domain/ColumnConfig'

export const configuracionColumnasProductosSeleccionadosDespachado: ColumnConfig<any>[] = [
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
    style: 'max-width: 300px; overflow: auto;',
    align: 'left',
    sortable: true,
  },
  {
    name: 'categoria',
    field: 'categoria',
    label: 'Categoria',
    align: 'left',
    sortable: true,
  },
  {
    name: 'serial',
    field: 'serial',
    label: 'Serial',
    align: 'left',
    sortable: true,
  },
  {
    name: 'cantidad',
    field: 'cantidad',
    label: 'Cantidad',
    align: 'left',
    sortable: true,
  },
  {
    name: 'despachado',
    field: 'despachado',
    label: 'Despachado',
    align: 'left',
    sortable: true,
  }, {
    name: 'solicitante',
    field: 'solicitante',
    label: 'Registrado Por',
    align: 'center',
    sortable: false,
    style: 'width:250px'
  }
]

