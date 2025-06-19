import { ColumnConfig } from 'components/tables/domain/ColumnConfig';
import { HorarioDeAlmuerzo } from './HorarioDeAlmuerzo';

export const configuracionColumnasHorarioDeAlmuerzo: ColumnConfig<HorarioDeAlmuerzo>[] = [
    {
        name: 'horaInicio',
        field: 'horaInicio',
        label: 'Hora de Inicio de Almuerzo',
        align: 'left',
        sortable: true
    },
    {
        name: 'horaFin',
        field: 'horaFin',
        label: 'Hora de Fin de Almuerzo',
        align: 'left',
        sortable: true
    },
];
