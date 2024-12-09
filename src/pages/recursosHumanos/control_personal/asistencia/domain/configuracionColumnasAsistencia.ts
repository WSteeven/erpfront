import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Asistencia } from './Asistencia'

export const configuracionColumnasAsistencia: ColumnConfig<Asistencia>[] = [
    {
        name: 'empleado',
        field: 'empleado',
        label: 'Empleado',
        align: 'left',
        sortable: true
    },
    {
        name: 'fecha',
        field: 'fecha',
        label: 'Fecha',
        align: 'left',
        sortable: true
    },
    {
        name: 'hora_ingreso',
        field: 'hora_ingreso',
        label: 'Ingreso',
        align: 'center',
        sortable: true
    },
    {
        name: 'hora_salida_almuerzo',
        field: 'hora_salida_almuerzo',
        label: 'Salida Almuerzo',
        align: 'center',
        sortable: true
    },
    {
        name: 'hora_entrada_almuerzo',
        field: 'hora_entrada_almuerzo',
        label: 'Entrada Almuerzo',
        align: 'center',
        sortable: true
    },
    {
      name: 'hora_salida',
      field: 'hora_salida',
      label: 'Salida',
      align: 'center',
      sortable: true
  },
]
