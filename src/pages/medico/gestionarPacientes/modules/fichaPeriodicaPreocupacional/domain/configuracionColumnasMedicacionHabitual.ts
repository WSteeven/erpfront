import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { MedicacionHabitual } from './MedicacionHabitual'

export const configuracionColumnasMedicacionHabitual: ColumnConfig<MedicacionHabitual>[] = [
  {
    name: 'nombre',
    field: 'nombre',
    label: 'Medicación habitual',
    align: 'left',
    sortable: true,
    editable: true,
  },
  {
    name: 'cantidad',
    field: 'cantidad',
    label: 'Cantidad(unidad)',
    align: 'left',
    sortable: true,
    editable: true,
    type: 'text',
  },
]
