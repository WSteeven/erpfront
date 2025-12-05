import {ColumnConfig} from 'components/tables/domain/ColumnConfig';
import {HorarioEmpleado} from 'controlPersonal/horariosEmpleados/application/HorarioEmpleado';

export const  configuracionColumnasHorarioEmpleado: ColumnConfig<HorarioEmpleado>[] =[
    {
        name: 'empleado',
        field: 'empleado',
        label: 'Empleado',
        align: 'left',
        sortable: true,
    },
    {
        name: 'horario',
        field: 'horario',
        label: 'Horario',
        align: 'left',
        sortable: true,
    },
    {
        name: 'fecha_inicio',
        field: 'fecha_inicio',
        label: 'Fecha Inicio',
        align: 'left',
        sortable: true,
    },
    {
        name: 'fecha_fin',
        field: 'fecha_fin',
        label: 'Fecha Fin',
        align: 'left',
        sortable: true,
    },
    {
        name: 'activo',
        field: 'activo',
        label: 'Activo',
        align: 'left',
        sortable: true,
    },
]