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
    {
        name: 'fecha_hora_asignacion',
        field: 'fecha_hora_asignacion',
        label: 'Fecha hora asignación',
        align: 'left',
        sortable: true,
    },
    {
        name: 'fecha_hora_ejecucion',
        field: 'fecha_hora_ejecucion',
        label: 'Fecha hora ejecución',
        align: 'left',
        sortable: true,
    },
    {
        name: 'fecha_hora_realizado',
        field: 'fecha_hora_realizado',
        label: 'Fecha hora realizado',
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
