import { ColumnConfig } from "components/tables/domain/ColumnConfig";
import { SubDetalleFondo } from "./SubDetalleFondo";

export const configuracionColumnasSubDetalleFondo: ColumnConfig<SubDetalleFondo>[] = [
  {
    name: 'descripcion',
    field: 'descripcion',
    label: 'Descripcion',
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

]
