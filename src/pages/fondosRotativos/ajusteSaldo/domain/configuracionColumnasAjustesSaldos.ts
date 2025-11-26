import { ColumnConfig } from 'components/tables/domain/ColumnConfig';
import { AjusteSaldo } from './AjusteSaldo';

export const configuracionColumnasAjustesSaldos: ColumnConfig<AjusteSaldo>[] = [
    {
        name: 'fecha',
        field: 'fecha',
        label: 'Fecha',
        align: 'left',
        sortable: true
    },{
        name: 'solicitante',
        field: 'solicitante',
        label: 'Realizado por',
        align: 'left',
        sortable: true
    },
    {
        name: 'destinatario',
        field: 'destinatario',
        label: 'Destinatario',
        align: 'left',
        sortable: true
    },
    {
        name: 'motivo',
        field: 'motivo',
        label: 'Motivo',
        align: 'left',
        sortable: true
    },
    {
        name: 'monto',
        field: 'monto',
        label: 'Monto',
        align: 'left',
        sortable: true
    },
]