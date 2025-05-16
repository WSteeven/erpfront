import { ColumnConfig } from 'components/tables/domain/ColumnConfig';
import { opcionesOfertas } from 'config/utils_compras_proveedores';

export const configuracionColumnasCriteriosCalificacionesConPeso: ColumnConfig<any>[] = [
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
        label: 'Ponderación referencia (%)',
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
    {
        name: 'peso',
        field: 'peso',
        label: 'Peso asignado (%)',
        align: 'center',
        type: 'number',
        sortable: true,
        editable: true,
    },
]
