import { ColumnConfig } from "components/tables/domain/ColumnConfig";

export const configuracionColumnasMantenimientosCorrectivos: ColumnConfig<any>[] = [
    {
        name: 'solicitante',
        field: 'solicitante',
        label: 'Empleado Solicitante',
        align: 'left',
        sortable: true,
    },
    {
        name: 'fecha',
        field: 'fecha',
        label: 'Fecha',
        align: 'left',
        sortable: true,
    },
    {
        name: 'servicios',
        field: 'servicios',
        label: 'Servicios',
        align: 'left',
    },
    {
        name: 'km_realizado',
        field: 'km_realizado',
        label: 'Km Realizado',
        align: 'left',
        sortable: true,
    },
    {
        name: 'autorizacion',
        field: 'autorizacion',
        label: 'Estado',
        align: 'left',
        sortable: true,
    },
    {
        name: 'observacion',
        field: 'observacion',
        label: 'Observación',
        align: 'left',
    },
]