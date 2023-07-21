import { ColumnConfig } from "components/tables/domain/ColumnConfig";
import { ItemOrdenCompra } from "./ItemOrdenCompra";
import { opcionesOfertas, opcionesUnidadesMedida } from "config/utils_compras_proveedores";
import { UnidadMedidaController } from "pages/bodega/unidades_medidas/infraestructure/UnidadMedidaController";

export const configuracionColumnasItemOrdenCompra: ColumnConfig<ItemOrdenCompra>[] =[
    {
        name: 'cantidad',
        field: 'cantidad',
        label: 'Cantidad',
        type: 'number',
        align: 'left',
        sortable: true,
    },
    {
        name: 'producto',
        field: 'producto',
        label: 'producto',
        align: 'left',
        editable: false,
        sortable: true
    },
    {
        name: 'descripcion',
        field: 'descripcion',
        label: 'Descripción',
        style: 'max-width: 200px; overflow: auto;',
        align: 'left',
        editable: false,
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
        name: 'precio_unitario',
        field: 'precio_unitario',
        label: 'Precio U',
        align: 'left',
        sortable: true
    },
    {
        name: 'facturable',
        field: 'facturable',
        label: '¿Facturable?',
        type: 'checkbox',
        align: 'left',
        default: true,
        sortable: true
    },
    {
        name: 'grava_iva',
        field: 'grava_iva',
        label: '¿IVA?',
        align: 'left',
        type: 'checkbox',
        default: true,
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
        label: '% descuento',
        align: 'left',
        type: 'number',
        sortable: true
    },
    {
        name: 'subtotal',
        field: 'subtotal',
        label: '% subtotal',
        align: 'left',
        type: 'number',
        editable: false,
        sortable: true
    },
    {
        name: 'total',
        field: 'total',
        label: '% total',
        align: 'left',
        type: 'number',
        editable: false,
        sortable: true
    },

]