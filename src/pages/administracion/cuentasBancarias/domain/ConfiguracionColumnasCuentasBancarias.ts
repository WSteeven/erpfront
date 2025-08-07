import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { CuentaBancaria } from 'pages/administracion/cuentasBancarias/domain/CuentaBancaria'

export const configuracionColumnasCuentasBancarias: ColumnConfig<CuentaBancaria>[] =
  [
    {
      name: 'numero_cuenta',
      field: 'numero_cuenta',
      label: 'N° Cuenta',
      align: 'left',
      sortable: true
    },
    {
      name: 'tipo_cuenta',
      field: 'tipo_cuenta',
      label: 'Tipo Cuenta',
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
      name: 'es_principal',
      field: 'es_principal',
      label: '¿Es principal?',
      align: 'left',
      sortable: true
    },
    {
      name: 'observacion',
      field: 'observacion',
      label: 'Observación',
      align: 'left',
      sortable: true
    }
  ]
