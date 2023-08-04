import { ColumnConfig } from "components/tables/domain/ColumnConfig";

export const configuracionColumnasDetallesProductos: ColumnConfig<any>[] = [
  {
    name: 'cantidad',
    field: 'cantidad',
    label: 'Cantidad',
    align: 'left',
    sortable: true,
    editable: true,
  },
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
    name: 'unidad_medida',
    field: 'unidad_medida',
    label: 'Medida',
    align: 'left',
    sortable: true,
  },
  {
    name: 'precio_unitario',
    field: 'precio_unitario',
    label: 'Precio U',
    hint: 'Precio unitario',
    align: 'center',
    sortable: true
  },
  {
    name: 'iva',
    field: 'iva',
    label: 'IVA',
    align: 'left',
    type: 'number',
    editable: false,
    sortable: true
  },
  {
    name: 'subtotal',
    field: 'subtotal',
    label: 'Subtotal',
    align: 'left',
    type: 'number',
    editable: false,
    sortable: true
  },
  {
    name: 'total',
    field: 'total',
    label: 'Total',
    align: 'left',
    type: 'number',
    editable: false,
    sortable: true
  },

] 