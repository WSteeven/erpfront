import { FichaAptitud } from 'medico/gestionarPacientes/modules/fichaAptitud/domain/FichaAptitud'
import { ColumnConfig } from 'components/tables/domain/ColumnConfig'

export const configuracionColumnasFichaMedica: ColumnConfig<FichaAptitud>[] = [
  {
    name: 'id',
    field: 'id',
    label: 'Código de ficha',
    align: 'left',
    sortable: true,
  },
  {
    name: 'created_at',
    field: 'created_at',
    label: 'Fecha de creación',
    align: 'left',
    sortable: true,
  },
  {
    name: 'profesional_salud',
    field: 'profesional_salud',
    label: 'Profesional salud',
    align: 'left',
    sortable: true,
  },
]
