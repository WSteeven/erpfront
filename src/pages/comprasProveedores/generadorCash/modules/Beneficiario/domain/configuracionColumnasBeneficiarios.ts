import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Beneficiario } from './Beneficiario'
import { reactive } from 'vue'

export const configuracionColumnasBeneficiarios: ColumnConfig<Beneficiario>[] = reactive([
  {
    name: 'codigo_beneficiario',
    field: 'codigo_beneficiario',
    label: 'Codigo',
    align: 'left',
  },
  {
    name: 'tipo_documento',
    field: 'tipo_documento',
    label: 'Tipo de documento',
    align: 'left',
  },
  {
    name: 'identificacion_beneficiario',
    field: 'identificacion_beneficiario',
    label: 'Identificación',
    align: 'left',
  },
  {
    name: 'nombre_beneficiario',
    field: 'nombre_beneficiario',
    label: 'Nombres',
    align: 'left',
  },
  {
    name: 'resumen_cuentas_bancarias',
    field: 'resumen_cuentas_bancarias',
    label: 'Cuentas bancarias',
    align: 'left',
  },
  /* {
    name: 'telefono',
    field: 'telefono',
    label: 'Teléfono',
    align: 'left',
  },
  {
    name: 'localidad',
    field: 'localidad',
    label: 'Localidad',
    align: 'left',
  },
  {
    name: 'canton',
    field: 'canton',
    label: 'Canton',
    align: 'left',
  }, */
])
