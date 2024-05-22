import { AntecedenteFamiliar } from './AntecedenteFamiliar'
import { ColumnConfig } from 'components/tables/domain/ColumnConfig'

export const configuracionColumnasAntecedenteFamiliar: ColumnConfig<AntecedenteFamiliar>[] = [
  {
    name: 'tipo_antecedente_familiar',
    field: 'tipo_antecedente_familiar',
    label: 'Antecedente familiar',
    align: 'left',
    sortable: true,
  },
  {
    name: 'descripcion',
    field: 'descripcion',
    label: 'Descripción',
    align: 'left',
    editable: true,
  },
]
