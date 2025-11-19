import {ColumnConfig} from 'components/tables/domain/ColumnConfig';
import {Empleado} from 'recursosHumanos/empleados/domain/Empleado';

export const configuracionColumnasHorasPendientes: ColumnConfig<Empleado>[]=[
    {
        name: 'identificacion',
        field: 'identificacion',
        label: 'Identificación',
        align: 'left',
        sortable: true,
    },
    {
        name: 'nombres',
        field: 'nombres',
        label: 'Nombres',
        align: 'left',
        sortable: true,
    },
    {
        name: 'apellidos',
        field: 'apellidos',
        label: 'Apellidos',
        align: 'left',
        sortable: true,
    },
    {
        name: 'horas_pendientes',
        field: 'horas_pendientes',
        label: 'Horas no justificadas',
        align: 'left',
        sortable: true,
    },
]