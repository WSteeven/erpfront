import { ColumnConfig } from "components/tables/domain/ColumnConfig";
import { Piso } from "./Piso";

export const configuracionColumnasPisos: ColumnConfig<Piso>[]=[
    {
        name: 'fila',
        field: 'fila',
        label: 'Fila',
        align: 'left',
        sortable: true
    },
    {
        name: 'columna',
        field: 'columna',
        label: 'Columna',
        align: 'left',
        sortable: true
    },
]