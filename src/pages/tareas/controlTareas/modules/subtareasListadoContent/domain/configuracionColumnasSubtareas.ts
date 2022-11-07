import { ColumnConfig } from "components/tables/domain/ColumnConfig"
import { Subtarea } from "pages/tareas/subtareas/domain/Subtarea"

export const configuracionColumnasSubtareas: ColumnConfig<Subtarea>[] = [
  {
    name: 'codigo_subtarea',
    field: 'codigo_subtarea',
    label: 'Cód. Subtarea',
    align: 'left',
    sortable: true,
  },
  {
    name: 'detalle',
    field: 'detalle',
    label: 'Detalle / Ruta / Enlace / Proyecto',
    align: 'left',
    sortable: true,
  },
  {
    name: 'tipo_trabajo',
    field: 'tipo_trabajo',
    label: 'Tipo de trabajo',
    align: 'left',
    sortable: true,
  },
  /*{
    name: 'fecha_asignacion',
    field: 'fecha_asignacion',
    label: 'Fecha asignación',
    align: 'left',
    sortable: true,
  },*/
  {
    name: 'grupo',
    field: 'grupo',
    label: 'Grupo',
    align: 'left',
    sortable: true,
  },
  {
    name: 'estado',
    field: 'estado',
    label: 'Estado',
    align: 'left',
    sortable: true,
  },
]
