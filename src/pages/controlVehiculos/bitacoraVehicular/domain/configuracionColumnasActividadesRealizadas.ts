import { ColumnConfig } from "components/tables/domain/ColumnConfig";

export const configuracionColumnasActividadesRealizadas: ColumnConfig<any>[] = [
    {
        name: 'id',
        field: 'id',
        label: 'Id',
        align: 'left',
        sortable: true,
        editable: false,
        visible: false
    },
    {
        name: 'fecha_hora',
        field: 'fecha_hora',
        label: 'Fecha y Hora',
        align: 'left',
        sortable: true,
        editable: true,
    },
    {
        name: 'actividad',
        field: 'actividad',
        label: 'Actividad Realizada',
        align: 'left',
        type: 'textarea',
        sortable: true,
        editable: true,
    },
]