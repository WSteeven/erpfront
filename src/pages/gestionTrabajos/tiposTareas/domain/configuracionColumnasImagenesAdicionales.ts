import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { ImagenesAdicionales } from './ImagenesAdicionales'

export const configuracionColumnasImagenesAdicionales: ColumnConfig<ImagenesAdicionales>[] = [
  {
    name: 'etiqueta',
    field: 'etiqueta',
    label: 'Etiqueta',
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
