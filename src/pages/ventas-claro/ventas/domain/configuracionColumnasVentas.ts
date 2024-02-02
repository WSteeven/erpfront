import { ColumnConfig } from "components/tables/domain/ColumnConfig";
import { Venta } from "./Venta";

export const configuracionColumnasVentas: ColumnConfig<Venta>[] = [
  {
    name: 'orden_id',
    field: 'orden_id',
    label: '#Orden',
    align: 'left',
    sortable: true
  },
  // {
  //   name: 'orden_interna',
  //   field: 'orden_interna',
  //   label: 'Orden Interna',
  //   align: 'left',
  //   sortable: true
  // },
  {
    name: 'vendedor_info',
    field: 'vendedor_info',
    label: 'Vendedor',
    align: 'left',
    sortable: true
  },
  {
    name: 'cliente_info',
    field: 'cliente_info',
    label: 'Cliente',
    align: 'left',
    sortable: true
  },
  {
    name: 'plan',
    field: 'plan',
    label: 'Plan',
    align: 'left',
    sortable: true
  },
  {
    name: 'producto_info',
    field: 'producto_info',
    label: 'Producto',
    align: 'left',
    sortable: true
  },
  {
    name: 'fecha_activacion',
    field: 'fecha_activacion',
    label: 'Fecha de Activacion',
    align: 'left',
    sortable: true
  },
  {
    name: 'estado_activacion',
    field: 'estado_activacion',
    label: 'Estado',
    align: 'left',
    sortable: true
  },
  {
    name: 'forma_pago',
    field: 'forma_pago',
    label: 'Forma de Pago',
    align: 'left',
    sortable: true
  },
  {
    name: 'comision_vendedor',
    field: 'comision_vendedor',
    label: 'Comision',
    align: 'left',
    sortable: true
  },
  {
    name: 'novedades',
    field: 'novedades',
    label: 'Novedades',
    align: 'left',
    sortable: true
  },
  // {
  //   name: 'chargeback',
  //   field: 'chargeback',
  //   label: 'Chargeback',
  //   align: 'left',
  //   sortable: true
  // },


]
