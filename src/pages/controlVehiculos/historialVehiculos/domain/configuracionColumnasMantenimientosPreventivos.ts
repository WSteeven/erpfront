import { ColumnConfig } from 'components/tables/domain/ColumnConfig';

export const configuracionColumnasMantenimientosPreventivos: ColumnConfig<any>[] = [
    {
        name: 'empleado',
        field: 'empleado',
        label: 'Empleado Realiza',
        align: 'left',
        sortable: true,
    },
    {
        name: 'fecha_realizado',
        field: 'fecha_realizado',
        label: 'Fecha Realizado',
        align: 'left',
        sortable: true,
    },
    {
        name: 'servicio',
        field: 'servicio',
        label: 'Servicio',
        align: 'left',
        sortable: true,
    },
    {
        name: 'km_realizado',
        field: 'km_realizado',
        label: 'Km Realizado',
        align: 'left',
        sortable: true,
    },
    {
        name: 'estado',
        field: 'estado',
        label: 'Estado',
        align: 'left',
        sortable: true,
    },
    {
        name: 'km_retraso',
        field: 'km_retraso',
        label: 'Km Retraso',
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