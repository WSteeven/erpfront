import { ColumnConfig } from 'components/tables/domain/ColumnConfig';
import { Justificacion } from './Justificacion';

export const configuracionColumnasJustificacion: ColumnConfig<Justificacion>[] = [
  {
    name: 'empleadoId',
    field: 'empleadoId',
    label: 'Empleado',
    align: 'left',
    sortable: true,
  },
  {
    name: 'fechaAtraso',
    field: 'fechaAtraso',
    label: 'Fecha de Atraso',
    align: 'left',
    sortable: true,
  },
  {
    name: 'horasAtraso',
    field: 'horasAtraso',
    label: 'Horas de Atraso',
    align: 'right',
    sortable: true,
  },
  {
    name: 'minutosAtraso',
    field: 'minutosAtraso',
    label: 'Minutos de Atraso',
    align: 'right',
    sortable: true,
  },
  {
    name: 'segundosAtraso',
    field: 'segundosAtraso',
    label: 'Segundos de Atraso',
    align: 'right',
    sortable: true,
  },
  {
    name: 'justificacion',
    field: 'justificacion',
    label: 'Justificación',
    align: 'left',
    sortable: false,
  },
];
