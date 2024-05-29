import { ColumnConfig } from "components/tables/domain/ColumnConfig";

export const configuracionColumnasCustodios: ColumnConfig<any>[] = [
    {
        name: 'fecha_entrega',
        field: 'fecha_entrega',
        label: 'Fecha Entrega',
        align: 'left',
    },
    {
        name: 'canton',
        field: 'canton',
        label: 'Ciudad',
        align: 'left',
    },
    {
        name: 'entrega',
        field: 'entrega',
        label: 'Entrega',
        align: 'left',
    },
    {
        name: 'responsable',
        field: 'responsable',
        label: 'Responsable',
        align: 'left',
    },
    {
        name: 'observacion_entrega',
        field: 'observacion_entrega',
        label: 'Observacion Entrega',
        align: 'left',
    },
]