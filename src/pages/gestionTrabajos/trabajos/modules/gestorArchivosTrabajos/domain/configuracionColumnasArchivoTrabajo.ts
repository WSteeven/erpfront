import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Archivo } from './Archivo'

export const configuracionColumnasArchivoTrabajo: ColumnConfig<Archivo>[] = [
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
  {
    name: 'comentario',
    field: 'comentario',
    label: 'Comentario',
    align: 'left',
    editable: false,
  },
]
