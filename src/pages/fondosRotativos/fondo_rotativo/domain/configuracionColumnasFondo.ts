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
    name: 'RUC',
    field: 'RUC',
    label: 'RUC',
    align: 'left',
    sortable: true
  },
  {
    name: 'aut_especial',
    field: 'aut_especial',
    label: 'Autorización Especial',
    align: 'left',
    sortable: true
  },
  {
    name: 'detalle',
    field: 'detalle',
    label: 'Detalle',
    align: 'left',
    sortable: true
  },

  {
    name: 'sub_detalle',
    field: 'sub_detalle',
    label: 'SubDetalle',
    align: 'left',
    sortable: true
  },

  {
    name: 'comprobante',
    field: 'comprobante',
    label: 'Comprobante 1',
    align: 'left',
    sortable: true
  },
  {
    name: 'comprobante2',
    field: 'comprobante2',
    label: 'Comprobante 2',
    align: 'left',
    sortable: true
  },
  {
    name: 'estado',
    field: 'estado',
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
