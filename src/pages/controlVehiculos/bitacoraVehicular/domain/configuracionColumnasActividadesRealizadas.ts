import { ColumnConfig } from "components/tables/domain/ColumnConfig";

export const configuracionColumnasActividadesRealizadas: ColumnConfig<any>[]=[
    {
        name: 'fecha_hora',
        field: 'fecha_hora',
        label: 'Fecha y Hora',
        align: 'left',
        sortable: true,
    },
    {
        name: 'actividad',
        field: 'actividad',
        label: 'Actividad Realizada',
        align: 'left',
        sortable: true,
    },
]