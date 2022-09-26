import { ColumnConfig } from "components/tables/domain/ColumnConfig";
import { EstadosTransaccion } from "./EstadosTransaccion";

export const configuracionColumnasEstadosTransaccion: ColumnConfig<EstadosTransaccion>[]=[
    {
        name:'nombre',
        field:'nombre',
        label:'nombre',
        align:'left',
        sortable:true,
    }
]