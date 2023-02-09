import { ColumnConfig } from "components/tables/domain/ColumnConfig";
import { DetalleFondo } from "./DetalleFondo";

export const configuracionColumnasDetalleFondo: ColumnConfig<DetalleFondo>[] = [
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
