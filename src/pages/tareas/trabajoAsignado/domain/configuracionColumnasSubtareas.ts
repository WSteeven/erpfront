import { ColumnConfig } from "components/tables/domain/ColumnConfig"
import { Subtarea } from "pages/tareas/controlTareas/modules/subtareas/domain/Subtarea"

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
        name: 'es_ventana',
        field: 'es_ventana',
        label: 'Es ventana',
        align: 'left',
    },
    {
        name: 'fecha_ventana',
        field: 'fecha_ventana',
        label: 'Fecha ventana',
        align: 'left',
    },
    {
        name: 'hora_inicio_ventana',
        field: 'hora_inicio_ventana',
        label: 'Hora inicio ventana',
        align: 'left',
    },
    {
        name: 'hora_fin_ventana',
        field: 'hora_fin_ventana',
        label: 'Hora fin ventana',
        align: 'left',
    },
    {
        name: 'subtarea_dependiente',
        field: 'subtarea_dependiente',
        label: 'Depende de',
        align: 'left',
    },
    {
        name: 'estado',
        field: 'estado',
        label: 'Estado',
        align: 'left',
        sortable: true,
    },
]
