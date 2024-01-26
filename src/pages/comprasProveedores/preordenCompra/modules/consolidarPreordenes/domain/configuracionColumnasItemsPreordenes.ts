import { ColumnConfig } from "components/tables/domain/ColumnConfig";

export const configuracionColumnasItemsPreorden: ColumnConfig<any>[] = [
    {
        name: 'producto',
        field: 'producto',
        label: 'Producto',
        align: 'left',
        sortable: true,
    },
    {
        name: 'descripcion',
        field: 'descripcion',
        label: 'Descripción',
        align: 'left',
        sortable: true,
    },
    {
        name: 'preordenes',
        field: 'preordenes',
        label: 'Preordenes',
        align: 'left',
        sortable: true,
    },
    {
        name: 'unidad_medida',
        field: 'unidad_medida',
        label: 'Medida',
        align: 'left',
        sortable: true,
    },
    {
        name: 'cantidad',
        field: 'cantidad',
        label: 'Cantidad',
        align: 'left',
        type: 'number',
        sortable: true,
        editable: true,
    },
]
