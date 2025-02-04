import { CuentaBancaria } from 'pages/comprasProveedores/generadorCash/domain/CuentaBancaria'
import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { reactive } from 'vue'

export const configuracionColumnasCuentaBancariaSelectable: ColumnConfig<CuentaBancaria>[] = reactive([
  {
    name: 'tipo_cuenta',
    field: 'tipo_cuenta',
    label: 'Tipo cuenta',
    align: 'left',
  },
  {
    name: 'numero_cuenta',
    field: 'numero_cuenta',
    label: 'Número de cuenta',
    align: 'left',
  },
  {
    name: 'banco',
    field: 'banco',
    label: 'Banco',
    align: 'left',
  },
])
