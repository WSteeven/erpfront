import { ColumnConfig } from "components/tables/domain/ColumnConfig";
import { Pregunta } from "./Pregunta";

export const configuracionColumnasPregunta: ColumnConfig<Pregunta>[] = [
  {
    name: 'codigo',
    field: 'codigo',
    label: 'Codigo',
    align: 'left',
    sortable: true
  },
  {
    name: 'pregunta',
    field: 'pregunta',
    label: 'Pregunta',
    align: 'left',
    sortable: true
  },
]
