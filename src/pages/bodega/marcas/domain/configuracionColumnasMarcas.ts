import { ColumnConfig } from "components/tables/domain/ColumnConfig";
import { Marca } from "./Marca";

export const configuracionColumnasMarcas: ColumnConfig<Marca>[]=[
    {
        name: 'nombre',
        field: 'nombre',
        label: 'Marca',
        align: 'left',
        sortable: true
    },
]