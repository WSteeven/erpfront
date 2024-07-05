import { ColumnConfig } from 'components/tables/domain/ColumnConfig';
import { RegistroIncidente } from './RegistroIncidente';

export const configuracionColumnasRegistroIncidente: ColumnConfig<RegistroIncidente>[] = [
    {
        name: 'vehiculo',
        field: 'vehiculo',
        label: 'Vehículo',
        align: 'left',
        sortable: true,
    },
    {
        name: 'fecha',
        field: 'fecha',
        label: 'Fecha',
        align: 'left',
        sortable: true,
    },
    {
        name: 'tipo',
        field: 'tipo',
        label: 'Tipo',
        align: 'left',
        sortable: true,
    },
    {
        name: 'gravedad',
        field: 'gravedad',
        label: 'Gravedad',
        align: 'left',
        sortable: true,
    },
    {
        name: 'persona_reporta',
        field: 'persona_reporta',
        label: 'Persona Reporta',
        align: 'left',
        sortable: true,
    },
]