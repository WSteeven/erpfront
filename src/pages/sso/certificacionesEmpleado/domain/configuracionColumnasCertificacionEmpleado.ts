import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { CertificacionEmpleado } from './CertificacionEmpleado'

export const configuracionColumnasCertificacionEmpleado: ColumnConfig<CertificacionEmpleado>[] = [
  {
    name: 'empleado',
    field: 'empleado',
    label: 'Empleado',
    align: 'left',
  },
  {
    name: 'certificaciones',
    field: 'certificaciones',
    label: 'Certificaciones',
    align: 'left',
  },
]
