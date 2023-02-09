import { ColumnConfig } from "components/tables/domain/ColumnConfig";
import { TipoFondo } from "./TipoFondo";

export const configuracionColumnasTipoFondo: ColumnConfig<TipoFondo>[] = [
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
