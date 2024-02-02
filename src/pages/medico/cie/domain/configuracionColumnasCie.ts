import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Cie } from './Cie'

export const configuracionColumnasCie: ColumnConfig<Cie>[] = [
  {
    name: 'codigo',
    field: 'codigo',
    label: 'Codigo',
    align: 'left',
    sortable: true
  },
  {
    name: 'nombre_enfermedad',
    field: 'nombre_enfermedad',
    label: 'Nombre',
    align: 'left',
    sortable: true
  },

]
