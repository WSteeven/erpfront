import { ColumnConfig } from 'components/tables/domain/ColumnConfig';
import { RespuestaCuestionarioEmpleado } from './RespuestaCuestionarioEmpleado';

export const configuracionColumnasRespuestaCuestionarioEmpleado: ColumnConfig<RespuestaCuestionarioEmpleado>[] = [
  {
    name: 'empleado_info',
    field: 'empleado_info',
    label: 'Empleado',
    align: 'left',
    sortable: true
  },
  {
    name: 'cuestionario_info',
    field: 'cuestionario_info',
    label: 'Pregunta',
    align: 'left',
    sortable: true
  },
]
