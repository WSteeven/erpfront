import { ColumnConfig } from "components/tables/domain/ColumnConfig";
import { CriterioCalificacion } from "./CriterioCalificacion";
import { opcionesOfertas } from "config/utils_compras_proveedores";

export const configuracionColumnasCriteriosCalificacionesConCalificacion: ColumnConfig<any>[] = [
    {
        name: 'nombre',
        field: 'nombre',
        label: 'Nombre',
        style: 'max-width: 150px; overflow: auto;',
        align: 'left',
        sortable: true
    },
    {
        name: 'comentario',
        field: 'comentario',
        label: 'comentario',
        style: 'max-width: 4000px; overflow: auto;',
        align: 'left',
        sortable: true
    },
    {
        name: 'peso',
        field: 'peso',
        label: 'Peso (%)',
        align: 'center',
        type: 'number',
        sortable: true,
        editable: true,
    },
    {
        name: 'puntaje',
        field: 'puntaje',
        label: 'Puntaje',
        align: 'center',
        editable: false,
        sortable: true

    },
    {
        name: 'calificacion',
        field: 'calificacion',
        label: 'Calificacion',
        align: 'center',
        sortable: true
    },
]
