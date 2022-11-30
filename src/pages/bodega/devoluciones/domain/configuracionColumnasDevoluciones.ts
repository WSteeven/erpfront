import { ColumnConfig } from "components/tables/domain/ColumnConfig";
import { Devolucion } from "./Devolucion";

export const configuracionColumnasDevoluciones: ColumnConfig<Devolucion>[]=[
    {
        name: 'justificacion',
        field: 'justificacion',
        label: 'Justificación',
        align: 'left',
        sortable: true
    },
    {
        name: 'solicitante',
        field: 'solicitante',
        label: 'Solicitante',
        align: 'left',
        sortable: true
    },
    {
        name: 'tarea',
        field: 'tarea',
        label: 'Tarea',
        align: 'left',
        sortable: true
    },
    {
        name: 'sucursal',
        field: 'sucursal',
        label: 'Sucursal',
        align: 'left',
        sortable: true
    },
]