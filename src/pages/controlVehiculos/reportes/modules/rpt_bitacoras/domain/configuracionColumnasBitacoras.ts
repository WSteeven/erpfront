import { ColumnConfig } from 'components/tables/domain/ColumnConfig';
import { BitacoraVehicular } from 'pages/controlVehiculos/bitacoraVehicular/domain/BitacoraVehicular';

export const configuracionColumnasReporteBitacoras: ColumnConfig<BitacoraVehicular>[] = [
    {
        name: 'id',
        field: 'id',
        label: 'Bitácora',
        align: 'left',
        sortable: true,
    },
    {
        name: 'vehiculo',
        field: 'vehiculo',
        label: 'Placa',
        align: 'left',
        sortable: true,
    },
    {
        name: 'chofer',
        field: 'chofer',
        label: 'Chofer',
        align: 'left',
        sortable: true,
    },
    {
        name: 'fecha',
        field: 'fecha',
        label: 'fecha',
        align: 'left',
        sortable: true,
    },
    {
        name: 'hora_salida',
        field: 'hora_salida',
        label: 'H Salida',
        align: 'left',
        sortable: true,
    },
    {
        name: 'hora_llegada',
        field: 'hora_llegada',
        label: 'H. Llegada',
        align: 'left',
        sortable: true,
    },
    {
        name: 'km_inicial',
        field: 'km_inicial',
        label: 'Km Inicio',
        align: 'left',
        sortable: true,
    },
    {
        name: 'km_final',
        field: 'km_final',
        label: 'Km Final',
        align: 'left',
        sortable: true,
    },
    {
        name: 'km_recorridos',
        field: 'km_recorridos',
        label: 'Km Recorridos',
        align: 'left',
        sortable: true,
    },
    {
        name: 'tareas',
        field: 'tareas',
        label: 'Tareas',
        align: 'left',
        sortable: true,
    },

]
