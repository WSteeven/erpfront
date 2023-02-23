import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { CamposAdicionales } from './CamposAdicionales'

export const configuracionColumnasCamposAdicionales: ColumnConfig<CamposAdicionales>[] = [
  {
    name: 'etiqueta',
    field: 'etiqueta',
    label: 'Etiqueta',
    align: 'left',
  },
  {
    name: 'tipo',
    field: 'tipo',
    label: 'Tipo',
    align: 'left',
  },
  {
    name: 'activo',
    field: 'activo',
    label: 'Activo',
    align: 'left',
    editable: false,
  },
]
