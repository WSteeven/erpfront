import { ColumnConfig } from 'src/components/tables/domain/ColumnConfig'
import { Tarea } from '../domain/Tarea'

export const configuracionColumnasTareas: ColumnConfig<Tarea>[] = [
  {
    name: 'codigo_tarea',
    field: 'codigo_tarea',
    label: 'Código tarea',
    align: 'center',
    sortable: true,
  },
  {
    name: 'detalle',
    field: 'detalle',
    label: 'Detalle',
    align: 'center',
    sortable: true,
  },
  {
    name: 'proyecto',
    field: 'proyecto',
    label: 'Proyecto',
    align: 'center',
    sortable: true,
  },
  {
    name: 'codigo_tarea_cliente',
    field: 'codigo_tarea_cliente',
    label: 'Código tarea Cliente',
    align: 'center',
    sortable: true,
  },
  {
    name: 'cliente',
    field: 'cliente',
    label: 'Cliente',
    align: 'center',
    sortable: true,
  },
  {
    name: 'estado',
    field: 'estado',
    label: 'Estado',
    align: 'center',
    sortable: true,
  },
]
