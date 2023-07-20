import { ColumnConfig } from "components/tables/domain/ColumnConfig";
import { Gasto } from "pages/fondosRotativos/gasto/domain/Gasto";


export const configuracionColumnasAutorizarGasto: ColumnConfig<Gasto>[] = [
  {
    name: 'fecha_viat',
    field: 'fecha_viat',
    label: 'Fecha',
    align: 'left',
    sortable: true
  },
  {
    name: 'tarea_info',
    field: 'tarea_info',
    label: 'Tarea',
    align: 'left',
    sortable: true
  },
  {
    name: 'factura',
    field: 'factura',
    label: '#Factura',
    align: 'left',
    sortable: true
  },
  {
    name: 'num_comprobante',
    field: 'num_comprobante',
    label: '#Comprobante',
    align: 'left',
    sortable: true },
  {
    name: 'ruc',
    field: 'ruc',
    label: 'RUC.',
    align: 'left',
    sortable: true
  },
  {
    name: 'aut_especial_user',
    field: 'aut_especial_user',
    label: 'Autorización Especial',
    align: 'left',
    sortable: true
  },
  {
    name: 'empleado_info',
    field: 'empleado_info',
    label: 'Empleado',
    align: 'left',
    sortable: true
  },
  {
    name: 'detalle_info',
    field: 'detalle_info',
    label: 'Detalle',
    align: 'left',
    sortable: true
  },

  {
    name: 'sub_detalle_info',
    field: 'sub_detalle_info',
    label: 'SubDetalle',
    align: 'left',
    sortable: true
  },

  {
    name: 'estado_info',
    field: 'estado_info',
    label: 'Estado	',
    align: 'left',
    sortable: true
  },
  {
    name: 'detalle_estado',
    field: 'detalle_estado',
    label: 'Descripcion',
    align: 'left',
    sortable: true
  },
  {
    name: 'created_at',
    field: 'created_at',
    label: 'Fecha de Creación',
    align: 'left',
    sortable: true
  },
]
