import { ColumnConfig } from "components/tables/domain/ColumnConfig";
import { SubtipoTransaccion } from "./SubtipoTransaccion";

export const configuracionColumnasSubtiposTransacciones: ColumnConfig<SubtipoTransaccion>[]=[
    {
        name: 'nombre',
        field: 'nombre',
        label: 'Nombre',
        align: 'left',
        sortable: true
    },
    {
        name: 'tipo_transaccion',
        field: 'tipo_transaccion',
        label: 'Subtipo',
        align: 'left',
        sortable: true
    }
]