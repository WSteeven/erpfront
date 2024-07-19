import { ColumnConfig } from 'components/tables/domain/ColumnConfig';
import { Vacante } from './Vacante';

export const configuracionColumnasVacante: ColumnConfig<Vacante>[] = [
    {
        name: 'nombre',
        field: 'nombre',
        label: 'Nombre de Puesto',
        align: 'left',
        sortable: true
    },
    {
        name: 'tipo_puesto',
        field: 'tipo_puesto',
        label: 'Tipo de Puesto',
        align: 'left',
        sortable: true
    },
     {
        name: 'fecha_caducidad',
        field: 'fecha_caducidad',
        label: 'Fecha de Caducidad de Publicación',
        align: 'left',
        sortable: true
    },
]
