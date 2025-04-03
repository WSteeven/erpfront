import { ColumnConfig } from 'components/tables/domain/ColumnConfig';
import { Conductor } from './Conductor';

export const configuracioncolumnasConductores: ColumnConfig<Conductor>[] = [
    {
        name: 'empleado',
        field: 'empleado',
        label: 'Empleado',
        align: 'left',
        sortable: true
    },
    {
        name: 'identificacion',
        field: 'identificacion',
        label: 'Identificación',
        align: 'left',
        sortable: true
    },
    {
        name: 'licencias',
        field: 'licencias',
        label: 'Cant. Licencias',
        align: 'left',
        sortable: true,
        editable: false,
    },
    {
        name: 'puntos',
        field: 'puntos',
        label: 'Puntos',
        align: 'left',
        sortable: true,
        editable: false,
    },
    {
        name: 'multas',
        field: 'multas',
        label: 'Multas',
        align: 'left',
        sortable: true
    },
]