import { ColumnConfig } from 'components/tables/domain/ColumnConfig';
import { AsignacionVehiculo } from './AsignacionVehiculo';

export const configuracionColumnasAsignacionVehiculos: ColumnConfig<AsignacionVehiculo>[] = [
    {
        name: 'vehiculo',
        field: 'vehiculo',
        label: 'Vehiculo',
        align: 'left',
        sortable: true,
    },
    {
        name: 'entrega',
        field: 'entrega',
        label: 'P. Entrega',
        align: 'left',
        sortable: true,
    },
    {
        name: 'responsable',
        field: 'responsable',
        label: 'Responsable',
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
]