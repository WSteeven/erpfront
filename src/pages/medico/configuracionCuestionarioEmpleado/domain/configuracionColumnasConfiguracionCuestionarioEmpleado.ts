import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { ConfiguracionCuestionarioEmpleado } from './ConfiguracionCuestionarioEmpleado'

export const configuracionColumnasConfiguracionCuestionarioEmpleado: ColumnConfig<ConfiguracionCuestionarioEmpleado>[] = [
  {
    name: 'fecha_hora_inicio',
    field: 'fecha_hora_inicio',
    label: 'Fecha y hora de Inicio',
    align: 'left',
    sortable: true
  },
  {
    name: 'fecha_hora_fin',
    field: 'fecha_hora_fin',
    label: 'Fecha y hora de fin',
    align: 'left',
    sortable: true
  },

]
