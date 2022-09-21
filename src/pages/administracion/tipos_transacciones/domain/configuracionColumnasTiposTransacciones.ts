import { ColumnConfig } from "components/tables/domain/ColumnConfig";
import { TipoTransaccion } from "./TipoTransaccion";

export const configuracionColumnasTiposTransacciones: ColumnConfig<TipoTransaccion>[]=[
    {
        name: 'nombre',
        field: 'nombre',
        label: 'Nombre',
        align: 'left',
        sortable: true
    },
    {
        name: 'tipo',
        field: 'tipo',
        label: 'Tipo',
        align: 'left',
        sortable: true
    }
]