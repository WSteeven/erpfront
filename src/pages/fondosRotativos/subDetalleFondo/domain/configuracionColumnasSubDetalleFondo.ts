import { ColumnConfig } from "components/tables/domain/ColumnConfig";
import { SubDetalleFondo } from "./SubDetalleFondo";

export const configuracionColumnasSubDetalleFondo: ColumnConfig<SubDetalleFondo>[] = [
  {
    name: 'detalle_viatico',
    field: 'detalle_viatico',
    label: 'Detalle',
    align: 'left',
    sortable: true
  },
  {
    name: 'descripcion',
    field: 'descripcion',
    label: 'Sub Detalle',
    align: 'left',
    sortable: true
  },
  {
    name: 'autorizacion',
    field: 'autorizacion',
    label: 'Autorizacion',
    align: 'left',
    sortable: true
  },
  {
    name: 'transcriptor',
    field: 'transcriptor',
    label: 'Transcriptor',
    align: 'left',
    sortable: true
  },
  {
    name: 'fecha_trans',
    field: 'fecha_trans',
    label: 'Fecha',
    align: 'left',
    sortable: true
  },


]
