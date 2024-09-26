import { ColumnConfig } from 'components/tables/domain/ColumnConfig';
import { CriterioCalificacion } from './CriterioCalificacion';
import { opcionesOfertas } from 'config/utils_compras_proveedores';

export const configuracionColumnasCriteriosCalificaciones: ColumnConfig<CriterioCalificacion>[] = [
    {
        name: 'nombre',
        field: 'nombre',
        label: 'Nombre',
        style: 'max-width: 150px; overflow: auto;',
        align: 'left',
        sortable: true
    },
    {
        name: 'descripcion',
        field: 'descripcion',
        label: 'Descripción',
        style: 'max-width: 300px; overflow: auto;',
        align: 'left',
        sortable: true
    },
    {
        name: 'ponderacion_referencia',
        field: 'ponderacion_referencia',
        label: 'Ponderación ref (%)',
        align: 'center',
        type: 'number',
        sortable: true,
        editable: true,
    },
    {
        name: 'departamento',
        field: 'departamento',
        label: 'Departamento',
        align: 'center',
        editable: false,
        sortable: true

    },
    {
        name: 'oferta',
        field: 'oferta',
        label: 'Aplicable',
        type: 'select',
        options: opcionesOfertas,
        align: 'center',
        sortable: true
    },
]
