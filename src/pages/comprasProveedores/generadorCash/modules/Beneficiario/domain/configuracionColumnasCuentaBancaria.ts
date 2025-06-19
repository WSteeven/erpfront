import { CuentaBancaria } from 'pages/comprasProveedores/generadorCash/domain/CuentaBancaria'
import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { tiposCuentasCash } from 'config/utils_compras_proveedores'
import { reactive } from 'vue'

export const configuracionColumnasCuentaBancaria: ColumnConfig<CuentaBancaria>[] = reactive([
  {
    name: 'tipo_cuenta',
    field: 'tipo_cuenta',
    label: 'Tipo cuenta',
    align: 'left',
    editable: true,
    type: 'select',
    options: tiposCuentasCash,
  },
  {
    name: 'numero_cuenta',
    field: 'numero_cuenta',
    label: 'Número de cuenta',
    align: 'left',
    editable: true,
  },
  {
    name: 'banco',
    field: 'banco',
    label: 'Banco',
    align: 'left',
    editable: true,
    type: 'select',
  },
])
