import { ColumnConfig } from 'components/tables/domain/ColumnConfig'

export const configuracionColumnasSubtareasRealizadasPorGrupoTiposTrabajosEmergencia: ColumnConfig<any>[] = [
  {
    name: 'grupo',
    field: 'grupo',
    label: 'Grupo',
    align: 'left',
    sortable: true,
  },
  {
    name: 'soporte',
    field: 'corte_fibra',
    label: 'Corte fibra',
    align: 'left',
    sortable: true,
  },
  {
    name: 'mantenimiento',
    field: 'mantenimiento',
    label: 'Mantenimiento',
    align: 'right',
    sortable: true,
  },
  {
    name: 'soporte',
    field: 'soporte',
    label: 'Soporte',
    align: 'left',
    sortable: true,
  },
  {
    name: 'tarea_programada',
    field: 'tarea_programada',
    label: 'Tarea programada',
    align: 'right',
    sortable: true,
  },
]
