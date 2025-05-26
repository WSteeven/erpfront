import {ColumnConfig} from 'components/tables/domain/ColumnConfig';
import {Progresiva} from 'pages/appenate/telconet/progresivas/domain/Progresiva';

export const configuracionColumnasProgresivas: ColumnConfig<Progresiva>[]=[
    {
        name: 'filename',
        field: 'filename',
        label: 'Nombre',
        align: 'left',
        sortable: true,
    },
    {
        name: 'proyecto',
        field: 'proyecto',
        label: 'Proyecto',
        align: 'left',
        sortable: true,
    },
    {
        name: 'ciudad',
        field: 'ciudad',
        label: 'Ciudad',
        align: 'left',
        sortable: true,
    },
    {
        name: 'enlace',
        field: 'enlace',
        label: 'Enlace',
        align: 'left',
        sortable: true,
    },
]