import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { DetalleProducto } from './DetalleProducto'

export const configuracionColumnasDetallesProductos: ColumnConfig<DetalleProducto>[] = [
  {
    name: 'id',
    field: 'id',
    label: 'N°',
    align: 'left',
    sortable: true,
  }, 
  // {
  //   name: 'codigo',
  //   field: 'codigo',
  //   label: 'Código',
  //   align: 'left',
  //   sortable: true
  // },
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
    name: 'precio_compra',
    field: 'precio_compra',
    label: 'P. Compra',
    align: 'left',
    sortable: true
  },
  {
    name: 'computadora',
    field: 'computadora',
    label: 'Caracteristicas',
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
  /* {
      name: 'punta_inicial',
      field: 'punta_inicial',
      label: 'P. Inicial',
      align: 'left',
      sortable: true
  },
  {
      name: 'punta_final',
      field: 'punta_final',
      label: 'P. Final',
      align: 'left',
      sortable: true
  }, */
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
