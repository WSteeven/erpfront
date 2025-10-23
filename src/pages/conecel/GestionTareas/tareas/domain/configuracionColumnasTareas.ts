import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Tarea } from 'pages/conecel/GestionTareas/tareas/domain/Tarea'

export const configuracionColumnasTarea: ColumnConfig<Tarea>[] = [
  {
    name: 'fecha',
    field: 'fecha',
    label: 'Fecha',
    align: 'left',
    sortable: true
  },
  {
    name: 'tipo_actividad',
    field: 'tipo_actividad',
    label: 'Tipo Actividad',
    align: 'left',
    sortable: true
  },
  {
    name: 'asignada',
    field: 'asignada',
    label: '¿Asignada?',
    align: 'left',
    sortable: true
  },
  {
    name: 'grupo',
    field: 'grupo',
    label: 'Cuadrilla',
    align: 'left',
    sortable: true
  },
  {
    name: 'estado_tarea',
    field: 'estado_tarea',
    label: 'Estado',
    align: 'left',
    sortable: true
  },
  {
    name: 'orden_trabajo',
    field: 'orden_trabajo',
    label: 'OT',
    align: 'left',
    sortable: true
  },
  {
    name: 'fecha',
    field: 'fecha',
    label: 'Nombre Cliente',
    align: 'left',
    sortable: true
  },
  {
    name: 'direccion',
    field: 'direccion',
    label: 'Dirección',
    align: 'left',
    sortable: true
  },
  {
    name: 'coordenadas',
    field: 'coordenadas',
    label: 'Coordenadas',
    align: 'left',
    sortable: true
  },
  {
    name: 'telefonos',
    field: 'telefonos',
    label: 'Telefonos',
    align: 'left',
    sortable: true
  }
]
