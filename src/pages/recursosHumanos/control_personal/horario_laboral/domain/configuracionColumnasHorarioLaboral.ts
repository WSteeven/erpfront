import { ColumnConfig } from 'components/tables/domain/ColumnConfig';
import { HorarioLaboral } from './HorarioLaboral';

export const configuracionColumnasHorarioLaboral: ColumnConfig<HorarioLaboral>[] = [
    {
        name: 'tipo_horario',
        field: 'tipo_horario',
        label: 'Hora de Entrada',
        align: 'left',
        sortable: true
    },
    {
        name: 'hora_entrada',
        field: 'hora_entrada',
        label: 'Hora de Entrada',
        align: 'left',
        sortable: true
    },
    {
        name: 'hora_salida',
        field: 'hora_salida',
        label: 'Hora de Salida',
        align: 'left',
        sortable: true
    },
];
