import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { iconos } from 'config/iconos'
import { reactive } from 'vue'
import { Pago } from './Pago'

export const configuracionColumnasPago: ColumnConfig<Pago>[] = reactive([
  {
    name: 'tipo',
    field: 'tipo',
    label: 'Tipo',
    align: 'left',
  },
  {
    name: 'num_cuenta_empresa',
    field: 'num_cuenta_empresa',
    label: 'Cta.empresa',
    align: 'left',
  },
  {
    name: 'beneficiario',
    field: 'beneficiario',
    label: 'Beneficiario',
    align: 'left',
    visible: false,
  },
  {
    name: 'identificacion_beneficiario',
    field: 'identificacion_beneficiario',
    label: 'Identificación beneficiario',
    align: 'left',
    editable: true,
    placeholder: 'Escriba y presione ENTER',
    icon: iconos.buscar
  },
  {
    name: 'tipo_documento',
    field: 'tipo_documento',
    label: 'Tipo documento',
    align: 'left',
  },
  {
    name: 'nombre_beneficiario',
    field: 'nombre_beneficiario',
    label: 'Nombre beneficiario',
    align: 'left',
  },
  {
    name: 'num_comprobante',
    field: 'num_comprobante',
    label: 'Núm.comprobante',
    align: 'left',
    editable: true,
    placeholder: 'Opcional',
  },
  {
    name: 'codigo_beneficiario',
    field: 'codigo_beneficiario',
    label: 'Cod.beneficiario',
    align: 'left',
  },
  {
    name: 'moneda',
    field: 'moneda',
    label: 'Moneda',
    align: 'left',
  },
  {
    name: 'valor',
    field: 'valor',
    label: 'Valor',
    align: 'left',
    editable: true,
    type: 'float',
    placeholder: 'Obligatorio',

  },
  {
    name: 'forma_pago',
    field: 'forma_pago',
    label: 'Forma pago',
    align: 'left',
  },
  {
    name: 'numero_cuenta',
    field: 'numero_cuenta',
    label: 'Número Cta.Beneficiario',
    align: 'left',
    editable: true,
    placeholder: 'Escriba y presione ENTER',
    icon: iconos.buscar
  },
  {
    name: 'codigo_banco',
    field: 'codigo_banco',
    label: 'Cód.Banco',
    align: 'left',
  },
  {
    name: 'tipo_cuenta',
    field: 'tipo_cuenta',
    label: 'Tipo de cuenta',
    align: 'left',
  },
  {
    name: 'referencia',
    field: 'referencia',
    label: 'Referencia',
    align: 'left',
    editable: true,
    type: 'textarea',
    placeholder: 'Obligatorio',
  },
  {
    name: 'referencia_adicional',
    field: 'referencia_adicional',
    label: 'Referencia adicional',
    align: 'left',
    editable: true,
    type: 'textarea',
    placeholder: 'Opcional',
  },
])
