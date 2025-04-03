import { ColumnConfig } from 'components/tables/domain/ColumnConfig';
import { MantenimientoVehiculo } from './MantenimientoVehiculo';

export const configuracionColumnasMantenimientosVehiculos: ColumnConfig<MantenimientoVehiculo>[] = [
    {
        name: 'vehiculo',
        field: 'vehiculo',
        label: 'Placa',
        align: 'left',
        sortable: true,
    },
    {
        name: 'empleado',
        field: 'empleado',
        label: 'Chofer',
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
        name: 'estado',
        field: 'estado',
        label: 'Estado',
        align: 'left',
        sortable: true,
    },

]