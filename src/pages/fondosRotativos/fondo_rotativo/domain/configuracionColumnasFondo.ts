import { ColumnConfig } from "components/tables/domain/ColumnConfig";
import { Fondo } from "./Fondo";

export const configuracionColumnasFondo: ColumnConfig<Fondo>[] = [
  {
    name: 'fecha_viat',
    field: 'fecha_viat',
    label: 'Fecha',
    align: 'left',
    sortable: true
  },
  {
    name: 'num_tarea',
    field: 'num_tarea',
    label: '#Tarea',
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
    label: 'ruc',
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
    label: 'Detalle Estado',
    align: 'left',
    sortable: true
  },

]
