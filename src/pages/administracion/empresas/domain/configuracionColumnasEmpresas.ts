import { ColumnConfig } from "components/tables/domain/ColumnConfig";
import { Empresa } from "./Empresa";

export const configuracionColumnasEmpresas: ColumnConfig<Empresa>[]=[
    {
        name: 'created_at',
        field: 'created_at',
        label: 'Fecha Creación',
        align:'left',
        sortable:true
    },
    {
        name: 'updated_at',
        field: 'updated_at',
        label: 'Ultima Modificación',
        align:'left',
        sortable:true
    },
    {
        name: 'identificacion',
        field: 'identificacion',
        label: 'Identificación',
        align:'left',
        sortable:true
    },
    {
        name: 'tipo_contribuyente',
        field: 'tipo_contribuyente',
        label: 'Tipo de contribuyente',
        align:'left',
        sortable:true
    },
    {
        name: 'razon_social',
        field: 'razon_social',
        label: 'Razón Social',
        align:'left',
        sortable:true
    },
    {
        name: 'correo',
        field: 'correo',
        label: 'Correo',
        align:'left',
        sortable:true
    },
    {
        name: 'direccion',
        field: 'direccion',
        label: 'Dirección',
        align:'left',
        sortable:true
    },
    

]
