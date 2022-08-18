import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { ControlProgresiva } from './ControlProgresiva'

export const configuracionColumnasTiposTareas: ColumnConfig<ControlProgresiva>[] =
  [
    {
      name: 'numero_poste',
      field: 'numero_poste',
      label: 'Número',
      align: 'left',
      sortable: true,
    },
    {
      name: 'tipo_elemento',
      field: 'tipo_elemento',
      label: 'Tipo elemento',
      align: 'left',
      sortable: true,
    },
    {
      name: 'tecnico',
      field: 'tecnico',
      label: 'Técnico',
      align: 'left',
      sortable: true,
    },
    {
      name: 'codigo_tarea_jp',
      field: 'codigo_tarea_jp',
      label: 'Tarea',
      align: 'left',
      sortable: true,
    },
    {
      name: 'codigo_subtarea_jp',
      field: 'codigo_subtarea_jp',
      label: 'Subtarea',
      align: 'left',
      sortable: true,
    },
    {
      name: 'propietario_elemento',
      field: 'propietario_elemento',
      label: 'Propietario',
      align: 'left',
      sortable: true,
    },
    {
      name: 'fecha',
      field: 'fecha',
      label: 'Fecha progresiva',
      align: 'left',
      sortable: true,
    },
  ]
