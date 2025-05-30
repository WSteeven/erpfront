import {ColumnConfig} from 'components/tables/domain/ColumnConfig';

export const  configuracionColumnasDepartamentosPendientesRecalificar: ColumnConfig<any>[]=[
    {
        name: 'departamento',
        field: 'departamento',
        label: 'Departamento',
        align: 'left',
        sortable: true,
    },
    {
        name: 'responsable',
        field: 'responsable',
        label: 'Responsable',
        align: 'left',
        sortable: true,
    },{
        name: 'proveedor',
        field: 'proveedor',
        label: 'Proveedor',
        align: 'left',
        sortable: true,
    },
    {
        name: 'debe_calificar',
        field: 'debe_calificar',
        label: 'Debe Calificar',
        align: 'left',
        sortable: true,
    },
    {
        name: 'fecha_creacion',
        field: 'fecha_creacion',
        label: 'F. Creación',
        align: 'left',
        sortable: true,
    },
    {
        name: 'ultima_calificacion',
        field: 'ultima_calificacion',
        label: 'Ult. Calificación',
        align: 'left',
        sortable: true,
    },

]