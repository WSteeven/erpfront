import { ColumnConfig } from 'components/tables/domain/ColumnConfig';
import { HorarioLaboral } from './HorarioLaboral';

export const configuracionColumnasHorarioLaboral: ColumnConfig<HorarioLaboral>[] = [
    {
        name: 'horaEntrada',
        field: 'horaEntrada',
        label: 'Hora de Entrada',
        align: 'left',
        sortable: true
    },
    {
        name: 'horaSalida',
        field: 'horaSalida',
        label: 'Hora de Salida',
        align: 'left',
        sortable: true
    },
];
