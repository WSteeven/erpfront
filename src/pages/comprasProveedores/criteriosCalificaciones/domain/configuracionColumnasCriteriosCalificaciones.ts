import { ColumnConfig } from "components/tables/domain/ColumnConfig";
import { CriterioCalificacion } from "./CriterioCalificacion";

export const configuracionColumnasCriteriosCalificaciones: ColumnConfig<CriterioCalificacion>[] = [
    {
        name: 'nombre',
        field: 'nombre',
        label: 'Nombre',
        align: 'left',
        sortable: true
    },
    {
        name: 'descripcion',
        field: 'descripcion',
        label: 'Descripción',
        align: 'left',
        sortable: true
    },
    {
        name: 'ponderacion_referencia',
        field: 'ponderacion_referencia',
        label: 'Ponderación Referencia (%)',
        align: 'left',
        sortable: true,
        editable: false,
    },
    {
        name: 'departamento',
        field: 'departamento',
        label: 'Departamento',
        align: 'left',
        sortable: true
    },
    {
        name: 'oferta',
        field: 'oferta',
        label: 'Aplicable',
        align: 'left',
        sortable: true
    },
]
