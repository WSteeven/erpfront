import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Documento } from './Documento'

export const configuracionColumnasDocumento: ColumnConfig<Documento>[] = [
  {
    name: 'nombre',
    field: 'nombre',
    label: 'Nombre',
    align: 'left',
  },
  {
    name: 'tamanio_bytes',
    field: 'tamanio_bytes',
    label: 'Tamaño',
    align: 'left',
    editable: false,
  },
]
