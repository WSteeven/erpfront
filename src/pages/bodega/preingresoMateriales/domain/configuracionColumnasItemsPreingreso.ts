import { ColumnConfig } from "components/tables/domain/ColumnConfig";
import { ItemPreingresoMaterial } from "./ItemPreingresoMaterial";

export const configuracionColumnasItemPreingreso: ColumnConfig<ItemPreingresoMaterial>[] =[
    {
        name: 'cantidad',
        field: 'cantidad',
        label: 'Cantidad',
        type: 'number',
        align: 'left',
        editable: true,
        sortable: true,
    },
    {
        name: 'producto',
        field: 'producto',
        label: 'Producto',
        align: 'left',
        editable: false,
        sortable: true
    },
    {
        name: 'detalle',
        field: 'detalle',
        label: 'Descripción',
        style: 'max-width: 200px; overflow: auto;',
        align: 'left',
        editable: true,
        sortable: true
    },
    {
        name: 'unidad_medida',
        field: 'unidad_medida',
        label: 'Medida',
        align: 'left',
        editable: false,
        sortable: true
    },
    {
        name: 'punta_inicial',
        field: 'punta_inicial',
        label: 'P. Inicio',
        align: 'left',
        type: 'number',
        editable: false,
        sortable: true
    },
    {
        name: 'punta_final',
        field: 'punta_final',
        hint: 'P. Fin',
        label: '% desc.',
        align: 'left',
        type: 'number',
        editable: true,
        sortable: true
    },

]