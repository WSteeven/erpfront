import { ColumnConfig } from "components/tables/domain/ColumnConfig";
import { FondoRotativoContabilidad } from "./FondoRotativoContabilidad";

export const ConfiguracionColumnasContabilidad: ColumnConfig<FondoRotativoContabilidad>[] = [
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
    label: 'Observacion',
    align: 'left',
    sortable: true
  },
  {
    name: 'cantidad',
    field: 'cantidad',
    label: 'Cantidad',
    align: 'left',
    sortable: true
  },
  {
    name: 'valor_u',
    field: 'valor_u',
    label: 'V.Unit',
    align: 'left',
    sortable: true
  },
  {
    name: 'total',
    field: 'total',
    label: 'Total',
    align: 'left',
    sortable: true
  },

]
