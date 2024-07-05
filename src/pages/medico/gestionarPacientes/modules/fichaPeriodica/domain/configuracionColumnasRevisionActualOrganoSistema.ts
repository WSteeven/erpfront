import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { RevisionActualOrganoSistema } from './RevisionActualOrganoSistema'

export const configuracionColumnasRevisionActualOrganoSistema: ColumnConfig<RevisionActualOrganoSistema>[] = [
  {
    name: 'organo',
    field: 'organo',
    label: 'Organo sistema',
    align: 'left',
    sortable: true,
  },
  {
    name: 'descripcion',
    field: 'descripcion',
    label: 'Descripción',
    align: 'left',
    sortable: true,
    editable: true,
  },
]
