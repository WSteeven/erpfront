import { ColumnConfig } from 'components/tables/domain/ColumnConfig';
import { Justificacion } from './Justificacion';

export const configuracionColumnasJustificacion: ColumnConfig<Justificacion>[] = [
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
    name: 'minutos_atraso',
    field: 'minutos_atraso',
    label: 'Minutos',
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
    name: 'requiere_justificacion',
    field: 'requiere_justificacion',
    label: '¿Justificado?',
    align: 'right',
    sortable: true,
  },
  {
    name: 'justificacion',
    field: 'justificacion',
    label: 'Justificación de Atraso',
    align: 'left',
    sortable: false,
  },
];
