import { ColumnConfig } from 'components/tables/domain/ColumnConfig';
import { Empleado } from './Empleado';

export const configuracionColumnasEmpleadosLite: ColumnConfig<Empleado>[] = [
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
        name: 'canton',
        field: 'canton',
        label: 'Ciudad',
        align: 'left',
        sortable: true,
    },
    {
        name: 'direccion',
        field: 'direccion',
        label: 'Dirección',
        align: 'left',
    },
    {
        name: 'estado',
        field: 'estado',
        label: '¿Activo?',
        align: 'left',
    },

]