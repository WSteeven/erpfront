import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Tecnico } from './Tecnico'

export const configuracionColumnasTecnico: ColumnConfig<Tecnico>[] = [
  {
    name: 'tecnico',
    field: 'tecnico',
    label: 'Técnico',
    align: 'left',
    sortable: true,
  },
  {
    name: 'grupo',
    field: 'grupo',
    label: 'Grupo',
    align: 'left',
    sortable: true,
  },
  {
    name: 'contacto',
    field: 'contacto',
    label: 'Contacto',
    align: 'left',
    sortable: true,
  },
  {
    name: 'disponibilidad',
    field: 'disponibilidad',
    label: 'Disponibilidad',
    align: 'left',
    sortable: true,
  },
  {
    name: 'observacion',
    field: 'observacion',
    label: 'Observación',
    align: 'left',
    sortable: true,
  },
]
