import { ColumnConfig } from "components/tables/domain/ColumnConfig";
import { Comprobante } from "./Comprobante";

export const configuracionColumnasComprobantes: ColumnConfig<Comprobante>[]=[
    {
        name: 'transaccion_id',
        field: 'transaccion_id',
        label: 'Transaccion ',
        align: 'left',
        sortable: true
    },
    {
        name: 'firmada',
        field: 'firmada',
        label: '¿Firmada?',
        align: 'left',
        sortable: true
    },
    {
        name: 'estado',
        field: 'estado',
        label: 'Estado',
        align: 'left',
        sortable: true
    },
    {
        name: 'observacion',
        field: 'observacion',
        label: 'Observacion',
        align: 'left',
        sortable: true
    },
]