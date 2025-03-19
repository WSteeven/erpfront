import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Asistencia } from './Asistencia'

export const configuracionColumnasAsistencia: ColumnConfig<Asistencia>[] = [
  {
    name: 'id',
    field: 'id',
    label: 'N°',
    align: 'left',
    sortable: true
  },
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
        type: 'date',
        sortable: true
    },
    {
        name: 'marcaciones',
        field: 'marcaciones',
        label: 'Marcaciones',
        align: 'center',
        sortable: true
    },

]
