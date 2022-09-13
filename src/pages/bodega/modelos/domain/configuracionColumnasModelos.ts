import { ColumnConfig } from "components/tables/domain/ColumnConfig";
import { Modelo } from "./Modelo";

export const configuracionColumnasModelos: ColumnConfig<Modelo>[]=[
    {
        name:'marca',
        field:'marca',
        label:'Marca',
        align: 'left',
        sortable:true,
    },
    {
        name:'nombre',
        field:'nombre',
        label:'Modelo',
        align: 'left',
        sortable:true,
    },
]