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
    align: 'left',
    sortable: true,
  },
  {
    name: 'titulo',
    field: 'titulo',
    label: 'Título',
    align: 'left',
  },
  {
    name: 'proyecto',
    field: 'proyecto',
    label: 'Proyecto',
    align: 'center',
    sortable: true,
  },
  {
    name: 'cliente_final',
    field: 'cliente_final',
    label: 'Cliente final',
    sortable: true,
  },
  {
    name: 'coordinador',
    field: 'coordinador',
    label: 'Coordinador',
    align: 'center',
    sortable: true,
  },
  {
    name: 'fiscalizador',
    field: 'fiscalizador',
    label: 'Fiscalizador',
    align: 'center',
    sortable: true,
  },
  {
    name: 'cantidad_trabajos',
    field: 'cantidad_trabajos',
    label: 'Cantidad de trabajos',
    align: 'center',
    sortable: true,
  },
]
