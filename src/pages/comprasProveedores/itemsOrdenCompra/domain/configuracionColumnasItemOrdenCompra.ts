import { ColumnConfig } from "components/tables/domain/ColumnConfig";
import { ItemOrdenCompra } from "./ItemOrdenCompra";

export const configuracionColumnasItemOrdenCompra: ColumnConfig<ItemOrdenCompra>[] = [
  {
    name: 'id',
    field: 'id',
    label: 'Id',
    align: 'left',
    sortable: true,
    editable: false,
    visible: false
  }, {
    name: 'cantidad',
    field: 'cantidad',
    label: 'Cantidad',
    type: 'number',
    align: 'left',
    editable: true,
    sortable: true,
  },
  {
    name: 'producto',
    field: 'producto',
    label: 'Producto',
    align: 'left',
    editable: false,
    sortable: true
  },
  {
    name: 'descripcion',
    field: 'descripcion',
    label: 'Descripción',
    type: 'textarea',
    style: 'max-width: 200px; overflow: auto;',
    align: 'left',
    editable: true,
    sortable: true
  },
  {
    name: 'unidad_medida',
    field: 'unidad_medida',
    label: 'Medida',
    align: 'left',
    type: 'select',
    editable: true,
    sortable: true
  },
  {
    name: 'precio_unitario',
    type: 'number',
    field: 'precio_unitario',
    label: 'Precio U',
    hint: 'Precio unitario',
    align: 'center',
    editable: true,
    sortable: true
  },
  {
    name: 'facturable',
    field: 'facturable',
    label: '¿Facturable?',
    type: 'toggle',
    align: 'center',
    default: true,
    editable: true,
    sortable: false
  },
  {
    name: 'grava_iva',
    field: 'grava_iva',
    label: '¿IVA?',
    align: 'center',
    type: 'toggle',
    default: true,
    editable: true,
    sortable: false
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
    name: 'porcentaje_descuento',
    field: 'porcentaje_descuento',
    hint: 'Porcentaje de descuento',
    label: '% desc.',
    align: 'left',
    type: 'number',
    editable: true,
    sortable: true
  },
  {
    name: 'descuento',
    field: 'descuento',
    hint: 'Desc.',
    label: 'Desc.',
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
