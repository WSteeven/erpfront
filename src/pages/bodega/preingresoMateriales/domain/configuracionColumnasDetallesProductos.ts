import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { DetalleProducto } from 'pages/bodega/detalles_productos/domain/DetalleProducto'

export const configuracionColumnasDetallesProductos: ColumnConfig<DetalleProducto>[] = [
  //   {
  //     name: 'id',
  //     field: 'id',
  //     label: 'N°',
  //     align: 'left',
  //     sortable: true,
  //   },
  //   {
  //     name: 'categoria',
  //     field: 'categoria',
  //     label: 'Categoria',
  //     align: 'left',
  //     sortable: true
  //   },
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
    name: 'es_generico',
    field: 'es_generico',
    label: '¿Genérico?',
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
  {
    name: 'adicionales',
    field: 'adicionales',
    label: 'Campos adicionales',
    align: 'left',
    sortable: true
  },

]
