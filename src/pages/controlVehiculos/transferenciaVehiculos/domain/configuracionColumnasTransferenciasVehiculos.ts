import { ColumnConfig } from 'components/tables/domain/ColumnConfig';
import { TransferenciaVehiculo } from './TransferenciaVehiculo';

export const configuracionColumnasTransferenciasVehiculos: ColumnConfig<TransferenciaVehiculo>[] = [
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