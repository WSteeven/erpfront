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
    name: 'fecha_vencimiento',
    field: 'fecha_vencimiento',
    label: 'Fecha Vencimiento',
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
]
