import { ColumnConfig } from "components/tables/domain/ColumnConfig";
import { Combustible } from "./Combustible";

export const configuracionColumnasCombustibles: ColumnConfig<Combustible>[]=[
    {
        name: 'nombre',
        field: 'nombre',
        label: 'Nombre',
        align: 'left',
        sortable:true,
        visible:true,
    },
    {
        name: 'precio',
        field: 'precio',
        label: 'Precio oficial',
        align: 'left',
        sortable:true,
        visible:true,
    }
]
