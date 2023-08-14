import { opcionesUnidadesMedidas } from 'config/utils';
import { Proforma } from './Proforma';
import { ColumnConfig } from "components/tables/domain/ColumnConfig";

export const configuracionColumnasDetallesProforma: ColumnConfig<any>[] =[
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
        name: 'descripcion',
        field: 'descripcion',
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
        type:'select',
        options: opcionesUnidadesMedidas,
        editable: true,
        sortable: true
    },
    {
        name: 'precio_unitario',
        field: 'precio_unitario',
        label: 'Precio U',
        hint: 'Precio unitario',
        align: 'center',
        editable: true,
        sortable: true
    },
    {
        name: 'facturable',
        field: 'facturable',
        label: '¿Facturable?',
        type: 'toggle',
        align: 'center',
        default: true,
        editable: true,
        sortable: true
    },
    {
        name: 'grava_iva',
        field: 'grava_iva',
        label: '¿IVA?',
        align: 'center',
        type: 'toggle',
        default: true,
        editable: true,
        sortable: true
    },
    {
        name: 'iva',
        field: 'iva',
        label: 'IVA',
        align: 'left',
        type: 'number',
        editable: false,
        sortable: true
    },
    {
        name: 'porcentaje_descuento',
        field: 'porcentaje_descuento',
        hint: 'Porcentaje de descuento',
        label: '% desc.',
        align: 'left',
        type: 'number',
        editable: true,
        sortable: true
    },
    {
        name: 'descuento',
        field: 'descuento',
        hint: 'Desc.',
        label: 'Desc.',
        align: 'left',
        type: 'number',
        editable: false,
        sortable: true
    },
    {
        name: 'subtotal',
        field: 'subtotal',
        label: 'Subtotal',
        align: 'left',
        type: 'number',
        editable: false,
        sortable: true
    },
    {
        name: 'total',
        field: 'total',
        label: 'Total',
        align: 'left',
        type: 'number',
        editable: false,
        sortable: true
    },

]
