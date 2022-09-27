import { ColumnConfig } from "components/tables/domain/ColumnConfig";
import { Transaccion } from "./Transaccion";

export const configuracionColumnasTransacciones: ColumnConfig<Transaccion>[] = [
    {
        name: 'solicitante',
        field: 'solicitante',
        label: 'solicitante',
        align: 'left',
        sortable: true,
    },
    {
        name: 'justificacion',
        field: 'justificacion',
        label: 'Justificacion',
        align: 'left',
        sortable: true,
    },
    {
        name: 'fecha_limite',
        field: 'fecha_limite',
        label: 'Fecha límite',
        align: 'left',
        sortable: true,
    },
    {
        name: 'subtipo',
        field: 'subtipo',
        label: 'Tipo',
        align: 'left',
        sortable: true,
    },
    {
        name: 'sucursal',
        field: 'sucursal',
        label: 'Sucursal',
        align: 'left',
        sortable: true,
    },
    {
        name: 'autoriza',
        field: 'autoriza',
        label: 'Autoriza',
        align: 'left',
        sortable: true,
    },
    {
        name: 'autorizacion',
        field: 'autorizacion',
        label: 'autorizacion',
        align: 'left',
        sortable: true,
    },
    {
        name: 'lugar_destino',
        field: 'lugar_destino',
        label: 'Lugar Destino',
        align: 'left',
        sortable: true,
    },
    {
        name: 'estado',
        field: 'estado',
        label: 'Estado',
        align: 'left',
        sortable: true,
    }
]
