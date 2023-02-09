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
    name: 'transcriptor',
    field: 'transcriptor',
    label: 'Transcriptor',
    align: 'left',
    sortable: true
  },

]
