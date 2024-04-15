import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { ActividadFisica } from './ActividadFisica'
import { RevisionActualOrganoSistema } from './RevisionActualOrganoSistema'

export const configuracionColumnasRevisionActualOrganoSistema: ColumnConfig<RevisionActualOrganoSistema>[] = [
  {
    name: 'organo_sistema',
    field: 'organo_sistema',
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
