import { ColumnConfig } from 'components/tables/domain/ColumnConfig';
import { ItemPago } from './ItemPago';

export const configuracionColumnasItemsPago: ColumnConfig<ItemPago>[] = [
    // {
    //     name: 'proveedor',
    //     field: 'proveedor',
    //     label: 'Proveedor',
    //     align: 'left',
    //     sortable: true
    // },
    {
        name: 'id',
        field: 'id',
        label: 'id',
        align: 'left',
        visible: false,
        sortable: true
    },
    {
        name: 'razon_social',
        field: 'razon_social',
        label: 'Razón Social',
        align: 'left',
        sortable: true
    },
    // {
    //     name: 'tipo_documento',
    //     field: 'tipo_documento',
    //     label: 'T. Doc.',
    //     align: 'left',
    //     sortable: true
    // },
    {
        name: 'num_documento',
        field: 'num_documento',
        label: '# Doc.',
        align: 'left',
        sortable: true
    },
    {
        name: 'descripcion',
        field: 'descripcion',
        label: 'Descripción.',
        align: 'left',
        sortable: true
    },
    {
        name: 'fecha_emision',
        field: 'fecha_emision',
        label: 'F. Emisión',
        align: 'left',
        sortable: true
    },
    {
        name: 'fecha_vencimiento',
        field: 'fecha_vencimiento',
        label: 'F. Vencimiento',
        align: 'left',
        sortable: true
    },
    // {
    //     name: 'centro_costo',
    //     field: 'centro_costo',
    //     label: 'C. Costo',
    //     align: 'left',
    //     sortable: true
    // },
    {
        name: 'plazo',
        field: 'plazo',
        label: 'Plazo',
        align: 'left',
        sortable: true
    },
    {
        name: 'total',
        field: 'total',
        label: 'Total',
        align: 'left',
        sortable: true
    },
    {
        name: 'valor_pagar',
        field: 'valor_pagar',
        label: 'V. Pagar',
        align: 'left',
        sortable: true
    }

]