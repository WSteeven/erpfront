import { ColumnConfig } from "components/tables/domain/ColumnConfig";
import { Permiso } from "./Permiso";

export const configuracionColumnasPermisos: ColumnConfig<Permiso>[] = [
  {
    name: 'name',
    field: 'name',
    label: 'Permiso',
    align: 'left',
    sortable: true
  },

]
