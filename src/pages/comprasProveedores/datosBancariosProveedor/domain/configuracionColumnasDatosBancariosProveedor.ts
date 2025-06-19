import { ColumnConfig } from 'components/tables/domain/ColumnConfig';
import { DatoBancario } from './DatoBancario';

export const configuracionColumnasDatosBancariosProveedor: ColumnConfig<DatoBancario>[] = [
    {
        name: 'empresa',
        field: 'empresa',
        label: 'Empresa',
        align: 'left',
        sortable: true
    },
    {
        name: 'banco',
        field: 'banco',
        label: 'Banco',
        align: 'left',
        sortable: true
    },
    {
        name: 'tipo_cuenta',
        field: 'tipo_cuenta',
        label: 'Tipo Cuenta',
        align: 'left',
        sortable: true,
        editable: false,
    },
    {
        name: 'numero_cuenta',
        field: 'numero_cuenta',
        label: 'N° Cuenta',
        align: 'left',
        sortable: true
    },
    {
        name: 'nombre_propietario',
        field: 'nombre_propietario',
        label: 'Propietario',
        align: 'left',
        sortable: true
    },
    {
        name: 'identificacion',
        field: 'identificacion',
        label: 'N° Identificación',
        align: 'left',
        sortable: true
    },
]
