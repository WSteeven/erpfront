import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Noticia } from './Noticia'

export const configuracionColumnasNoticias: ColumnConfig<Noticia>[] = [
  {
    name: 'titulo',
    field: 'titulo',
    label: 'Título',
    align: 'left',
    sortable: true
  },
  {
    name: 'descripcion',
    field: 'descripcion',
    label: 'Descripción',
    align: 'left',
    sortable: true
  },
  {
    name: 'fecha_creacion',
    field: 'fecha_creacion',
    label: 'Fecha de Creación',
    align: 'left',
    sortable: true
  },
  {
    name: 'autor',
    field: 'autor',
    label: 'Autor',
    align: 'left',
    sortable: true
  },
  {
    name: 'categoria',
    field: 'categoria',
    label: 'Categoría',
    align: 'left',
    sortable: true
  },
  {
    name: 'etiquetas',
    field: 'etiquetas',
    label: 'Etiquetas',
    align: 'left',
    sortable: true
  },
  {
    name: 'url_imagen',
    field: 'url_imagen',
    label: 'Imagen',
    align: 'left',
    sortable: true
  }
]
