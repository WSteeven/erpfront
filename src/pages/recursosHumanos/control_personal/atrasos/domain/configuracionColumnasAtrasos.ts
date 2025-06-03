import { ColumnConfig } from 'components/tables/domain/ColumnConfig';
import { Atrasos } from './Atrasos';

export const configuracionColumnasAtrasos: ColumnConfig<Atrasos>[] = [
  {
    name: 'empleado',
    field: 'empleado',
    label: 'Empleado',
    align: 'left',
    sortable: true,
  },
  {
    name: 'fecha_atraso',
    field: 'fecha_atraso',
    label: 'Fecha',
    align: 'left',
    sortable: true,
  },
  {
    name: 'ocurrencia',
    field: 'ocurrencia',
    label: 'Ocurrencia',
    align: 'right',
    sortable: true,
  },
  {
    name: 'tiempo_atraso',
    field: 'tiempo_atraso',
    label: 'Tiempo Atraso',
    align: 'right',
    sortable: true,
  },
  {
    name: 'segundos_atraso',
    field: 'segundos_atraso',
    label: 'Segundos',
    align: 'right',
    sortable: true,
  },
  {
    name: 'revisado',
    field: 'revisado',
    label: '¿Revisado?',
    align: 'right',
    sortable: true,
  },
  {
    name: 'justificacion',
    field: 'justificacion',
    label: 'Justificación Atraso (J.I.)',
    align: 'left',
    sortable: false,
  },
  {
    name: 'justificacion_atrasado',
    field: 'justificacion_atrasado',
    label: 'Justificación de Atraso (E.A.)',
    align: 'left',
    sortable: false,
  },
  {
    name: 'justificado_por_atrasado',
    field: 'justificado_por_atrasado',
    label: 'Justificado por Atrasado',
    align: 'left',
    sortable: false,
  },
];
