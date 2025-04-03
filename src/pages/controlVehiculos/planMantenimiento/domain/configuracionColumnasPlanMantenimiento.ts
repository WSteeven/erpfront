import { ColumnConfig } from 'components/tables/domain/ColumnConfig';
import { PlanMantenimiento } from './PlanMantenimiento';

export const configuracionColumnasPlanMantenimiento: ColumnConfig<PlanMantenimiento>[] = [
    {
        name: 'vehiculo',
        field: 'vehiculo',
        label: 'Placa',
        align: 'left',
        sortable: true,
    },
    {
        name: 'aplicar_desde',
        field: 'aplicar_desde',
        label: 'Aplicar desde (km)',
        align: 'left',
        sortable: true,
    },
    {
        name: 'cantidad_servicios',
        field: 'cantidad_servicios',
        label: 'Cant. Servicios',
        align: 'left',
        sortable: true,
    },
]