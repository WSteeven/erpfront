import { ColumnConfig } from "components/tables/domain/ColumnConfig";
import { ItemPreingresoMaterial } from "./ItemPreingresoMaterial";

export const configuracionColumnasItemPreingreso: ColumnConfig<ItemPreingresoMaterial>[] = [
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
        type: 'select',
        editable: false,
        sortable: true
    },
    {
        name: 'descripcion_original',
        field: 'descripcion_original',
        label: 'Descripción Original',
        editable: false,
        visible: false,
    },
    {
        name: 'descripcion',
        field: 'descripcion',
        label: 'Descripción',
        style: 'max-width: 200px; overflow: auto;',
        align: 'left',
        type: 'textarea',
        editable: false,
        sortable: true
    },
    {
        name: 'unidad_medida',
        field: 'unidad_medida',
        label: 'Medida',
        align: 'left',
        type: 'select',
        editable: false,
        sortable: false
    },
    {
        name: 'condicion',
        field: 'condicion',
        label: 'Condición',
        align: 'left',
        type: 'select',
        editable: true,
        sortable: false
    },
    {
        name: 'serial',
        field: 'serial',
        label: 'Serial',
        align: 'left',
        type: 'text',
        editable: true,
        sortable: true
    },
    {
        name: 'punta_inicial',
        field: 'punta_inicial',
        label: 'P. Inicio',
        align: 'left',
        type: 'number',
        editable: true,
        sortable: true
    },
    {
        name: 'punta_final',
        field: 'punta_final',
        hint: 'P. Fin',
        label: 'P. Fin',
        align: 'left',
        type: 'number',
        editable: true,
        sortable: true
    },
    {
        name: 'fotografia',
        field: 'fotografia',
        label: 'Fotografia',
        align: 'left',
        type: 'imagen',
        visible: false,
        hint: 'Opcional',
    },
    {
        name: 'nombre_alternativo',
        field: 'nombre_alternativo',
        label: 'Nombre alternativo',
        align: 'left',
        editable: true,
        visible: false,
        hint: 'Opcional, llena este campo solo en caso de que el ítem sea genérico',
    },
    {
        name: 'es_generico',
        field: 'es_generico',
        label: 'es_generico',
        editable: false,
        visible: false,
    },
]